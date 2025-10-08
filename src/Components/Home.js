import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";

function Home() {
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [userName, setUserName] = useState("Money Star");
  const [coins, setCoins] = useState(0);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [isConfirmHovered, setIsConfirmHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Authenticated user:", user);
      if (!user) {
        console.log("No user authenticated, redirecting to /signin");
        navigate("/signin");
        return;
      }
      await fetchUserData(user.uid);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      console.log("Document exists:", userDoc.exists());
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log("User data:", data);
        console.log("Username from Firestore:", data.username);
        setUserName(data.username && data.username.trim() !== "" ? data.username : "Money Star");
        setLessonsCompleted(data.lessonsCompleted || 0);
        setQuizScore(data.quizScore || 0);
        setCoins(data.coins || 0);
      } else {
        console.error("User document not found for UID:", uid);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to load user data. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Current userName:", userName);
    setProgressWidth(0);
    const timer = setTimeout(() => {
      setProgressWidth((lessonsCompleted / 10) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [lessonsCompleted, userName]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  const handleReward = async () => {
    if (coins < 500) {
      alert("Minimum 500 coins required!");
      return;
    }
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
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
      alert(`Rewarded ${coins} naira to Piggy Bank!`);
      setIsRewardModalOpen(false);
    } catch (error) {
      alert("Reward failed—try again!");
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <div className="logo">
        MC <span>Millionaire Child</span>
      </div>

      {/* Greeting */}
      <h2 className="greeting">
        Hi there, {userName || "Money Star"}!
      </h2>
      <p className="sub-greeting">What would you like to learn today?</p>

      {/* Progress Section */}
      <div className="progress-section">
        <h3>
          Your Progress <span className="target-icon">🎯</span>
        </h3>
        <div className="progress-item">
          <p>
            <span>Lessons Completed</span>
            <span>{lessonsCompleted}/10</span>
          </p>
          <div className="progress-bar">
            <div
              className="bar lessons-bar"
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
        </div>
        <div className="progress-item">
          <p>
            <span>Quiz Score</span>
            <span>{quizScore}%</span>
          </p>
          <div className="progress-bar">
            <div
              className="bar quiz-bar"
              style={{ width: `${quizScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="cards-section">
        <Link to="/money-lessons" className="card money-lessons">
          <div className="icon">📘</div>
          <h4>Money Lessons</h4>
          <p>Learn about saving, spending, and earning</p>
        </Link>
        <Link to="/quiz" className="card fun-quizzes">
          <div className="icon">🎯</div>
          <h4>Fun Quizzes</h4>
          <p>Test your money knowledge</p>
        </Link>
        <Link to="/progress-tracker" className="card progress-tracker">
          <div className="icon">🏆</div>
          <h4>Progress Tracker</h4>
          <p>See how much you’ve learned</p>
        </Link>
        <div className="card piggy-bank coming-soon">
          <div className="icon">💰</div>
          <h4>Piggy Bank</h4>
          <p>Coming Soon...</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bottom-message">
        <span className="bottom-icon">🪙</span> Keep saving, keep growing!
      </div>

      {/* Logout Button */}
      <button
        className="logout-btn bottom-logout"
        onClick={handleLogout}
        onMouseEnter={() => setIsLogoutHovered(true)}
        onMouseLeave={() => setIsLogoutHovered(false)}
        style={{
          display: 'block',
          margin: '20px auto', // Center and add space above
          backgroundColor: isLogoutHovered ? '#c82333' : '#dc3545',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
        aria-label="Logout from account"
      >
        Logout
      </button>

      {/* Reward Modal */}
      {isRewardModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reward Your Child</h3>
            <p>Reward {coins} naira to Piggy Bank? (Min 500 coins)</p>
            <div className="modal-buttons">
              <button
                className="confirm"
                onClick={handleReward}
                onMouseEnter={() => setIsConfirmHovered(true)}
                onMouseLeave={() => setIsConfirmHovered(false)}
                style={{
                  backgroundColor: isConfirmHovered ? '#218838' : '#28a745',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
                  transition: 'all 0.3s ease',
                  marginRight: '10px',
                }}
                aria-label="Confirm reward to Piggy Bank"
              >
                Confirm
              </button>
              <button
                className="cancel"
                onClick={() => setIsRewardModalOpen(false)}
                onMouseEnter={() => setIsCancelHovered(true)}
                onMouseLeave={() => setIsCancelHovered(false)}
                style={{
                  backgroundColor: isCancelHovered ? '#5a6268' : '#6c757d',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(108, 117, 125, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                aria-label="Cancel reward"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;