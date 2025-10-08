import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set the worker source for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageScale, setPageScale] = useState(calculatePageScale());

  // Calculate scale to fill screen
  function calculatePageScale() {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;
    // Aggressive scale for mobile to maximize readability
    const baseScale = isMobile ? screenWidth / 200 : screenWidth / 400;
    return Math.max(baseScale * (window.devicePixelRatio || 1), 2); // Boost for high-DPI screens
  }

  // Update scale on window resize
  useEffect(() => {
    const handleResize = () => {
      setPageScale(calculatePageScale());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Preload PDF check
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

  // Render loading state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "clamp(1rem, 4vw, 1.2rem)",
        }}
      >
        Loading PDF...
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "red",
          fontSize: "clamp(1rem, 4vw, 1.2rem)",
        }}
      >
        <h3>PDF Failed to Load</h3>
        <p>{error}</p>
        <p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Open PDF in New Tab
          </a>
        </p>
      </div>
    );
  }

  return (
    <>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div>Loading document...</div>}
      >
        <Page
          pageNumber={pageNumber}
          scale={pageScale}
          renderTextLayer={true}
          renderAnnotationLayer={false}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </Document>
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          position: "fixed",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(184, 184, 210, 0.8)",

          padding: "5px",
          borderRadius: "4px",
        }}
      >
        <button
          onClick={prevPage}
          disabled={pageNumber <= 1}
          style={{
            padding: "8px 16px",
            fontSize: "clamp(0.9rem, 3vw, 1rem)",
            cursor: pageNumber <= 1 ? "not-allowed" : "pointer",
            backgroundColor: pageNumber <= 1 ? "#ccc" : "#2672c4ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          ◀ Prev
        </button>
        <span style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)" }}>
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          style={{
            padding: "8px 16px",
            fontSize: "clamp(0.9rem, 3vw, 1rem)",
            cursor: pageNumber >= numPages ? "not-allowed" : "pointer",
            backgroundColor: pageNumber >= numPages ? "#ccc" : "#2672c4ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Next ▶
        </button>
      </div>
    </>
  );
}

export default PdfViewer;