import React from 'react';
import { Link } from 'react-router-dom';

function MoneyLessons() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5faf6', // Same background as Home
        padding: '20px 10px',
        fontFamily: '"Poppins", "Inter", sans-serif',
        textAlign: 'center',
      }}
    >
      <Link
        to="/home"
        style={{
          backgroundColor: '#1a362b', // Dark green from Home's logout button
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '20px',
          transition: 'background-color 0.2s ease-in-out',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#2c5b45')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#1a362b')}
      >
        Back
      </Link>
      <h2
        style={{
          backgroundColor: '#c8e6c9', // Light green from Home's money-lessons card
          color: '#1a362b',
          padding: '10px 20px',
          borderRadius: '10px',
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '20px',
        }}
      >
        Money Lessons
      </h2>
      <Link
        to="/lessons"
        style={{
          backgroundColor: '#bbdefb', // Light blue from Home's fun-quizzes card
          color: '#1a362b',
          padding: '12px 20px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500',
          marginBottom: '15px',
          display: 'block',
          width: '200px',
          transition: 'transform 0.2s ease',
        }}
        onMouseOver={(e) => (e.target.style.transform = 'translateY(-3px)')}
        onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
      >
        General Lessons
      </Link>
      <Link
        to="/books"
        style={{
          backgroundColor: '#ffe0b2', // Light orange from Home's progress-tracker card
          color: '#1a362b',
          padding: '12px 20px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500',
          marginBottom: '15px',
          display: 'block',
          width: '200px',
          transition: 'transform 0.2s ease',
        }}
        onMouseOver={(e) => (e.target.style.transform = 'translateY(-3px)')}
        onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
      >
        Books Summaries
      </Link>
      <Link
        to="/full-books"
        style={{
          backgroundColor: '#e1bee7', // Light purple from Home's piggy-bank card
          color: '#1a362b',
          padding: '12px 20px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500',
          marginBottom: '15px',
          display: 'block',
          width: '200px',
          transition: 'transform 0.2s ease',
        }}
        onMouseOver={(e) => (e.target.style.transform = 'translateY(-3px)')}
        onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
      >
        Books
      </Link>
    </div>
  );
}

export default MoneyLessons;