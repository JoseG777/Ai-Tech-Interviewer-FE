import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Interview.css';

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  // STATES
  const { language, time } = location.state || { language: 'python', time: 15 };
  const [problem, setProblem] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timer, setTimer] = useState(time * 60);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!sessionStorage.getItem('uid')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    handleGenerateProblem();
  }, []); 

  async function handleGenerateProblem() {
    const uid = sessionStorage.getItem('uid');
    try {
      const apiEndpoint = `${import.meta.env.VITE_APP_API_ENDPOINT}/api/generateProblem`;
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, language }),
      });

      const data = await response.json();
      const { formattedProblem, functionSignature } = parseProblem(data.problem);
      setProblem(formattedProblem);
      setUserResponse(functionSignature);
    } catch (error) {
      console.error('Error generating problem:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEvaluateResponse(event) {
    if (event) event.preventDefault();
    setIsEvaluating(true); // Set evaluating to true

    // Clear the countdown if the user submits manually
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    const uid = sessionStorage.getItem('uid');
    try {
      const apiEndpoint = `${import.meta.env.VITE_APP_API_ENDPOINT}/api/evaluateResponse`;
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem, userResponse, uid }),
      });
      const data = await response.json();
      setEvaluation(data.evaluation);
      console.log(data);
    } catch (error) {
      console.error('Error evaluating response:', error);
    } finally {
      setIsEvaluating(false);
    }
  }

  useEffect(() => {
    if (timer === 0) {
      handleEvaluateResponse(); // Automatically submit when timer reaches 0
    } else {
      countdownRef.current = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
      return () => clearInterval(countdownRef.current);
    }
  }, [timer]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const parseProblem = (problem) => {
    if (!problem) return '';

    const descriptionPart = problem.match(/Problem Description:.*?(?=(Example|Constraints|Function Signature:|$))/s)?.[0]?.replace('Problem Description:', '').trim() || '';
    const examplesPart = problem.match(/Example \d+:.*?(?=(Example|Constraints|Function Signature:|$))/gs)?.map(example => example.trim()).join('\n\n') || '';
    const constraintsPart = problem.match(/Constraints:.*?(?=(Example|Function Signature:|$))/s)?.[0]?.trim() || '';
    const functionSignaturePart = problem.match(/Function Signature:.*$/s)?.[0]?.replace('Function Signature:', '').trim() || '';

    const formattedProblem = (
      <>
        <p><strong>Problem Description:</strong><br />{descriptionPart}</p>
        <p>{examplesPart.split('\n').map((example, idx) => <span key={idx}>{example}<br /></span>)}</p>
        <p><strong>Constraints:</strong><br />{constraintsPart}</p>
      </>
    );

    return { formattedProblem, functionSignature: functionSignaturePart };
  };

  const handleStartSpeaking = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      console.log('Speech received: ' + speechResult);

      setMessages((prevMessages) => [...prevMessages, { sender: 'User', text: speechResult }]);

      fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/user_message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: speechResult }),
      })
      .then((response) => response.json())
      .then((data) => {
        setMessages((prevMessages) => [...prevMessages, { sender: 'AI', text: data.ai_response }]);
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.ai_response);
          window.speechSynthesis.speak(utterance);
        } else {
          console.error("Speech Synthesis API not supported in this browser.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition: ' + event.error);
    };
  };

  return (
    <div className="generate-problems-container">
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      )}
      {!loading && (
        <>
          <div className="top-bar">
            <div className="timer">{formatTime(timer)}</div>
          </div>
          <div className="chat-box">
            {problem && (
              <div className="chat-message left">
                {problem}
              </div>
            )}
            <div className="chat-message right">
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type your response here..."
              />
              <button onClick={handleEvaluateResponse} disabled={isEvaluating}>
                {isEvaluating ? 'Evaluating...' : 'Submit'}
              </button>
            </div>
          </div>
          <ul id="messages">
            {messages.map((msg, index) => (
              <li key={index} className={msg.sender === 'User' ? 'user-message' : 'ai-message'}>
                <strong>{msg.sender}:</strong> {msg.text}
              </li>
            ))}
          </ul>
          {evaluation && (
            <div className="evaluation-container">
              <h2>Evaluation</h2>
              <p>{evaluation}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Interview;
