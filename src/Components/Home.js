import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";

function Home() {
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [quizScore, setQuizScore] = useState("0/0");
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
      if (!user) {
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
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserName(data.username && data.username.trim() !== "" ? data.username : "Money Star");
        setLessonsCompleted(data.lessonsCompleted || 0);
        setCoins(data.coins || 0);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // ✅ Fetch quiz progress from localStorage
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("quizProgress"));
    if (savedProgress) {
      const { totalCorrect, totalQuestions } = savedProgress;
      setQuizScore(`${totalCorrect}/${totalQuestions}`);
    } else {
      setQuizScore("0/0");
    }
  }, []);

  useEffect(() => {
    setProgressWidth((lessonsCompleted / 10) * 100);
  }, [lessonsCompleted]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="home-container">
      <div className="logo">
        MC <span>Millionaire Child</span>
      </div>

      <h2 className="greeting">Hi there, {userName || "Money Star"}!</h2>
      <p className="sub-greeting">What would you like to learn today?</p>

      <div className="progress-section">
        <h3>Your Progress 🎯</h3>
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
            <span>{quizScore}</span>
          </p>
        </div>
      </div>

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

      <div className="bottom-message">
        <span className="bottom-icon">🪙</span> Keep saving, keep growing!
      </div>

      <button
        className="logout-btn bottom-logout"
        onClick={handleLogout}
        style={{
          display: "block",
          margin: "20px auto",
          backgroundColor: isLogoutHovered ? "#c82333" : "#dc3545",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsLogoutHovered(true)}
        onMouseLeave={() => setIsLogoutHovered(false)}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
