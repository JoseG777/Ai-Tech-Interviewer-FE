// Components are essentially reusable functions that return JSX
// Another example would be if we made a "card" to hold dynamic data that we want to display
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

// Components are essentially reusable functions that return JSX
// Another example would be if we made a "card" to hold dynamic data that we want to display
function NavBar() {
  const navigate = useNavigate();
  const isSignedIn = !!sessionStorage.getItem('uid');

  const handleLogout = () => {
    sessionStorage.removeItem('uid');
    navigate('/');
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/main">Home</Link> |
        {isSignedIn ? (
          <>
            <Link to="/resources">Resources</Link> |
            <Link to="/profile">Profile</Link> | 
            <Link to="/history">History</Link> |
            <span onClick={handleLogout}>Logout</span>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link> |
            <Link to="/signin">Sign In</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;

