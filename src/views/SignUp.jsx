import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import '../styles/LoginSignUp.css'
import logo from '../assets/EVE.png';

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignUp(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (username.includes('@')) {
      setError('Username cannot contain "@" symbol');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userUid = userCredential.user.uid;
      console.log('User signed up:', userUid);

      await saveUserToDatabase(userUid);
    } catch (error) {
      console.log(error.message);
      setError('Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function saveUserToDatabase(uid) {
    const lowercasedUsername = username.toLowerCase();
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/createUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, email, username: lowercasedUsername }),
        credentials: 'include' 
      });

      if (!response.ok) {
        const errorText = await response.text(); 
        console.error('Server response was not OK:', errorText); 
        alert('An error occurred while creating your account (DATABASE). Please try again.');
        return;
      }

      const data = await response.json();
      console.log('Response from server:', data);

      if (data.message === 'User created successfully') {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in.');

        navigate('/newuser');
      } else {
        console.error('Server error:', data.message);
      }
    } catch (error) {
      console.error('Error saving user to database:', error.message);
      alert('An error occurred while creating your account. Please try again.');
    }
}

  
  

  return (
    <div className="container">

      <div className="header">
        <img src={logo} alt="Logo" id="logo" />
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSignUp}>
        <div className="inputs">
        <div className="input">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={loading}
            />
          </div>
          <p style={{color: '#556b2f'}}>Username must not contain the '@' symbol.</p>
          <div className="input">
            <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                disabled={loading}
                className="input-field"
            />
          </div>
          <p style={{color: '#556b2f'}}>Password must be at least 6 characters long.</p>
          <div className="input">

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={loading}
                className="input-field"
            />
          </div>
          <div className="input">
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                disabled={loading}
                className="input-field"
            />
          </div>
        </div>

        <div className="submit-container">
          <button type="submit" className="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Register'}
          </button>
        </div>
      </form>
      <p>Already have an account? <Link to="/signin"> Sign in! </Link> </p>
    </div>
  );
}

export default SignUp;