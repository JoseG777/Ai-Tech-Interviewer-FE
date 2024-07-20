import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/GenerateProblems.css';

function GenerateProblems() { 
  const location = useLocation();
  const { difficulty } = location.state || { difficulty: 'Easy' };  // Default to Easy if not set
  const [problem, setProblem] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const difficultyTime = {
    Easy: 15 * 60,
    Medium: 25 * 60,
    Hard: 30 * 60
  };

  const [timer, setTimer] = useState(difficultyTime[difficulty]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  async function handleGenerateProblem() {
    setLoading(true);
    const uid = sessionStorage.getItem('uid'); 
    try {
      const response = await fetch('/api/generateProblem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
      });
      const data = await response.json();
      setProblem(data.problem);
    } catch (error) {
      console.error('Error generating problem:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="generate-problems-container">
      <div className="top-bar">
        <img src="src/assets/interviewer.PNG" alt="Interviewer Icon" className="interviewer-icon" />
        <div className="timer">{formatTime()}</div>
      </div>
      <h1 style={{ fontSize: '24px' }}>Interviewer</h1>
      <div className="chat-box">
        {problem && (
          <div className="chat-message left">
            <p>{problem}</p>
          </div>
        )}
        <div className="chat-message right">
          <textarea value={userResponse} onChange={(e) => setUserResponse(e.target.value)} />
          <button onClick={handleGenerateProblem}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default GenerateProblems;
