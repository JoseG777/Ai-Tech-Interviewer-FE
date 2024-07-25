import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Home.css'; 
import logo from '../assets/EVE.png';

function Home() {
  const navigate = useNavigate(); 

  useEffect(() => {
    if (sessionStorage.getItem('uid')) {
      navigate('/main');
    }
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="App">
      <img src={logo} alt="logo" id="logo" /> 
      <h2 className="h2-fly-in">Your Personal AI-Technical Interviewer awaits you</h2>
      <p className="p-typing">
        Eve provides a unique way to prepare for your technical interviews with real-time feedback and AI-driven insights.
      </p>
      <div className="laptop">
        <div className="laptop-screen">
          <button className="screen-button" onClick={() => handleNavigate('/signup')}>Register</button>
          <button className="screen-button" onClick={() => handleNavigate('/signin')}>Login</button>
          <div className="laptop-connect"></div>
          <div className="laptop-keyboard"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
