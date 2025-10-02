import React from 'react';
import { Link } from 'react-router-dom'; // For buttons to signup/signin

function Splash() {
  return (
    <div className="splash-container">
      <h1 className="title">Millionaire Child</h1>
      <p className="tagline">Money Smart, Future Bright!</p>
      <img 
  src="https://i.imgur.com/gBvOKJ3.png"
  alt="Kids with piggy bank"
  className="illustration"
/>
   <Link to="/signup" className="signup-button">Sign Up</Link>
<Link to="/signin" className="signin-button">Sign In</Link>
    </div>
  );
}

export default Splash;