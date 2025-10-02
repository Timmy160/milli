import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'; // Ensure worker is accessible

function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preload PDF to reduce lag
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const response = await fetch(pdfUrl, { mode: 'cors' });
        if (!response.ok) throw new Error('PDF fetch failed');
      } catch (err) {
        setError(err.message || 'Failed to fetch PDF');
        setLoading(false);
      }
    };
    loadPdf();
  }, [pdfUrl]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error) {
    console.error('PDF Error:', error);
    setError(error.message || 'Failed to load PDF');
    setLoading(false);
  }

  const handlePrevious = () => setPageNumber(pageNumber > 1 ? pageNumber - 1 : 1);
  const handleNext = () => setPageNumber(pageNumber < numPages ? pageNumber + 1 : numPages);

  const getPageWidth = () => (window.innerWidth > 768 ? 600 : window.innerWidth * 0.9);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading PDF...</div>;
  if (error) return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
      <h3>PDF Failed to Load</h3>
      <p>Error: {error}</p>
      <p><a href={pdfUrl} target="_blank" rel="noopener noreferrer">Open in New Tab</a></p>
    </div>
  );

  return (
    <div className="pdf-viewer">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        options={{ workerSrc: '/pdf.worker.min.mjs' }}
        loading={<div style={{ padding: '20px' }}>Loading...</div>}
      >
        <Page 
          pageNumber={pageNumber} 
          width={getPageWidth()}
          renderTextLayer={false} // Disable to speed up mobile
          renderAnnotationLayer={false} // Disable to reduce load
          loading={<div style={{ padding: '10px' }}>Loading page...</div>}
        />
      </Document>
      <div className="pdf-navigation">
        <button onClick={handlePrevious} disabled={pageNumber <= 1}>Previous</button>
        <button onClick={handleNext} disabled={pageNumber >= numPages}>Next</button>
      </div>
    </div>
  );
}

export default PdfViewer;