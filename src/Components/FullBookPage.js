import React from 'react';
import { useParams } from 'react-router-dom';
import PdfViewer from './PdfViewer';

const books = {
  "millionaire-child": {
    title: "Millionaire Child",
    pdfUrl: "/assets/millionaire-child-full.pdf"
  },
  "adas-dream-bicycle": {
    title: "Ada's Dream Bicycle",
    pdfUrl: "/assets/adas-dream-bicycle.pdf"
  },
};

function FullBookPage() {
  const { bookId } = useParams();
  const book = books[bookId];
  if (!book) return <div>Book not found!</div>;
  return (
    <div>
      <h3>{book.title} PDF</h3>
      <PdfViewer pdfUrl={book.pdfUrl} />
    </div>
  );
}

export default FullBookPage;