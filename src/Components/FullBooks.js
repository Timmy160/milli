import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ada from "../Components/Img/ada.jpg";
import milli from "../Components/Img/millichild.jpg";
import jid from "../Components/Img/jid.jpg";

function FullBooks() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userUnlockedBooks, setUserUnlockedBooks] = useState([]);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fullBooks = [
    { title: "Millionaire Child", id: "millionaire-child", image: milli, priceNaira: 2000, locked: true },
    { title: "Ada's Dream Bicycle", id: "adas-dream-bicycle", image: ada, locked: false },
    { title: "Jide and the Game of Three Cups", id: "jide-and-the-game-of-three-cups", image: jid, locked: false },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const data = userDoc.data();

          if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              unlockedBooks: []
            }, { merge: true });
          }

          setUserUnlockedBooks(data?.unlockedBooks || []);
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

  const isUnlocked = (book) => {
    if (!dataLoaded) return false;
    if (!book.locked) return true;
    return userUnlockedBooks.includes(book.id);
  };

  // YOUR REAL PAYSTACK TEST KEY
  const PAYSTACK_PUBLIC_KEY = "pk_live_0f9a6185f7febb9241d371545508426f7a6393d6";

  const loadPaystackScript = () => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) {
        console.log("Paystack already loaded");
        resolve();
        return;
      }

      console.log("Loading Paystack v2...");
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v2/inline.js';
      script.async = true;
      script.onload = () => {
        console.log("Paystack v2 loaded!");
        resolve();
      };
      script.onerror = () => {
        console.error("Script failed");
        reject(new Error('Failed to load Paystack'));
      };
      document.body.appendChild(script);
    });
  };

  const handleBuy = async (book) => {
    if (!currentUser) {
      setError('Please sign in to purchase this book.');
      return;
    }
    setError(null);
    setLoadingBuy(true);

    try {
      await loadPaystackScript();
      const paystack = new window.PaystackPop();

      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: currentUser.email,
        amount: book.priceNaira * 100,
        currency: "NGN",
        ref: `lb_${book.id}_${Date.now()}`,
        metadata: { book_id: book.id, user_id: currentUser.uid },

        onSuccess: async (transaction) => {
          console.log("Payment Success:", transaction);
          try {
            const newList = Array.from(new Set([...userUnlockedBooks, book.id]));
            await setDoc(doc(db, 'users', currentUser.uid), { unlockedBooks: newList }, { merge: true });
            setUserUnlockedBooks(newList);
            alert(`Success! "${book.title}" is now unlocked!`);
          } catch (err) {
            console.error("Unlock failed:", err);
            setError("Payment OK, but unlock failed. Contact support.");
          }
          setLoadingBuy(false);
        },

        onCancel: () => {
          setLoadingBuy(false);
        },

        onError: (err) => {
          console.error("Paystack error:", err);
          setError(`Payment failed: ${err.message || "Try again"}`);
          setLoadingBuy(false);
        }
      });

    } catch (err) {
      console.error("Setup error:", err);
      setError(`Error: ${err.message || "Check internet"}`);
      setLoadingBuy(false);
    }
  };

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
          const unlocked = isUnlocked(book);

          return (
            <li
              key={book.id}
              style={{
                background: 'linear-gradient(145deg, #FFFFFF, #FAFAFA)',
                borderRadius: '20px',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                position: 'relative',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
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
                    Pay ₦2,000 to Unlock
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
                ) : book.locked ? (
                  <button
                    onClick={() => handleBuy(book)}
                    disabled={loadingBuy}
                    style={{
                      padding: '12px 24px',
                      background: loadingBuy ? '#ccc' : 'linear-gradient(90deg, #00C853, #B2FF59)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: loadingBuy ? 'not-allowed' : 'pointer',
                      fontWeight: '700',
                      fontSize: '1rem',
                      minWidth: '160px'
                    }}
                  >
                    {loadingBuy ? 'Processing...' : `Pay ₦${book.priceNaira}`}
                  </button>
                ) : null}
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
