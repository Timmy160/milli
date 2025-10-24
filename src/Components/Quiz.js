import React from "react";
import { Link } from "react-router-dom";

function Quiz() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5faf6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Poppins", sans-serif',
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          color: "#1A362B",
          fontSize: "26px",
          fontWeight: "600",
          marginBottom: "20px",
        }}
      >
        Choose a Quiz Category 📚
      </h2>

      <p
        style={{
          color: "#3a5d47",
          fontSize: "14px",
          marginBottom: "40px",
          maxWidth: "350px",
        }}
      >
        Test your knowledge and learn something new! Select a category to begin.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "100%",
          maxWidth: "300px",
        }}
      >
        <Link
          to="/general-quiz"
          style={{
            backgroundColor: "#1A362B",
            color: "white",
            padding: "14px 0",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#94BD0A")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#4caf50")
          }
        >
           General Quiz
        </Link>

        <Link
          to="/jide-and-the-game-of-three-cups"
          style={{
            backgroundColor: "#1A362B",
            color: "white",
            padding: "14px 0",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#94BD0A")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#4caf50")
          }
        >
           Jide and the game of three cups Quiz
        </Link>

         <Link
          to="/adas-dream-bicycle"
          style={{
            backgroundColor: "#1A362B",
            color: "white",
            padding: "14px 0",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#94BD0A")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#4caf50")
          }
        >
           ADA's dream bicycle Quiz
        </Link>

          <Link
          to="/millionaire-child-quiz"
          style={{
            backgroundColor: "#1A362B",
            color: "white",
            padding: "14px 0",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#94BD0A")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#4caf50")
          }
        >
           Millionaire Child Quiz
        </Link>

        {/* Future categories (optional placeholders) */}
        <Link
          to="#adas-dream-bicycle"
          style={{
            backgroundColor: "#94BD0A",
            color: "#1A362B",
            padding: "14px 0",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            opacity: 0.6,
            cursor: "not-allowed",
          }}
        >
          🔒 More Categories Coming Soon
        </Link>
      </div>
    </div>
  );
}

export default Quiz;
