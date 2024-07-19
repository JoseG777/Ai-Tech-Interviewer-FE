import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewUser.css';

function NewUser() {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(["", "", "", ""]); 
    const [errorMessage, setErrorMessage] = useState(""); 
    const navigate = useNavigate();
  
    const questions = [
      "What is your LeetCode username? (If you don't have one, type 'N/A')",
      "Describe your coding level",
      "Describe your goal",
      "Any upcoming interviews? If yes, which company? (If no, type 'N/A')"
    ];
  
    const handleNextClick = () => {
      if (questionIndex > 0 && responses[questionIndex].trim() === "") {
        setErrorMessage("This field is required.");
      } else {
        setErrorMessage("");
        setQuestionIndex(questionIndex + 1);
      }
    };
  
    const handleDoneClick = async () => {
      if (responses[questionIndex].trim() === "") {
        setErrorMessage("This field is required.");
        return;
      }

      const uid = sessionStorage.getItem('uid');
      const leetcode_username = responses[0];
      const coding_level = responses[1];
      const goal = responses[2];
      const upcoming_interview = responses[3];

      console.log(uid, leetcode_username, coding_level, goal, upcoming_interview);

      const response = await fetch('/api/newUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, leetcode_username, coding_level, goal, upcoming_interview }),
      });

      const data = await response.json();
      console.log(data);

      console.log(responses);

      setResponses(["", "", "", ""]);
      setQuestionIndex(0);
      navigate('/main');
    };
  
    const handleResponseChange = (event) => {
      const newResponses = [...responses];
      newResponses[questionIndex] = event.target.value;
      setResponses(newResponses);
    };
  
    return (
      <div className="new-user-container">
        <div className="question-container">
          <h2>{questions[questionIndex]}</h2>
        </div>
        <input
          type="text"
          value={responses[questionIndex]}
          onChange={handleResponseChange}
          className="response-input"
          placeholder="Type your response here..."
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="button-container">
          {questionIndex < questions.length - 1 ? (
            <button className="next-button" onClick={handleNextClick}>
              Next
            </button>
          ) : (
            <button className="done-button" onClick={handleDoneClick}>
              Done
            </button>
          )}
        </div>
      </div>
    );
  }
  
  export default NewUser;