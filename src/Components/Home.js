import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";

function Home() {
  const [quizScore, setQuizScore] = useState("0/0");
  const [quizPercentage, setQuizPercentage] = useState(0);
  const [motivation, setMotivation] = useState("Let's get started, champ! 💪");
  const [userName, setUserName] = useState("Money Star");
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user authenticated, redirecting to signin");
        navigate("/signin");
        return;
      }
      console.log("Authenticated user UID:", user.uid);
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
        console.log("User data:", data);
        const displayName =
          data.username?.trim() ||
          data.name?.trim() ||
          data.displayName?.trim() ||
          auth.currentUser?.displayName?.trim() ||
          "Money Star";
        setUserName(displayName);
      } else {
        console.log("No user document found for UID:", uid);
        setUserName(auth.currentUser?.displayName?.trim() || "Money Star");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserName(auth.currentUser?.displayName?.trim() || "Money Star");
    }
  };

  useEffect(() => {
    const savedProgress = localStorage.getItem("quizProgress");
    if (savedProgress) {
      const { totalCorrect, totalQuestions } = JSON.parse(savedProgress);
      const formattedScore = `${totalCorrect}/${totalQuestions}`;
      setQuizScore(formattedScore);
      if (totalQuestions > 0) {
        const percentage = Math.round((totalCorrect / totalQuestions) * 100);
        setQuizPercentage(percentage);
        setMotivationMessage(totalCorrect, totalQuestions);
      }
    }
  }, []);

  const setMotivationMessage = (correct, total) => {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    setQuizPercentage(percent);

    if (total === 0) {
      setMotivation("Let's get started, champ! 💪");
    } else if (percent <= 30) {
      setMotivation("Nice start, keep learning! 😅");
    } else if (percent <= 70) {
      setMotivation("You're improving fast! 😊");
    } else if (percent < 100) {
      setMotivation("Almost a pro! 😎");
    } else {
      setMotivation("Perfect score! You’re a true Money Star! 🏆");
    }
  };

  const getProgressColor = () => {
    if (quizPercentage === 0) return "rgba(128, 128, 128, 0.1)";
    if (quizPercentage <= 30) return "rgba(255, 99, 71, 0.15)";
    if (quizPercentage <= 70) return "rgba(255, 193, 7, 0.15)";
    if (quizPercentage < 100) return "rgba(40, 167, 69, 0.15)";
    return "rgba(0, 123, 255, 0.15)";
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div
      className="home-container"
      style={{
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
        color: "#222",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <div className="logo" style={{ fontStyle: "italic", fontWeight: "700" }}>
        MC <span style={{ color: "#28a745" }}>Millionaire Child</span>
      </div>

      <h2
        className="greeting"
        style={{
          fontStyle: "italic",
          marginTop: "20px",
          color: "#333",
          fontWeight: "600",
        }}
      >
        Hi {userName}! 🌟
      </h2>
      <p className="sub-greeting" style={{ color: "#666", marginBottom: "25px" }}>
        What would you like to learn today?
      </p>

      <motion.div
        className="progress-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: getProgressColor(),
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontWeight: "600",
            color: "#222",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          Your Progress 🎯
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={quizScore}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [1.2, 1],
              opacity: 1,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color:
                quizPercentage === 100
                  ? "#007bff"
                  : quizPercentage > 70
                  ? "#28a745"
                  : quizPercentage > 30
                  ? "#ffc107"
                  : "#dc3545",
              background: "#fff",
              display: "inline-block",
              padding: "10px 20px",
              borderRadius: "12px",
              marginTop: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {quizScore}
          </motion.div>
        </AnimatePresence>

        <motion.p
          key={motivation}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            marginTop: "10px",
            color: "#555",
            fontWeight: "500",
            fontSize: "15px",
          }}
        >
          {motivation}
        </motion.p>
      </motion.div>

      <div
        className="cards-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "20px",
        }}
      >
        <Link
          to="/money-lessons"
          style={{
            backgroundColor: "#f0f9f9",
            border: "2px solid #17a2b8",
            color: "#0c5460",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: "30px" }}>📘</div>
          <h4>Money Lessons</h4>
          <p>Learn about saving, spending, and earning</p>
        </Link>

        <Link
          to="/quiz"
          style={{
            backgroundColor: "#fff0f6",
            border: "2px solid #e83e8c",
            color: "#6f1d4f",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: "30px" }}>🎯</div>
          <h4>Fun Quizzes</h4>
          <p>Test your money knowledge</p>
        </Link>

        <Link
          to="/progress-tracker"
          style={{
            backgroundColor: "#fdf6e3",
            border: "2px solid #f0ad4e",
            color: "#8a6d3b",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: "30px" }}>🏆</div>
          <h4>Progress Tracker</h4>
          <p>Track your learning and achievements</p>
        </Link>

        <div
          style={{
            backgroundColor: "#eef6ff",
            border: "2px solid #007bff",
            color: "#004085",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "30px" }}>💰</div>
          <h4>Piggy Bank</h4>
          <p>Coming Soon...</p>
        </div>
      </div>

      <div
        style={{ marginTop: "40px", textAlign: "center", fontWeight: "500" }}
      >
        🪙 Keep saving, keep growing!
      </div>

      <button
        onClick={handleLogout}
        style={{
          display: "block",
          margin: "30px auto",
          backgroundColor: isLogoutHovered ? "#c82333" : "#dc3545",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "0.3s ease",
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