import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";

function Home() {
  const [quizScore, setQuizScore] = useState("0/0");
  const [quizPercentage, setQuizPercentage] = useState(0);
  const [motivation, setMotivation] = useState("Let's get started, champ!");
  const [userName, setUserName] = useState("Money Star");
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/signin");
        return;
      }
      if (mounted) await fetchUserData(user.uid);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, [navigate]);

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        const name =
          data.username?.trim() ||
          data.name?.trim() ||
          data.displayName?.trim() ||
          auth.currentUser?.displayName?.trim() ||
          "Money Star";
        setUserName(name);

        const prog = data.quizProgress || { totalCorrect: 0, totalQuestions: 0 };
        const { totalCorrect = 0, totalQuestions = 0 } = prog;

        setQuizScore(`${totalCorrect}/${totalQuestions}`);
        const percent =
          totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        setQuizPercentage(percent);
        setMotivationMessage(totalCorrect, totalQuestions);
      } else {
        setUserName(auth.currentUser?.displayName?.trim() || "Money Star");
        setQuizScore("0/0");
        setQuizPercentage(0);
        setMotivation("Let's get started, champ!");
      }
    } catch (e) {
      console.error("fetchUserData error:", e);
    }
  };

  const setMotivationMessage = (correct, total) => {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    if (total === 0) {
      setMotivation("Let's get started, champ!");
    } else if (pct <= 30) {
      setMotivation("Nice start, keep learning!");
    } else if (pct <= 70) {
      setMotivation("You're improving fast!");
    } else if (pct < 100) {
      setMotivation("Almost a pro!");
    } else {
      setMotivation("Perfect score! You’re a true Money Star!");
    }
  };

  const getProgressColor = () => {
    if (quizPercentage === 0) return "rgba(128,128,128,0.1)";
    if (quizPercentage <= 30) return "rgba(255,99,71,0.15)";
    if (quizPercentage <= 70) return "rgba(255,193,7,0.15)";
    if (quizPercentage < 100) return "rgba(40,167,69,0.15)";
    return "rgba(0,123,255,0.15)";
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
        background: "linear-gradient(180deg, #fefefe, #f6fff9)",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div
        className="logo"
        style={{
          fontStyle: "italic",
          fontWeight: "700",
          fontSize: "22px",
          textAlign: "center",
        }}
      >
        MC <span style={{ color: "#28a745" }}>Millionaire Child</span>
      </div>

      {/* Greeting */}
      <h2
        className="greeting"
        style={{
          fontStyle: "italic",
          marginTop: "25px",
          color: "#333",
          fontWeight: "700",
          textAlign: "center",
          fontSize: "24px",
        }}
      >
        Hi {userName}! 👋
      </h2>
      <p
        className="sub-greeting"
        style={{
          color: "#555",
          marginBottom: "25px",
          textAlign: "center",
          fontSize: "16px",
        }}
      >
        What would you like to learn today?
      </p>

      {/* Progress Section */}
      <motion.div
        className="progress-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: getProgressColor(),
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
          marginBottom: "35px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontWeight: "600",
            color: "#222",
            marginBottom: "10px",
            fontSize: "20px",
          }}
        >
          🌟 Your Progress
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
              fontSize: "26px",
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
              padding: "10px 24px",
              borderRadius: "14px",
              marginTop: "10px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
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
            color: "#444",
            fontWeight: "500",
            fontSize: "15px",
          }}
        >
          {motivation}
        </motion.p>
      </motion.div>

      {/* Cards Section */}
      <div
        className="cards-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "25px",
        }}
      >
        {[
          {
            emoji: "📖",
            title: "Money Lessons",
            text: "Learn about saving, spending, and earning",
            color1: "#d9f7f7",
            color2: "#b2ebf2",
            link: "/money-lessons",
          },
          {
            emoji: "🎯",
            title: "Fun Quizzes",
            text: "Test your money knowledge",
            color1: "#ffe1f0",
            color2: "#fbc8d4",
            link: "/quiz",
          },
          {
            emoji: "🏆",
            title: "Progress Tracker",
            text: "Track your learning achievements",
            color1: "#fff3cd",
            color2: "#ffeaa7",
            link: "/progress-tracker",
          },
          {
            emoji: "💵",
            title: "Piggy Bank",
            text: "Coming Soon...",
            color1: "#e0f0ff",
            color2: "#b3daff",
            link: "#",
          },
        ].map((card, i) => (
          <motion.div key={i} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>
            <Link
              to={card.link}
              style={{
                background: `linear-gradient(135deg, ${card.color1}, ${card.color2})`,
                borderRadius: "20px",
                padding: "24px 18px",
                textAlign: "center",
                textDecoration: "none",
                display: "block",
                color: "#333",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  fontSize: "42px",
                  marginBottom: "10px",
                  textShadow: "1px 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {card.emoji}
              </motion.div>
              <h4 style={{ fontWeight: "700", marginBottom: "8px", fontSize: "18px" }}>
                {card.title}
              </h4>
              <p style={{ fontSize: "14px", color: "#444" }}>{card.text}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer Message */}
      <div
        style={{
          marginTop: "50px",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "16px",
          color: "#333",
        }}
      >
        🌱 Keep saving, keep growing!
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          display: "block",
          margin: "30px auto",
          backgroundColor: isLogoutHovered ? "#ff4d4d" : "#ff6b6b",
          color: "white",
          padding: "12px 30px",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(255,107,107,0.4)",
          transition: "0.3s ease",
        }}
        onMouseEnter={() => setIsLogoutHovered(true)}
        onMouseLeave={() => setIsLogoutHovered(false)}
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default Home;
