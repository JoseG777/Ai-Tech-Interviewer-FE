import React, {useEffect, useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useNavigate, Link} from 'react-router-dom';
import {auth} from '../firebaseConfig';
import '../styles/LoginSignUp.css'
import logo from '../assets/EVE.png';

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
        const lowercasedUsername = identifierSignIn.toLowerCase();
        const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: lowercasedUsername }),
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
      <div className="container">

        <div className="header">
          <img src={logo} alt="logo" id="logo"/>
          <div className="text">Sign In</div>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleSignIn}>
          <div className="inputs">
            <div className="input">
              <input
                  type="text"
                  value={identifierSignIn}
                  onChange={(e) => setIdentifierSignIn(e.target.value)}
                  placeholder="Email/Username"
              />
            </div>
            <div className="input">
              <input
                  type="password"
                  value={passwordSignIn}
                  onChange={(e) => setPasswordSignIn(e.target.value)}
                  placeholder="Password"
              />
            </div>
          </div>
          <div className="submit-container">
            <button type="submit" className="submit">Login</button>
          </div>
        </form>
        <p> Don't have an accout yet? <Link to="/signup"> Sign up! </Link> </p>
      </div>
  );
}

export default SignIn;