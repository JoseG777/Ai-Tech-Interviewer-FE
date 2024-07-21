//This is the landing page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import Laptop from '../components/laptop';

// Views are just the page view
function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('uid')) {
        navigate('/main');
    }
  }, [navigate]);

  return (
    <div className="App">
      <h1>Welcome to the Home Page</h1>
      
    </div>
  );
}

export default Home;


