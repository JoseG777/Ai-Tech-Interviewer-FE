// src/views/SignUp.jsx
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

function SignUp() {
  const navigate = useNavigate();

  // Signing Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uid, setUid] = useState('');
  const [levelDescription, setLevelDescription] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('uid')) {
        // redirect to home page
        navigate('/');
    }
  }, []);

  async function handleSignUp(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      setUid(user.user.uid); // save uid to state
      
      // Send data to backend
      await saveUserToDatabase(user.user.uid);

      // Always set states back to original when done
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setLevelDescription('');
      setLeetcodeUsername('');
    } catch (error) {
      console.log(error.message);
    }
  }

  async function saveUserToDatabase(uid) {
    const response = await fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        email,
        levelDescription,
        leetcodeUsername
      }),
    });
  
    const data = await response.json();
    console.log(data); // Handle response from the backend
    navigate('/signin');
  }
  

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <br />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
      />
      <br />
      <input
        type="text"
        value={levelDescription}
        onChange={(e) => setLevelDescription(e.target.value)}
        placeholder="Describe your level"
      />
      <br />
      <input
        type="text"
        value={leetcodeUsername}
        onChange={(e) => setLeetcodeUsername(e.target.value)}
        placeholder="LeetCode Username"
      />
      <br />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;