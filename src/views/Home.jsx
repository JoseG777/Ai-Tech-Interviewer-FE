import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Home.css'; 

function Home() {
  const navigate = useNavigate(); 

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="App">
      <h1>AI-Technical Interview</h1>
      <h2 className="h2-fly-in">Welcome to your personal AI-technical Interview</h2>
      <p className="p-typing">
        This platform provides a unique way to prepare for your technical interviews with real-time feedback and AI-driven insights.
      </p>
      <div className="laptop">
        <div className="laptop-screen">
        <button className="screen-button" onClick={() => handleNavigate('/signup')}>Register</button>
        <button className="screen-button" onClick={() => handleNavigate('/signin')}>Login</button>
        <div className = "laptop-connect"></div>
        <div className="laptop-keyboard">
          
        </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
