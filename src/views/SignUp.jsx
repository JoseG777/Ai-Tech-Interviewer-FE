import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import '../styles/authform.css';

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('uid')) {
      navigate('/');
    }
  }, [navigate]);

  async function handleSignUp(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userUid = userCredential.user.uid;

      await saveUserToDatabase(userUid);
    } catch (error) {
      console.log(error.message);
      setError('Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function saveUserToDatabase(uid) {
    try {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          email,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem('uid', userCredential.user.uid);
        console.log(userCredential);

        navigate('/newuser');
      } else {
        setError('Failed to create user in the database');
      }
    } catch (error) {
      console.log(error.message);
      setError('Failed to create user in the database');
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={loading}
          />
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
          />
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            disabled={loading}
          />
          <br />
          {error && <p className="error">{error}</p>}
          <div className="auth-form button">
            <button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
