import React from 'react';
import { Link } from 'react-router-dom';

function BooksQuiz() {
  return (
    <div>
      <h2>Books Quizzes</h2>
      <ul>
        <li><Link to="/quiz/books/rich-dad-poor-dad">Rich Dad Poor Dad Quiz</Link></li>
        {/* Add more like this later for other books */}
      </ul>
    </div>
  );
}

export default BooksQuiz;