// src/views/SignIn.jsx
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import '../styles/authform.css';

function SignIn() {
  const navigate = useNavigate();

  // Signing In
  const [emailSignIn, setEmailSignIn] = useState('');
  const [passwordSignIn, setPasswordSignIn] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('uid')) {
        // redirect to home page
        navigate('/main');
    }
  }, [navigate]);

  async function handleSignIn(event) {
    event.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, emailSignIn, passwordSignIn);
      console.log(user);

      sessionStorage.setItem('uid', user.user.uid);
      setEmailSignIn('');
      setPasswordSignIn('');
      navigate('/main');
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="auth-form-container">
      <div className = "auth-form">
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={emailSignIn}
        onChange={(e) => setEmailSignIn(e.target.value)}
        placeholder="Email"
      />
      <br />
      <input
        type="password"
        value={passwordSignIn}
        onChange={(e) => setPasswordSignIn(e.target.value)}
        placeholder="Password"
      />
      <br />
      <div className="auth-form button">
      <button type="submit">Login</button>
    </div>  
    </form>
    </div>
    </div>
  );
}

export default SignIn;
