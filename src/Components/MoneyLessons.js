import React from 'react';
import { Link } from 'react-router-dom';

function MoneyLessons() {
  return (
  <div>
    <Link to="/home" className="back-button">Back</Link>
    <h2>Money Lessons</h2>
    <Link to="/lessons">General Lessons</Link>
    <Link to="/books">Books Summaries</Link>
    <Link to="/full-books">Books</Link>
  </div>
);
}

export default MoneyLessons;