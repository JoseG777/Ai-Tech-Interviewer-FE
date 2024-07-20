import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.css';

function Main() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('');

  const handleStartInterview = () => {
    if (!difficulty) {
      alert('Please select a difficulty level before starting the interview.');
      return;
    }
    navigate('/generate', { state: { difficulty } });
  };

  const handleDifficultyClick = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
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
