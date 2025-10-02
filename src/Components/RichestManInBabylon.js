import React from 'react';
import PdfViewer from './PdfViewer';

function RichestManInBabylon() {
  return (
    <div>
      <h2>The Richest Man in Babylon Summary</h2>
      <PdfViewer pdfUrl="/assets/richest-man-in-babylon.pdf" />
    </div>
  );
}

export default RichestManInBabylon;
