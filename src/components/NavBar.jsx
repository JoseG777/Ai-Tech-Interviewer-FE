import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/logout`, {
        method: 'POST',
        credentials: 'include', 
      });

      if (response.ok) {
        document.cookie = 'token=; Max-Age=0; path=/;';
        navigate('/signin');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/main">Interview</Link> |
        <Link to="/resources">Resources</Link> |
        <Link to="/profile">Profile</Link> | 
        <Link to="/history">History</Link> |
        <span onClick={handleLogout}>Logout</span>
      </div>
    </nav>
  );
}

export default NavBar;
