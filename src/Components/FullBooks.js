import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ada from "../Components/Img/ada.jpg";
import milli from "../Components/Img/millichild.jpg";
import jid from "../Components/Img/jid.jpg";

function FullBooks() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userUnlockedBooks, setUserUnlockedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(new Set());
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [couponCode, setCouponCode] = useState({});
  const [couponErrors, setCouponErrors] = useState({});
  const [couponLoading, setCouponLoading] = useState({});

  const fullBooks = [
    { title: "Millionaire Child", id: "millionaire-child", image: milli, priceNaira: 1999, locked: true, allowCoupon: true },
    { title: "Ada's Dream Bicycle", id: "adas-dream-bicycle", image: ada, priceNaira: 999, locked: true, allowCoupon: true },
    { title: "Jide and the Game of Three Cups", id: "jide-and-the-game-of-three-cups", image: jid, priceNaira: 999, locked: true, allowCoupon: false },
  ];

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
            setUserUnlockedBooks(userSnap.data()?.unlockedBooks || []);
          }
        } catch (err) {
          console.error('Error loading user data:', err);
        }
      } else {
        setCurrentUser(null);
        setUserUnlockedBooks([]);
      }
      setDataLoaded(true);
    });
    return unsubscribe;
  }, []);

  const isUnlocked = (bookId) => userUnlockedBooks.includes(bookId);

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

  const handleBuy = async (book) => {
    if (!currentUser) return setError('Please sign in to purchase.');
    if (isUnlocked(book.id)) return setError(`You already own "${book.title}".`);
    if (loadingBooks.has(book.id)) return;

    setError(null);
    setLoadingBooks(prev => new Set(prev).add(book.id));

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
          const newList = [...new Set([...userUnlockedBooks, book.id])];
          await updateDoc(doc(db, 'users', currentUser.uid), { unlockedBooks: newList });
          setUserUnlockedBooks(newList);
          alert(`Success! "${book.title}" is now unlocked!`);
        },
        onCancel: () => console.log("Payment cancelled"),
        onError: (err) => setError(`Payment failed: ${err.message || "Try again"}`),
        onClose: () => setLoadingBooks(prev => { const s = new Set(prev); s.delete(book.id); return s; }),
      });
    } catch (err) {
      setError(`Error: ${err.message || "Check internet connection"}`);
      setLoadingBooks(prev => { const s = new Set(prev); s.delete(book.id); return s; });
    }
  };

  const applyCoupon = async (book) => {
    const rawCode = couponCode[book.id]?.trim();
    if (!rawCode) {
      setCouponErrors(prev => ({ ...prev, [book.id]: "Enter a coupon code" }));
      return;
    }
    const code = rawCode.toUpperCase();

    if (!currentUser) {
      setCouponErrors(prev => ({ ...prev, [book.id]: "Please sign in first" }));
      return;
    }
    if (isUnlocked(book.id)) {
      setCouponErrors(prev => ({ ...prev, [book.id]: "Already unlocked!" }));
      return;
    }

    setCouponErrors(prev => ({ ...prev, [book.id]: null }));
    setCouponLoading(prev => ({ ...prev, [book.id]: true }));

    try {
      let couponDoc = null;
      let couponData = null;

      const docRef = doc(db, "coupons", code);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        couponDoc = docSnap;
        couponData = docSnap.data();
      } else {
        const q = query(collection(db, "coupons"), where("code", "==", code));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          couponDoc = querySnap.docs[0];
          couponData = couponDoc.data();
        }
      }

      if (!couponDoc || !couponData || couponData.active === false) {
        setCouponErrors(prev => ({ ...prev, [book.id]: "Invalid or inactive coupon" }));
        return;
      }

      const isUniversal = !couponData.bookId || couponData.bookId === "";
      const isUnlimited = couponData.unlimited === true;

      if (!isUniversal && couponData.bookId !== book.id) {
        setCouponErrors(prev => ({ ...prev, [book.id]: "This coupon is for a different book" }));
        return;
      }

      const usedBy = couponData.usedBy || [];
      if (!isUniversal && !isUnlimited && usedBy.includes(currentUser.uid)) {
        setCouponErrors(prev => ({ ...prev, [book.id]: "You've already used this coupon" }));
        return;
      }

      // SUCCESS – unlock the book
      const newList = [...new Set([...userUnlockedBooks, book.id])];
      await updateDoc(doc(db, 'users', currentUser.uid), { unlockedBooks: newList });
      setUserUnlockedBooks(newList);

      if (!isUniversal && !isUnlimited) {
        await updateDoc(couponDoc.ref, { usedBy: [...usedBy, currentUser.uid] });
      }

      setCouponCode(prev => ({ ...prev, [book.id]: "" }));
      alert(`LAGOSMUMS coupon applied! "${book.title}" is now FREE!`);

    } catch (err) {
      console.error("Coupon error:", err);
      setCouponErrors(prev => ({ ...prev, [book.id]: "Error. Try again." }));
    } finally {
      setCouponLoading(prev => ({ ...prev, [book.id]: false }));
    }
  };

  if (!dataLoaded) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading books...</div>;

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
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.2rem' }}>Full Books</h2>

      {error && (
        <div style={{ color: 'crimson', background: '#ffebee', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', maxWidth: '600px' }}>
          {error}
        </div>
      )}

      <ul style={{
        listStyle: 'none',
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
        gap: '30px',
        width: '100%'
      }}>
        {fullBooks.map((book) => {
          const unlocked = isUnlocked(book.id);
          const isLoading = loadingBooks.has(book.id);
          const isCouponLoading = couponLoading[book.id];

          return (
            <li key={book.id} style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {unlocked && (
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: '#00C853', color: '#fff', padding: '6px 14px',
                  borderRadius: '9999px', fontWeight: 'bold', zIndex: 10
                }}>
                  UNLOCKED
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <img
                  src={book.image}
                  alt={book.title}
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'contain',
                    padding: '12px',
                    filter: !unlocked ? 'blur(6px) brightness(0.6)' : 'none',
                    transition: 'filter 0.3s'
                  }}
                />
                {!unlocked && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.8)', color: '#fff',
                    padding: '16px 32px', borderRadius: '16px',
                    fontWeight: 'bold', fontSize: '1.1rem'
                  }}>
                    ₦{book.priceNaira} to Unlock
                  </div>
                )}
              </div>

              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '1.3rem' }}>{book.title}</h3>

                {/* Coupon only for the first two books */}
                {!unlocked && book.allowCoupon && (
                  <div style={{ marginBottom: '16px' }}>
                    <input
                      type="text"
                      placeholder="Have a coupon code? (LAGOSMUMS)"
                      value={couponCode[book.id] || ""}
                      onChange={(e) => setCouponCode(prev => ({ ...prev, [book.id]: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #ddd',
                        fontSize: '1rem',
                        marginBottom: '8px'
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && applyCoupon(book)}
                    />
                    <button
                      onClick={() => applyCoupon(book)}
                      disabled={isCouponLoading}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: isCouponLoading ? '#999' : '#1E88E5',
                        color: '#fff',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {isCouponLoading ? 'Checking...' : 'Apply Coupon'}
                    </button>
                    {couponErrors[book.id] && (
                      <div style={{ color: '#d32f2f', fontSize: '0.9rem', marginTop: '8px' }}>
                        {couponErrors[book.id]}
                      </div>
                    )}
                  </div>
                )}

                {unlocked ? (
                  <Link
                    to={`/full-books/${book.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '14px 28px',
                      background: '#42A5F5',
                      color: '#fff',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}
                  >
                    Read Now
                  </Link>
                ) : (
                  <button
                    onClick={() => handleBuy(book)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: isLoading ? '#999' : '#00C853',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}
                  >
                    {isLoading ? 'Processing...' : `Buy Now – ₦${book.priceNaira}`}
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