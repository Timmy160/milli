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
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "middle", // ⬅️ Pushed PDF + buttons downward, not centered vertically
        paddingTop: "0px", // ⬅️ Top padding from screen edge
        paddingBottom: "-10px",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px", // ⬅️ You can increase this for more padding around the PDF
          boxSizing: "border-box",
        }}
      >
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            width={window.innerWidth * 0.8} // ⬅️ Adjust width (0.9 = 90% of screen)
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* ⬇️ BUTTONS NOW BELOW THE PDF */}
      <div
        style={{
          marginTop: "-50px", // space between PDF and buttons
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          backgroundColor: "rgba(255,255,255,0.95)",
          padding: "5px 8px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          fontSize: "clamp(0.8rem, 3vw, 1rem)",
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
