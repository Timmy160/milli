import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // For redirect after signup
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; // Path to firebase.js

function Signup() {
  const [username, setUsername] = useState(''); // Notebook for username
  const [email, setEmail] = useState(''); // For email
  const [password, setPassword] = useState(''); // For password
  const [confirmPassword, setConfirmPassword] = useState(''); // For confirm
  const navigate = useNavigate(); // Tool to redirect

  const handleSignup = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('Signup successful! Please sign in.');
    navigate('/signin');
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Username" 
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
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/signin">Sign In</Link></p>
    </div>
  );
}

export default Signup;