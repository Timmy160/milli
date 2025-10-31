import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ada from "../Components/Img/ada.jpg";
import milli from "../Components/Img/millichild.jpg";
import jid from "../Components/Img/jid.jpg";

function FullBooks() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userUnlockedBooks, setUserUnlockedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(new Set());   // <-- per-book loading
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fullBooks = [
    { title: "Millionaire Child", id: "millionaire-child", image: milli, priceNaira: 1999, locked: true },
    { title: "Ada's Dream Bicycle", id: "adas-dream-bicycle", image: ada, priceNaira: 999, locked: true },
    { title: "Jide and the Game of Three Cups", id: "jide-and-the-game-of-three-cups", image: jid, priceNaira: 999, locked: true },
  ];

  /* ------------------------------------------------------------------ */
  /*  Auth + Firestore user data                                         */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, { email: user.email, unlockedBooks: [] });
            setUserUnlockedBooks([]);
          } else {
            const data = userSnap.data();
            setUserUnlockedBooks(data?.unlockedBooks || []);
          }
        } catch (err) {
          console.error('Error loading user data:', err);
          setUserUnlockedBooks([]);
        }
      } else {
        setCurrentUser(null);
        setUserUnlockedBooks([]);
      }
      setDataLoaded(true);
    });

    return unsubscribe;
  }, []);

  const isUnlocked = (bookId) => {
    if (!dataLoaded) return false;
    return userUnlockedBooks.includes(bookId);
  };

  /* ------------------------------------------------------------------ */
  /*  Paystack helpers                                                   */
  /* ------------------------------------------------------------------ */
  const PAYSTACK_PUBLIC_KEY = "pk_live_0f9a6185f7febb9241d371545508426f7a6393d6";

  const loadPaystackScript = () => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) return resolve();

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v2/inline.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Paystack'));
      document.body.appendChild(script);
    });
  };

  /* ------------------------------------------------------------------ */
  /*  Buy handler – works for ONE book at a time                         */
  /* ------------------------------------------------------------------ */
  const handleBuy = async (book) => {
    if (!currentUser) {
      setError('Please sign in to purchase this book.');
      return;
    }
    if (isUnlocked(book.id)) {
      setError(`You’ve already unlocked "${book.title}".`);
      return;
    }
    if (loadingBooks.has(book.id)) return;               // prevent double-click

    setError(null);
    setLoadingBooks(prev => new Set(prev).add(book.id));

    try {
      await loadPaystackScript();
      const paystack = new window.PaystackPop();

      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: currentUser.email,
        amount: book.priceNaira * 100,      // Paystack expects kobo
        currency: "NGN",
        ref: `lb_${book.id}_${Date.now()}`,
        metadata: { book_id: book.id, user_id: currentUser.uid },

        // --------------------------------------------------------------
        //  Success → unlock in Firestore
        // --------------------------------------------------------------
        onSuccess: async (transaction) => {
          console.log("Payment Success:", transaction);
          try {
            const newList = [...new Set([...userUnlockedBooks, book.id])];
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, { unlockedBooks: newList });
            setUserUnlockedBooks(newList);
            alert(`Success! "${book.title}" is now unlocked!`);
          } catch (err) {
            console.error("Unlock failed:", err);
            setError("Payment OK, but unlock failed. Contact support.");
          }
        },

        // --------------------------------------------------------------
        //  Cancel / Error / Close → always clear loading state
        // --------------------------------------------------------------
        onCancel: () => console.log("Payment cancelled"),
        onError: (err) => {
          console.error("Paystack error:", err);
          setError(`Payment failed: ${err.message || "Try again"}`);
        },
        onClose: () => {
          // Popup closed (any reason) → stop spinner for this book
          setLoadingBooks(prev => {
            const next = new Set(prev);
            next.delete(book.id);
            return next;
          });
        },
      });
    } catch (err) {
      console.error("Setup error:", err);
      setError(`Error: ${err.message || "Check internet connection"}`);
      setLoadingBooks(prev => {
        const next = new Set(prev);
        next.delete(book.id);
        return next;
      });
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  if (!dataLoaded) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading books...</div>;
  }

  return (
    <div style={{
      padding: 'clamp(20px, 5vw, 40px)',
      maxWidth: 'min(90%, 1200px)',
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #FFF5CC 0%, #FFD6E8 100%)'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: 'clamp(20px, 4vw, 40px)',
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
        color: '#3a3a3a',
        fontWeight: '700',
        letterSpacing: '0.5px'
      }}>
        Full Books
      </h2>

      {error && (
        <div style={{
          color: 'crimson',
          background: '#ffebee',
          padding: '12px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontWeight: '500',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <ul style={{
        listStyle: 'none',
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
        gap: 'clamp(20px, 3vw, 30px)',
        width: '100%'
      }}>
        {fullBooks.map((book) => {
          const unlocked = isUnlocked(book.id);
          const isLoading = loadingBooks.has(book.id);

          return (
            <li
              key={book.id}
              style={{
                background: 'linear-gradient(145deg, #FFFFFF, #FAFAFA)',
                borderRadius: '20px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                position: 'relative',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Paid badge */}
              {unlocked && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#00C853',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  zIndex: 5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                  Paid
                </div>
              )}

              <div style={{ position: 'relative', background: '#f0f0f0' }}>
                {book.locked && !unlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.75)',
                    color: '#fff',
                    padding: '14px 28px',
                    borderRadius: '16px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    zIndex: 10,
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                  }}>
                    Pay ₦{book.priceNaira} to Unlock
                  </div>
                )}
                <img
                  src={book.image}
                  alt={`${book.title} cover`}
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'contain',
                    padding: '12px',
                    display: 'block',
                    filter: book.locked && !unlocked ? 'blur(5px) brightness(0.7)' : 'none',
                    transition: 'filter 0.3s ease'
                  }}
                />
              </div>

              <div style={{
                textAlign: 'center',
                padding: '20px',
                background: 'linear-gradient(90deg, #E3FDFD, #FFE2E2, #FFF5BA)',
                borderTop: '2px solid #eee'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  color: '#333',
                  fontWeight: '600',
                  margin: '0 0 14px 0',
                  lineHeight: '1.3'
                }}>
                  {book.title}
                </h3>

                {unlocked ? (
                  <Link
                    to={`/full-books/${book.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '12px 24px',
                      background: 'linear-gradient(90deg, #42A5F5, #478ED1)',
                      color: '#fff',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '1rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  >
                    Read Story
                  </Link>
                ) : (
                  <button
                    onClick={() => handleBuy(book)}
                    disabled={isLoading}
                    style={{
                      padding: '12px 24px',
                      background: isLoading
                        ? '#ccc'
                        : 'linear-gradient(90deg, #00C853, #B2FF59)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '700',
                      fontSize: '1rem',
                      minWidth: '160px',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isLoading ? 'Processing...' : `Pay ₦${book.priceNaira}`}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <Outlet />
    </div>
  );
}

export default FullBooks;