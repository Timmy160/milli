import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase'; 
import ada from "../Components/Img/ada.jpg"
import milli from "../Components/Img/millichild.jpg"

function FullBooks() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userUnlockedBooks, setUserUnlockedBooks] = useState([]); 

  const fullBooks = [
    { title: "Millionaire Child", id: "millionaire-child", image: milli },
    { title: "Ada's Dream Bicycle", id: "adas-dream-bicycle", image: ada },
  ];

  // Load user data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const data = userDoc.data();
          setUserUnlockedBooks(data?.unlockedBooks || []);
        } catch (error) {
          console.error('Error loading user data:', error);
          setUserUnlockedBooks([]);
        }
      } else {
        setCurrentUser(null);
        setUserUnlockedBooks([]);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div style={{ 
      padding: 'clamp(20px, 5vw, 40px)', 
      maxWidth: 'min(90%, 1200px)', 
      margin: '0 auto', 
      backgroundColor: '#fafafa', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: 'clamp(20px, 4vw, 40px)', 
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
        color: '#2d2d2d', 
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        Full Books
      </h2>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', 
        gap: 'clamp(20px, 3vw, 30px)', 
        width: '100%' 
      }}>
        {fullBooks.map((book) => (
          <li 
            key={book.id} 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '16px', 
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)', 
              overflow: 'hidden', 
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            <Link 
              to={`/full-books/${book.id}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img 
                src={book.image} 
                alt={`${book.title} cover`} 
                style={{ 
                  width: '100%', 
                  maxHeight: 'clamp(250px, 40vw, 350px)', 
                  objectFit: 'contain', 
                  display: 'block',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                  padding: '10px',
                  boxSizing: 'border-box'
                }}
              />
            </Link>
            <div style={{ 
              padding: 'clamp(15px, 3vw, 20px)', 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px' 
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', 
                color: '#1a1a1a', 
                fontWeight: '500',
                lineHeight: '1.4'
              }}>
                {book.title}
              </h3>
              <Link 
                to={`/full-books/${book.id}`} 
                style={{ 
                  display: 'inline-block',
                  padding: '10px 20px',
                  backgroundColor: '#1e90ff',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease'
                }}
              >
                Read Book (Free for Testing)
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}

export default FullBooks;