import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Interview.css';

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const leaveAttemptsRef = useRef(0); // Ref to keep track of leave attempts

  const { language, time } = location.state || { language: 'python', time: 15 };
  const [problem, setProblem] = useState(null);
  const [userResponse, setUserResponse] = useState(sessionStorage.getItem('userResponse') || '');
  const [speechInput, setSpeechInput] = useState('');
  const [speechInputs, setSpeechInputs] = useState([]); 
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timer, setTimer] = useState(time * 60);
  const countdownRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [recognition, setRecognition] = useState(null);

  // Redirect to home if uid is not set
  useEffect(() => {
    if (!sessionStorage.getItem('uid')) {
      navigate('/');
    }
  }, [navigate]);

  // Generate problem on component mount
  useEffect(() => {
    handleGenerateProblem();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      console.log('Speech received: ' + speechResult);

      setMessages(prevMessages => [...prevMessages, { sender: 'User', text: speechResult }]);
      setSpeechInput(speechResult); 
      setSpeechInputs(prevInputs => [...prevInputs, speechResult]); 

      fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: speechResult, problem: JSON.parse(sessionStorage.getItem('problem')) }),
      })
        .then(response => response.json())
        .then(data => {
          const aiResponse = data.ai_response;
          setMessages(prevMessages => [...prevMessages, { sender: 'AI', text: aiResponse }]);

          const utterance = new SpeechSynthesisUtterance(aiResponse);
          speechSynthesis.speak(utterance);
        })
        .catch(error => console.error('Error:', error));
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition: ' + event.error);
    };

    setRecognition(recognition);
  }, []);

  // Generate a problem for the user to solve
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

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json();
      const { formattedProblem, functionSignature } = parseProblem(data.problem);
      setProblem(formattedProblem);
      setUserResponse(functionSignature);
      sessionStorage.setItem('problem', JSON.stringify(data.problem));
      sessionStorage.setItem('userResponse', functionSignature); // Initialize user response in session storage
    } catch (error) {
      console.error('Error generating problem:', error);
    } finally {
      setLoading(false);
    }
  }

  // Evaluate the user's response
  async function handleEvaluateResponse() {
    console.log('Evaluating response...');
    setIsEvaluating(true);

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    const uid = sessionStorage.getItem('uid');
    const problemFromSession = JSON.parse(sessionStorage.getItem('problem'));
    const userResponseFromSession = sessionStorage.getItem('userResponse');

    try {
      const apiEndpoint = `${import.meta.env.VITE_APP_API_ENDPOINT}/api/evaluateResponse`;
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: problemFromSession,
          userResponse: userResponseFromSession,
          uid
        }),
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        setEvaluation('An error occurred during evaluation.');
        setIsEvaluating(false);
        return;
      }

      const data = await response.json();
      setEvaluation(data.evaluation);
      console.log(data);
      console.log(speechInputs);
    } catch (error) {
      console.error('Error evaluating response:', error);
      setEvaluation('An error occurred during evaluation.');
    } finally {
      setIsEvaluating(false);
    }
  }

  // Timer function
  useEffect(() => {
    if (timer === 0) {
      handleEvaluateResponse();
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

  // Parse function
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

  // Navigation handler
  const handleNavigation = () => {
    leaveAttemptsRef.current += 1;
    console.log('Leave attempts:', leaveAttemptsRef.current);
    sessionStorage.setItem('userResponse', userResponse); 
    if (leaveAttemptsRef.current === 1) {
      alert('Leaving this page will result in your work being automatically submitted! You will not be able to make changes to this submission');
    } else if (leaveAttemptsRef.current >= 2) {
      document.querySelectorAll('textarea').forEach(input => input.disabled = true);
      handleEvaluateResponse();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log('Before unload event');
      handleNavigation();
      if (leaveAttemptsRef.current < 2) {
        event.returnValue = 'Leaving this page will result in your work being automatically submitted!';
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log("You have navigated away from the page");
        handleNavigation();
      }
    };

    const handleWindowBlur = () => {
      if (document.visibilityState === 'hidden') {
        handleNavigation();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

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
                onChange={(e) => {
                  setUserResponse(e.target.value);
                  sessionStorage.setItem('userResponse', e.target.value); 
                }}
                placeholder="Type your response here..."
                disabled={isEvaluating}
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
          <button id="start-btn" onClick={() => recognition.start()}>Start Speaking</button>
          <button id="stop-btn" onClick={() => speechSynthesis.cancel()}>Stop Speaking</button>
          <div>
            <h2>Speech Inputs</h2>
            <ul>
              {speechInputs.map((input, index) => (
                <li key={index}>{input}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Interview;
