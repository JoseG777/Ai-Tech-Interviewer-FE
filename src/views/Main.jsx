import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.css'; // Import the CSS file for styling

function Main() {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    // Handle the "Start Interview" button click
    navigate('/generate'); // Example route change
  };

  const handleDifficultyClick = (difficulty) => {
    // Handle difficulty button click
    console.log(`Selected difficulty: ${difficulty}`);
    // Perform any action based on selected difficulty
  };

  return (
    <div className="main-container">
      <h1>Home Page</h1>
      <button className="start-button" onClick={handleStartInterview}>
      <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Start Interview
      </button>
      <div className="difficulty-section">
        <h2>Choose Your Difficulty</h2>
        <div className="difficulty-buttons">
          <button className="difficulty-button" onClick={() => handleDifficultyClick('Easy')}>Easy</button>
          <button className="difficulty-button" onClick={() => handleDifficultyClick('Medium')}>Medium</button>
          <button className="difficulty-button" onClick={() => handleDifficultyClick('Hard')}>Hard</button>
        </div>
      </div>
    </div>
  );
}

export default Main;
