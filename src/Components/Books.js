import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import RichDadPoorDad from './books/RichDadPoorDad';
import RichestManInBabylon from './RichestManInBabylon';

function Books() {
  const books = [
    { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", id: "rich-dad-poor-dad" },
    { title: "The Richest Man in Babylon", author: "George S. Clason", id: "richest-man-in-babylon" },
    { title: "Think and Grow Rich", author: "Napoleon Hill", id: "think-and-grow-rich" },
    { title: "The Psychology of Money", author: "Morgan Housel", id: "psychology-of-money" },
  ];

  return (
    <div className="books-list">
      <h2>Books to Read</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>
              {book.title} by {book.author}
            </Link>
          </li>
        ))}
      </ul>
      <Routes>
        {books.map((book) => (
          <Route
            key={book.id}
            path={`/books/${book.id}`}
            element={
              book.id === "rich-dad-poor-dad" ? (
                <RichDadPoorDad />
              ) : book.id === "richest-man-in-babylon" ? (
                <RichestManInBabylon />
              ) : (
                <div><h3>{book.title}</h3><p>Content coming soon!</p></div>
              )
            }
          />
        ))}
      </Routes>
    </div>
  );
}

export default Books;