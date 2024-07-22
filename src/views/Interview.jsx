import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Interview.css';

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const leaveAttemptsRef = useRef(0); // Ref to keep track of leave attempts

  // STATES
  const { language, time } = location.state || { language: 'python', time: 15 };
  const [problem, setProblem] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timer, setTimer] = useState(time * 60);
  const countdownRef = useRef(null);

  // ************************** USE EFFECTS **************************

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

  // ******************************************************************


  // ************************** FUNCTIONS **************************

  // Generate a problem for the user to solve
  async function handleGenerateProblem() {
    const uid = sessionStorage.getItem('uid');
    try {
      const apiEndpoint = `${import.meta.env.VITE_APP_API_ENDPOINT}/api/generateProblem`;
      // console.log("API Endpoint:", apiEndpoint);
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

    } catch (error) {
      console.error('Error generating problem:', error);
    } finally {
      setLoading(false);
    }
  }

  // Evaluate the user's response
  async function handleEvaluateResponse(event) {
    if (event) event.preventDefault();
    setIsEvaluating(true);

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

  // ************************** TIMER FUNCTION **************************

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

  // ************************** PARSE FUNCTION **************************

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

  // ************************** NAVIGATION HANDLER **************************
  const handleNavigation = () => {
    leaveAttemptsRef.current += 1;
    console.log('Leave attempts:', leaveAttemptsRef.current);
    if (leaveAttemptsRef.current === 1) {
      alert('Leaving this page will result in your work being automatically submitted! You will not be able to make changes to this submission');
    } else if (leaveAttemptsRef.current >= 2) {
      document.querySelectorAll('textarea').forEach(input => input.disabled = true);
      console.log('Changes saved and editing disabled.');
      handleEvaluateResponse();
      console.log("SECOND ATTEMPT", leaveAttemptsRef.current);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
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
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type your response here..."
                disabled={isEvaluating} // Disable textarea when evaluating
              />
              <button onClick={handleEvaluateResponse} disabled={isEvaluating}>
                {isEvaluating ? 'Evaluating...' : 'Submit'}
              </button>
            </div>
          </div>

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
