// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
<<<<<<< HEAD
import Main from './views/Main';
import NewUser from './views/NewUser';
import GenerateProblems from './views/GenerateProblems';
=======
import GenerateProblems from './views/Interview';
>>>>>>> main
import NavBar from './components/NavBar';
import Resources from './views/Resources';
import Profile from './views/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
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
