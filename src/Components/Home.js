import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function Home() {
  const [lessonsCompleted, setLessonsCompleted] = useState(3); // Fake start
  const [quizScore, setQuizScore] = useState(85); // Fake start
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0); // Real-time coins
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false); // New: Modal state

  useEffect(() => {
    const savedLessons = localStorage.getItem('lessonsCompleted') || 3;
    const savedQuiz = localStorage.getItem('quizScore') || 85;
    setLessonsCompleted(parseInt(savedLessons));
    setQuizScore(parseInt(savedQuiz));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/signin');
      }
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const data = userDoc.data();
          setCoins(data?.coins || 0);
        } catch (error) {
          setCoins(0);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleReward = async () => {
  if (coins < 500) {
    alert('Minimum 500 coins required to reward your child!');
    return;
  }
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    const currentSavings = userDoc.data()?.realSavings || 0;
    await updateDoc(userRef, {
      coins: 0, // Reset coins
      realSavings: currentSavings + coins, // Add coins as naira to savings
      rewardHistory: arrayUnion({
        amount: coins,
        date: new Date().toLocaleDateString(),
      }),
    });
    setCoins(0);
    alert(`Rewarded ${coins} naira to your child's Piggy Bank!`);
    setIsRewardModalOpen(false);
  } catch (error) {
    console.error('Reward error:', error);
    alert('Reward failed—try again!');
  }
};

  return (
    <div className="home-container">
      <h1 className="logo">MC Millionaire Child</h1>
      <h2 className="greeting">Hi there, Money Star! ⭐</h2>
      <p className="sub-greeting">What would you like to learn today?</p>
      <div className="progress-section">
        <h3>Your Progress <span className="target-icon">🎯</span></h3>
        <div className="progress-item">
          <p>Lessons Completed</p>
          <div className="progress-bar" style={{ width: `${(lessonsCompleted / 10 * 100)}%` }}></div>
          <p>{lessonsCompleted}/10</p>
        </div>
        <div className="progress-item">
          <p>Quiz Score</p>
          <div className="progress-bar quiz-bar" style={{ width: `${quizScore}%` }}></div>
          <p>{quizScore}%</p>
        </div>
        <div className="progress-item">
          <p>Coins Earned</p>
          <div className="progress-bar coins-bar" style={{ width: '100%' }}></div>
          <p>{coins} Coins</p>
          {coins >= 500 && (
            <button onClick={() => setIsRewardModalOpen(true)}>Reward Your Child</button>
          )}
        </div>
      </div>
      <div className="cards-section">
        <Link to="/money-lessons" className="card money-lessons">
          <span className="icon">📖</span>
          <h4>Money Lessons</h4>
          <p>Learn about saving, spending, and earning</p>
        </Link>
        <Link to="/quiz" className="card fun-quizzes">
          <span className="icon">❓</span>
          <h4>Fun Quizzes</h4>
          <p>Test your money knowledge</p>
        </Link>
        <Link to="/progress-tracker" className="card progress-tracker">
          <span className="icon">🏆</span>
          <h4>Progress Tracker</h4>
          <p>See how much you've learned</p>
        </Link>
        <Link to="/piggy-bank" className="card piggy-bank">
          <span className="icon">💰</span>
          <h4>Piggy Bank</h4>
          <p>Track your real savings</p>
        </Link>
      </div>
      <p className="bottom-message"><span className="bottom-icon">🪙</span> Keep saving, keep growing!</p>
      <button onClick={() => { localStorage.removeItem('loggedIn'); navigate('/'); }}>Log Out</button>

      {isRewardModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reward Your Child</h3>
            <p>Reward {coins} naira to your child's Piggy Bank? (Minimum 500 coins)</p>
            <button onClick={handleReward}>Confirm Reward</button>
            <button onClick={() => setIsRewardModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;