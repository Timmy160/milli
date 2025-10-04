import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function Home() {
  const [lessonsCompleted, setLessonsCompleted] = useState(0); // Real: Start at 0
  const [quizScore, setQuizScore] = useState(0); // Real: Start at 0
  const [userName, setUserName] = useState('Loading...'); // For greeting
  const [coins, setCoins] = useState(0); // Real-time coins
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('No user, redirecting to signin');
        navigate('/signin');
        return;
      }
      console.log('🔥 User authenticated, UID:', user.uid);
      await fetchUserData(user.uid);
    });
    return unsubscribe;
  }, [navigate]);

  const fetchUserData = async (uid) => {
    try {
      console.log('🔍 Fetching Firestore doc for UID:', uid);
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('✅ Firestore data loaded:', data);
        setUserName(data.username || 'Money Star');
        setLessonsCompleted(data.lessonsCompleted || 0);
        setQuizScore(data.quizScore || 0);
        setCoins(data.coins || 0);
      } else {
        console.log('❌ No Firestore doc exists for UID:', uid);
        setUserName('Money Star');
        setLessonsCompleted(0);
        setQuizScore(0);
        setCoins(0);
      }
    } catch (error) {
      console.error('❌ Firestore fetch error:', error.code, error.message);
      setUserName('Money Star');
      setLessonsCompleted(0);
      setQuizScore(0);
      setCoins(0);
    }
  };

  // Debug button (remove in production)
  const testFetch = async () => {
    if (auth.currentUser) {
      await fetchUserData(auth.currentUser.uid);
    } else {
      alert('No user logged in!');
    }
  };

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
        coins: 0,
        realSavings: currentSavings + coins,
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
      <h2 className="greeting">Hi {userName}, Money Star! ⭐</h2>
      <p className="sub-greeting">What would you like to learn today?</p>
      <button onClick={testFetch} style={{ marginBottom: '10px', padding: '5px 10px', fontSize: '12px' }}>
        🔍 Test Fetch Data
      </button>
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