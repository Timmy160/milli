import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preload PDF file
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
  };

  const nextPage = () => setPageNumber((p) => Math.min(p + 1, numPages));
  const prevPage = () => setPageNumber((p) => Math.max(p - 1, 1));

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        Loading PDF...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "red",
        }}
      >
        <h3>PDF Failed to Load</h3>
        <p>{error}</p>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Open PDF in New Tab
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto", // ✅ allow vertical scroll
        backgroundColor: "#f8f8f8",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            width={Math.min(window.innerWidth * 0.9, 900)} // ✅ limits width for laptop screens
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* Page navigation buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          backgroundColor: "rgba(255,255,255,0.95)",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          position: "sticky",
          bottom: "10px",
          zIndex: 10,
        }}
      >
        <button
          onClick={prevPage}
          disabled={pageNumber <= 1}
          style={{
            padding: "6px 10px",
            fontSize: "inherit",
            cursor: pageNumber <= 1 ? "not-allowed" : "pointer",
            backgroundColor: pageNumber <= 1 ? "#ccc" : "#2672c4",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          ◀ Prev
        </button>

        <span style={{ color: "#000" }}>
          {pageNumber} / {numPages}
        </span>

        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          style={{
            padding: "6px 10px",
            fontSize: "inherit",
            cursor: pageNumber >= numPages ? "not-allowed" : "pointer",
            backgroundColor: pageNumber >= numPages ? "#ccc" : "#2672c4",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default PdfViewer;
