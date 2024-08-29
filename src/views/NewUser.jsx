import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewUser.css';
import logo from '../assets/EVE.png';

function NewUser() {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(["", "", ""]); 
    const [errorMessage, setErrorMessage] = useState(""); 
    const navigate = useNavigate();
 
    const questions = [
        "What is your LeetCode username? (If you don't have one, leave this field blank)",
        "Describe your goal",
        "Any upcoming interviews? If yes, which company? (If no, type 'N/A')"
    ];

    const handleNextClick = () => {
        if (responses[questionIndex].trim() === "") {
            setErrorMessage("This field is required.");
        } else {
            setErrorMessage("");
            setQuestionIndex(questionIndex + 1);
        }
    };

    const handlePreviousClick = () => {
        if (questionIndex > 0) {
            setErrorMessage("");
            setQuestionIndex(questionIndex - 1);
        }
    };

    const handleDoneClick = async () => {
      if (responses[questionIndex].trim() === "") {
          setErrorMessage("This field is required.");
          return;
      }
  
      const leetcode_username = responses[0];
      const goal = responses[1];
      const upcoming_interview = responses[2];
  
      const coding_level = "Beginner"; 
  
      const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/newUser`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ leetcode_username, coding_level, goal, upcoming_interview }),
          credentials: 'include'  
      });
  
      const data = await response.json();
      console.log(data);
  
      setResponses(["", "", ""]);
      setQuestionIndex(0);
      navigate('/exam');
  };
  

    const handleResponseChange = (event) => {
        const newResponses = [...responses];
        newResponses[questionIndex] = event.target.value;
        setResponses(newResponses);
    };

    return (
        <div className="new-user-container">
            <img src={logo} alt="Logo" className="logo" />
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
                {questionIndex > 0 && (
                    <button className="previous-button" onClick={handlePreviousClick}>
                        Previous
                    </button>
                )}
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
