import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ada from "../Components/Img/ada.jpg";
import milli from "../Components/Img/millichild.jpg";
import jid from "../Components/Img/jid.jpg";
import psychology from "../Components/Img/psychology.jpg";

function FullBooks() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userUnlockedBooks, setUserUnlockedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(new Set());
  const [couponCode, setCouponCode] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const [dataLoaded, setDataLoaded] = useState(false);

  const fullBooks = [
    { title: "Millionaire Child", id: "millionaire-child", image: milli, priceNaira: 1999, allowCoupon: true },
    { title: "Ada's Dream Bicycle", id: "adas-dream-bicycle", image: ada, priceNaira: 999, allowCoupon: true },
    { title: "Jide and the Game of Three Cups", id: "jide-and-the-game-of-three-cups", image: jid, priceNaira: 999, allowCoupon: false },
    {
      title: "The Psychology And Spirituality Of Making Millions ",
      id: "the-psychology",
      image: psychology,
      priceNaira: 15000,
      discountedPrice: 5000,
      couponCode: "124DC",        // ← NEW COUPON (case-insensitive)
      allowCoupon: true,
    },
  ];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 5000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, { email: user.email, unlockedBooks: [] });
          setUserUnlockedBooks([]);
        } else {
          setUserUnlockedBooks(snap.data()?.unlockedBooks || []);
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
      script.onerror = () => reject(new Error('Paystack failed'));
      document.body.appendChild(script);
    });
  };

  const handleBuy = async (book) => {
    if (!currentUser) return showToast("Please sign in to buy", "error");
    if (isUnlocked(book.id)) return showToast("You already own this book", "error");
    if (loadingBooks.has(book.id)) return;

    setLoadingBooks(prev => new Set(prev).add(book.id));

    try {
      await loadPaystackScript();
      const paystack = new window.PaystackPop();

      const entered = (couponCode[book.id] || "").trim().toUpperCase();
      const validCoupon = book.couponCode && entered === book.couponCode.toUpperCase();
      const amount = validCoupon && book.discountedPrice ? book.discountedPrice : book.priceNaira;

      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: currentUser.email,
        amount: amount * 100,
        currency: "NGN",
        ref: `lb_${book.id}_${Date.now()}`,
        metadata: { book_id: book.id, user_id: currentUser.uid, coupon: validCoupon ? entered : null },
        onSuccess: async () => {
          const newList = [...new Set([...userUnlockedBooks, book.id])];
          await updateDoc(doc(db, 'users', currentUser.uid), { unlockedBooks: newList });
          setUserUnlockedBooks(newList);
          showToast(
            validCoupon
              ? `Coupon applied! Unlocked for ₦${book.discountedPrice.toLocaleString()}`
              : `"${book.title}" unlocked!`,
            "success"
          );
          if (validCoupon) setCouponCode(prev => ({ ...prev, [book.id]: "" }));
        },
        onCancel: () => console.log("Cancelled"),
        onError: () => showToast("Payment failed", "error"),
        onClose: () => setLoadingBooks(prev => { const s = new Set(prev); s.delete(book.id); return s; }),
      });
    } catch (err) {
      showToast("Payment error", "error");
      setLoadingBooks(prev => { const s = new Set(prev); s.delete(book.id); return s; });
    }
  };

  if (!dataLoaded) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading books...</div>;

  return (
    <>
      <div style={{
        padding: 'clamp(20px, 5vw, 40px)',
        maxWidth: 'min(90%, 1200px)',
        margin: '0 auto',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF5CC 0%, #FFD6E8 100%)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.2rem' }}>Full Books</h2>

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
            const entered = (couponCode[book.id] || "").trim().toUpperCase();
            const validCoupon = book.couponCode && entered === book.couponCode.toUpperCase();
            const displayPrice = validCoupon && book.discountedPrice ? book.discountedPrice : book.priceNaira;

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
                    borderRadius: '9999px', fontWeight: 'bold', zIndex: 10, fontSize: '0.9rem'
                  }}>
                    UNLOCKED
                  </div>
                )}

                <img
                  src={book.image}
                  alt={book.title}
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'contain',
                    padding: '2px',
                  }}
                />

                <div style={{ padding: '20px', textAlign: 'center' }}>
                  {!unlocked && (
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: validCoupon ? '#8B00FF' : '#d32f2f',
                      marginBottom: '10px'
                    }}>
                      ₦{displayPrice.toLocaleString()}
                      {validCoupon && <span style={{ color: '#00C853', fontSize: '1rem' }}> (Coupon Applied!)</span>}
                    </div>
                  )}

                  <h3 style={{ margin: '0 0 16px', fontSize: '1.3rem' }}>{book.title}</h3>

                  {!unlocked && book.allowCoupon && (
                    <div style={{ marginBottom: '16px' }}>
                      <input
                        type="text"
                        placeholder="Have a coupon? (e.g. 124DC)"
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
                        onKeyPress={(e) => e.key === 'Enter' && handleBuy(book)}
                      />
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
                        background: isLoading ? '#999' : (validCoupon ? '#8B00FF' : '#00C853'),
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '1.1rem'
                      }}
                    >
                      {isLoading ? 'Processing...' : `Buy Now – ₦${displayPrice.toLocaleString()}`}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <Outlet />
      </div>

      {toast.message && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'success' ? '#00C853' : '#d32f2f',
          color: 'white',
          padding: '16px 32px',
          borderRadius: '50px',
          fontWeight: '600',
          fontSize: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 9999,
          animation: 'toastSlide 0.5s ease-out'
        }}>
          {toast.message}
        </div>
      )}

      <style jsx>{`
        @keyframes toastSlide {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default FullBooks;