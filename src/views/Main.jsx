import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main-content.css';
import '../styles/Main.css'; 

function Main() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const languages = [
    'Python',
    'JavaScript',
    'Java',
    'C++',
    'C#',
    'Ruby',
    'Go',
    'Swift',
    'TypeScript',
    'Kotlin',
    'PHP',
    'Rust',
    'Perl',
    'Scala'
  ];

  const times = [
    { label: 'Impossible', minutes: 0.5 },
    { label: 'Short', minutes: 5 },
    { label: 'Standard', minutes: 15 },
    { label: 'Extended', minutes: 30 }
  ];

  const handleStartInterview = () => {
    const language = customLanguage || selectedLanguage;
    navigate('/interview', { state: { language, time: selectedTime } });
  };

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    setCustomLanguage('');
  };

  const handleCustomLanguageChange = (event) => {
    setCustomLanguage(event.target.value);
    setSelectedLanguage('');
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="main-content">
    <div className="main-container">
      <h1> Select Interview Settings </h1>

      <div className="difficulty-section">
        <h2>Choose Your Coding Language</h2>
        <div className="difficulty-buttons">
          {languages.map((language) => (
            <button
              key={language}
              className={`difficulty-button ${selectedLanguage === language ? 'selected' : ''}`}
              onClick={() => handleLanguageClick(language)}
            >
              {language}
            </button>
          ))}
        </div>

        <div className="custom-language">
          <input
            type="text"
            value={customLanguage}
            onChange={handleCustomLanguageChange}
            placeholder="Type your language if not listed..."
            className="custom-language-input"
          />
        </div>
      </div>
      
      <div className="difficulty-section">
        <h2>Choose Your Time</h2>
          <div className="difficulty-buttons">
            {times.map((time) => (
              <button
                key={time.label}
                className={`difficulty-buttons ${selectedTime === time.minutes ? 'selected' : ''}`}
                onClick={() => handleTimeClick(time.minutes)}
              >
                {time.label}
              </button>
            ))}
          </div>
      </div>

      {((selectedLanguage || customLanguage) && selectedTime) && (
        <button className="start-button" onClick={handleStartInterview}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Start Interview
        </button>
      )}
    </div>
    </div>
  );
}

export default Main;
