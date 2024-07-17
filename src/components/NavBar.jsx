import React from 'react';
import { Link } from 'react-router-dom';

// Components are essentially reusable functions that return JSX
// Another example would be if we made a "card" to hold dynamic data that we want to display
function NavBar({ isSignedIn, handleLogout }) {
  return (
    <nav>
      <div className="nav-left">
        <Link to="/">Home</Link>
      </div>
      <div className="nav-right">
        {isSignedIn ? (
          <>
            <Link to="/generate">Generate Problem</Link> | 
            <span onClick={handleLogout} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Logout</span>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up </Link> |
            <Link to="/signin"> Sign In</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
