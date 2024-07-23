import React, {useEffect, useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {auth} from '../firebaseConfig';
import '../styles/authform.css';

function SignIn() {
  const navigate = useNavigate();

  // Signing In
  const [identifierSignIn, setIdentifierSignIn] = useState('');
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

      // user is logging in with username
      let email = identifierSignIn
      if (!identifierSignIn.includes('@')) {
        // Fetch email based on username
        const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: identifierSignIn }),
        });

        if (!response.ok) {
          throw new Error('Username not found');
        }

        const data = await response.json();
        if (!data.email) {
          throw new Error('Email not found for the provided username');
        }
        email = data.email;
      }

      const user = await signInWithEmailAndPassword(auth, email, passwordSignIn);
      console.log(user);

      sessionStorage.setItem('uid', user.user.uid);
      setIdentifierSignIn('');
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
        type="identifier"
        value={identifierSignIn}
        onChange={(e) => setIdentifierSignIn(e.target.value)}
        placeholder="Email/Username"
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