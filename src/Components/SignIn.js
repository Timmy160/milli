import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState(null);
  const [isResetting, setIsResetting] = useState(false); // Toggle reset form
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError({ type: 'success', message: 'Sign in successful!' });
      setTimeout(() => navigate('/home'), 2000);
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = 'Sign in failed. Please check your credentials.';
      }
      setError({ type: 'error', message: errorMessage });
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setError({ type: 'success', message: 'Password reset email sent! Check your inbox.' });
      setTimeout(() => setIsResetting(false), 2000); // Hide reset form after 2 seconds
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = 'Failed to send reset email. Please try again.';
      }
      setError({ type: 'error', message: errorMessage });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isResetting ? 'Reset Password' : 'Sign In'}</h2>
        {isResetting ? (
          <form onSubmit={handlePasswordReset}>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit" className="signin-button">Send Reset Email</button>
            <p>
              <a href="#" onClick={() => setIsResetting(false)}>Back to Sign In</a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignIn}>
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
            <button type="submit" className="signin-button">Sign In</button>
            <p>
              <a href="#" onClick={() => setIsResetting(true)}>Forgot Password?</a>
            </p>
          </form>
        )}
        {error && (
          <div className={`message ${error.type}`}>
            {error.message}
          </div>
        )}
        {!isResetting && (
          <p>
            No account? <Link to="/signup">Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default SignIn;