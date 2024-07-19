// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Home from './views/Home';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import Main from './views/Main';
import NewUser from './views/NewUser';
import GenerateProblems from './views/GenerateProblems';
import NavBar from './components/NavBar';
import Resources from './views/Resources'; 
import Profile from './views/Profile'; 
import './App.css';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already signed in when the app loads
    const token = sessionStorage.getItem('uid');
    if (token) {
      setIsSignedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsSignedIn(false);
    sessionStorage.removeItem('uid');

  };

  return (
    <Router>
      <NavBar isSignedIn={isSignedIn} handleLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn setIsSignedIn={setIsSignedIn} />} />
        <Route path="/main" element={<Main />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/generate" element={<GenerateProblems />} />
        <Route path="/resources" element={<Resources />} /> 
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </Router>
  );
}

export default App;
