import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError({ type: 'error', message: 'Passwords do not match!' });
      return;
    }

    try {
      // Step 1: Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('🔥 User created in Firebase Auth:', user.uid, 'Email:', email);

      // Step 2: Create Firestore document
      try {
        await setDoc(doc(db, 'users', user.uid), {
          username: username.trim(),
          email: email.trim(),
          coins: 0,
          realSavings: 0,
          rewardHistory: [],
          lessonsCompleted: 0,
          quizScore: 0,
        });
        console.log('✅ Firestore document created for UID:', user.uid);
      } catch (firestoreError) {
        console.error('❌ Firestore error:', firestoreError.code, firestoreError.message);
        throw new Error(`Firestore error: ${firestoreError.message}`);
      }

      // Step 3: Show success message and redirect
      setError({ type: 'success', message: 'Signup successful! Redirecting to home...' });
      setTimeout(() => {
        console.log('🚀 Navigating to /home');
        navigate('/home');
      }, 2000);
    } catch (error) {
      console.error('❌ Signup error:', error.code, error.message);
      let errorMessage = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Try signing in.';
          setTimeout(() => navigate('/signin'), 300);
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 6 characters.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = `Signup failed: ${error.message}`;
      }
      setError({ type: 'error', message: errorMessage });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username (First Name)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        {error && (
          <div className={`message ${error.type}`}>
            {error.message}
          </div>
        )}
        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;