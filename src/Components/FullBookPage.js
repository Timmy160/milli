import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PdfViewer from "./PdfViewer";

const books = {
  "millionaire-child": {
    title: "Millionaire Child",
    pdfUrl: process.env.PUBLIC_URL + "/assets/millionaire-child-full.pdf",
    image: process.env.PUBLIC_URL + "/assets/millionaire-child-cover.jpg",
  },
  "adas-dream-bicycle": {
    title: "Ada's Dream Bicycle",
    pdfUrl: process.env.PUBLIC_URL + "/assets/adas-dream-bicycle.pdf",
    image: process.env.PUBLIC_URL + "/assets/adas-dream-bicycle-cover.jpg",
  },
    "jide-and-the-game-of-three-cups": {
    title: "Jide and the Game of Three Cups",
    pdfUrl: process.env.PUBLIC_URL + "/assets/jide-and-the-game-of-three-cups.pdf",
    image: process.env.PUBLIC_URL + "/assets/jide-and-the-game-of-three-cups.jpg",
  },
};

function FullBookPage() {
  const { bookId } = useParams();
  const book = books[bookId];

  useEffect(() => {
    console.log("📄 PDF URL:", book?.pdfUrl);
  }, [book?.pdfUrl]);

  if (!book) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "clamp(1rem, 4vw, 1.2rem)",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        Book not found!
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          flex: 1,
          overflowY: "hidden",
          overflowX: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          padding: "0",
        }}
      >
        <PdfViewer pdfUrl={book.pdfUrl} />
      </div>
    </div>
  );
}

export default FullBookPage;