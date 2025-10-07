import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// ✅ Correct Worker Path
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Preload check (optional)
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const res = await fetch(pdfUrl);
        if (!res.ok) throw new Error("Failed to fetch PDF");
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  };

  const onDocumentLoadError = (err) => {
    console.error("PDF load error:", err);
    setError(err.message);
    setLoading(false);
  };

  const nextPage = () => setPageNumber((p) => Math.min(p + 1, numPages));
  const prevPage = () => setPageNumber((p) => Math.max(p - 1, 1));

  const getPageWidth = () => (window.innerWidth > 768 ? 600 : window.innerWidth * 0.9);

  // ✅ Render States
  if (loading) return <div style={{ textAlign: "center", padding: "20px" }}>Loading PDF...</div>;
  if (error)
    return (
      <div style={{ textAlign: "center", color: "red", padding: "20px" }}>
        <h3>PDF Failed to Load</h3>
        <p>{error}</p>
        <p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Open PDF in New Tab
          </a>
        </p>
      </div>
    );

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div>Loading document...</div>}
      >
        <Page
          pageNumber={pageNumber}
          width={getPageWidth()}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      <div style={{ marginTop: "15px" }}>
        <button onClick={prevPage} disabled={pageNumber <= 1}>
          ◀ Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {pageNumber} of {numPages}
        </span>
        <button onClick={nextPage} disabled={pageNumber >= numPages}>
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default PdfViewer;
