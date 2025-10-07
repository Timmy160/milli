import React, { useEffect } from "react"; // ✅ make sure useEffect is imported here
import { useParams } from "react-router-dom";
import PdfViewer from "./PdfViewer";


const books = {
  "millionaire-child": {
    title: "Millionaire Child",
    pdfUrl: process.env.PUBLIC_URL + "/assets/millionaire-child-full.pdf", // ✅ Properly reference from /public/assets/
  },
  "adas-dream-bicycle": {
    title: "Ada's Dream Bicycle",
    pdfUrl: process.env.PUBLIC_URL + "/assets/adas-dream-bicycle.pdf",
  },
};

function FullBookPage() {
  const { bookId } = useParams();
  const book = books[bookId];

   // ✅ Debug log in proper position
 useEffect(() => {
    console.log("📄 PDF URL:", book.pdfUrl);
    
  }, [book.pdfUrl]);
  // ✅ Handle invalid bookId
  if (!book) return <div style={{ padding: "20px" }}>Book not found!</div>;

 
 

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h3>{book.title}</h3>
      {/* <img
        src={book.image}
        alt={`${book.title} cover`}
        style={{
          maxWidth: "200px",
          borderRadius: "8px",
          margin: "10px 0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      /> */}
      <PdfViewer pdfUrl={book.pdfUrl} />
    </div>
  );
}

export default FullBookPage;
