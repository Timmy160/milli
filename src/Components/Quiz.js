import React from 'react';
import { Link } from 'react-router-dom';

function Quiz() {
return (
  <div>
    <h2>Choose a Quiz Category</h2>
    <ul>
      <li>
        <Link to="/general-quiz">General Quiz</Link> {/* Fixed: no /quiz/ */}
      </li>
      <li>
        <Link to="/rich-dad-poor-dad-quiz">Rich Dad Poor Dad Quiz</Link> {/* Fixed: no /quiz/ */}
      </li>
    </ul>
  </div>
);
}

export default Quiz;