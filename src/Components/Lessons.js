import React, { useState } from "react";

function Lessons() {
  const [fadeOut, setFadeOut] = useState(false);

  const lessons = [
    { title: "Success Tip 1", content: "Set goals and work hard every day. Example: Want a new bike? Save a little each week." },
    { title: "Success Tip 2", content: "Learn from failures—they're lessons! Example: If you fall off your bike, try again smarter." },
    { title: "Success Tip 3", content: "Be persistent. Example: Like building a tower—if it falls, rebuild stronger." },
    { title: "Success Tip 4", content: "Help others to succeed. Example: Share tips with friends to grow together." },
  ];

  const handleOkay = () => {
    setFadeOut(true);
    setTimeout(() => {
      window.location.replace("/money-lessons"); // 👈 redirect target
    }, 400); // delay matches fade animation duration
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        color: "white",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        style={{
          backgroundColor: "#1A362B",
          padding: "30px 20px",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "420px",
          boxSizing: "border-box",
          boxShadow: "0 4px 25px rgba(0,0,0,0.3)",
          transform: fadeOut ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.4s ease",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>🚧 Coming Soon 🚧</h1>
        <p style={{ fontSize: "16px", opacity: 0.95, marginBottom: "20px" }}>
          Lessons on Success and Financial Literacy will be available soon.
        </p>
        <button
          onClick={handleOkay}
          style={{
            backgroundColor: "#94BD0A",
            color: "#1A362B",
            fontWeight: "bold",
            border: "none",
            padding: "10px 26px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.9")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          Okay
        </button>
      </div>
    </div>
  );
}

export default Lessons;
