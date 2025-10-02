import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Lessons from './Components/Lessons';
import Quiz from './Components/Quiz';
import Books from './Components/Books';
import RichDadPoorDad from './Components/books/RichDadPoorDad';
import GeneralQuiz from './Components/quizzes/GeneralQuiz';
import BooksQuiz from './Components/quizzes/BooksQuiz';
import RichDadPoorDadQuiz from './Components/quizzes/RichDadPoorDadQuiz';
import Splash from './Components/Splash';
import Signup from './Components/Signup';
import SignIn from './Components/SignIn';
import MoneyLessons from './Components/MoneyLessons';
import PiggyBank from './Components/PiggyBank';
import RichestManInBabylon from './Components/RichestManInBabylon';
import FullBooks from './Components/FullBooks';
import FullBookPage from './Components/FullBookPage'; // Make sure this exists!

function App() {
  return (
    <Router>
      <div className="content">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/books/*" element={<Books />} />
          <Route path="/books/rich-dad-poor-dad" element={<RichDadPoorDad />} />
          <Route path="/general-quiz" element={<GeneralQuiz />} />
          <Route path="/quiz/books" element={<BooksQuiz />} />
          <Route path="/rich-dad-poor-dad-quiz" element={<RichDadPoorDadQuiz />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/money-lessons" element={<MoneyLessons />} />
          <Route path="/piggy-bank" element={<PiggyBank />} />
          <Route path="/books/richest-man-in-babylon" element={<RichestManInBabylon />} />
          {/* Standalone Full Books list */}
          <Route path="/full-books" element={<FullBooks />} />
          {/* Standalone book PDF viewer, no FullBooks list above */}
          <Route path="/full-books/:bookId" element={<FullBookPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;