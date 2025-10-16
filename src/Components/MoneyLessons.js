import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MoneyLessons() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5faf6',
        padding: '40px 20px',
        fontFamily: '"Poppins", "Inter", sans-serif',
        textAlign: 'center',
      }}
    >
      {/* 🔙 Back Button */}
      <Link
        to="/home"
        style={{
          backgroundColor: '#1a362b',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '30px',
          transition: 'background-color 0.2s ease-in-out',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#2c5b45')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#1a362b')}
      >
        ← Back
      </Link>

      {/* 📘 Page Title */}
      <h2
        style={{
          color: '#1a362b',
          fontSize: '32px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        📘 Money Lessons
      </h2>

      {/* 📚 Lessons Options */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        <Link
          to="/lessons"
          style={{
            backgroundColor: '#c8e6c9', // Light green
            color: '#1a362b',
            padding: '14px 22px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '17px',
            fontWeight: '500',
            width: '240px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 5px 14px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
          }}
        >
          General Lessons
        </Link>

        <Link
          to="/full-books"
          style={{
            backgroundColor: '#e1bee7', // Light purple
            color: '#1a362b',
            padding: '14px 22px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '17px',
            fontWeight: '500',
            width: '240px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 5px 14px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
          }}
        >
          Books
        </Link>
      </div>
    </div>
  );
}

export default MoneyLessons;
