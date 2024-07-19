import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewUser.css';

function NewUser() {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(["", "", ""]); // Array to store responses
    const [errorMessage, setErrorMessage] = useState(""); // State to store error messages
    const navigate = useNavigate();
  
    const questions = [
      "Describe your coding level",
      "Describe your goal",
      "Any upcoming interviews? If yes, which company?"
    ];
  
    const handleNextClick = () => {
      if (responses[questionIndex].trim() === "") {
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
  
    // try {
      //  const response = await fetch('/api/saveUserDetails', {
        //  method: 'POST',
          //headers: {
            //'Content-Type': 'application/json',
          //},
          //body: JSON.stringify({
            //uid: sessionStorage.getItem('uid'),
            //responses
          //}),
        //});
        //const data = await response.json();
        //console.log(data); // Handle response from the backend
        //navigate('/main');
      //} catch (error) {
        //console.error('Error saving user details:', error);
      //}
    //};
    sessionStorage.setItem('userResponses', JSON.stringify(responses));

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