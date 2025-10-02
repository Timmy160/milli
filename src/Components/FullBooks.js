import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth'; // Restored
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore'; // Restored
import { auth, db } from '../firebase'; // Restored

function FullBooks() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userUnlockedBooks, setUserUnlockedBooks] = useState([]); // Track unlocked books (unused for now)

  const fullBooks = [
    { title: "Millionaire Child", id: "millionaire-child", coverUrl: "https://via.placeholder.com/150x200?text=Millionaire+Child" }, // Placeholder image
    { title: "Ada's Dream Bicycle", id: "adas-dream-bicycle", coverUrl: "https://via.placeholder.com/150x200?text=Ada's+Dream+Bicycle" }, // Placeholder image
  ];

  // Load user data from Firebase (kept for consistency, though unused here)
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
    <div className="books-list">
      <h2>Full Books</h2>
      <ul>
        {fullBooks.map((book) => (
          <li key={book.id} className="book-item">
            <img src={book.coverUrl} alt={`${book.title} Cover`} className="book-cover" />
            <div>
              {book.title}
              <Link to={`/full-books/${book.id}`} className="unlocked-link">
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