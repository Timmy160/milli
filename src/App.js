import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Lessons from './Components/Lessons';
import Quiz from './Components/Quiz';
import Books from './Components/Books';
import GeneralQuiz from './Components/quizzes/GeneralQuiz';
import BooksQuiz from './Components/quizzes/BooksQuiz';
import RichDadPoorDadQuiz from './Components/quizzes/JideQuiz';
import Splash from './Components/Splash';
import Signup from './Components/Signup';
import SignIn from './Components/SignIn';
import MoneyLessons from './Components/MoneyLessons';
import PiggyBank from './Components/PiggyBank';
import RichestManInBabylon from './Components/RichestManInBabylon';
import FullBooks from './Components/FullBooks';
import FullBookPage from './Components/FullBookPage'; // Make sure this exists!
import ProgressTracker from './Components/ProgressTracker';
import JideQuiz from './Components/quizzes/JideQuiz';
import AdaQuiz from './Components/quizzes/AdaQuiz';
import MillionaireChildQuiz from './Components/quizzes/MillionaireChildQuiz';

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
          <Route path="/jide-and-the-game-of-three-cups" element={<JideQuiz />} />
          <Route path="/adas-dream-bicycle" element={<AdaQuiz />} />
          <Route path="/millionaire-child-quiz" element={<MillionaireChildQuiz />} />
          <Route path="/general-quiz" element={<GeneralQuiz />} />
          <Route path="/quiz/books" element={<BooksQuiz />} />
          <Route path="/rich-dad-poor-dad-quiz" element={<RichDadPoorDadQuiz />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/money-lessons" element={<MoneyLessons />} />
          <Route path="/piggy-bank" element={<PiggyBank />} />
          <Route path="/books/richest-man-in-babylon" element={<RichestManInBabylon />} />
          <Route path="/full-books" element={<FullBooks />} />
          <Route path="/full-books/:bookId" element={<FullBookPage />} />
          <Route path="/progress-tracker" element={<ProgressTracker />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;