import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Camera from '../components/Camera';
import '../styles/Interview.css';

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const leaveAttemptsRef = useRef(0);
  const tabLeaveRef = useRef(0); 

  const { language, time } = location.state || { language: 'python', time: 15 };

  //************************* State variables *************************
  const [problem, setProblem] = useState(null);
  const [userResponse, setUserResponse] = useState(sessionStorage.getItem('userResponse') || '');
  const [turnOffCamera, setTurnOffCamera] = useState(false);

  //************************* Speech Variables ************************* 
  const [speechInput, setSpeechInput] = useState('');
  const [speechInputs, setSpeechInputs] = useState([]); 
  const [messages, setMessages] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [finalSpeech, setFinalSpeech] = useState('N/A');
  const [userSpeechInputs, setUserSpeechInputs] = useState([]); 

  //************************* Evaluation variables ************************* 
  const [codeEvaluation, setCodeEvaluation] = useState(null);
  const [speechEvaluation, setSpeechEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); 

  //************************* Timer variables ************************* 
  const [timer, setTimer] = useState(time * 60);
  const countdownRef = useRef(null);

  //************************* Redirect to home if uid is not set ************************* 
  useEffect(() => {
    if (!sessionStorage.getItem('uid')) {
      navigate('/');
    }
  }, [navigate]);

  //************************* Logging for debugging ************************* 
  useEffect(() => {
    console.log("Interview component mounted");

    return () => {
      console.log("Interview component unmounted");
    };
  }, []);

  //************************* Generate problem on component mount ************************* 
  useEffect(() => {
    console.log("Generating problem on mount");
    handleGenerateProblem();
  }, []); 

  //************************* Initialize speech recognition ************************* 
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
      setUserSpeechInputs(prevInputs => [...prevInputs, speechResult]); 

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

  //************************* Combine user speech inputs into a single string whenever messages change ************************* 
  useEffect(() => {
    if (userSpeechInputs.length !== 0) {
      const combinedUserSpeech = userSpeechInputs.join(' ');
      setFinalSpeech(combinedUserSpeech);
    }
  }, [userSpeechInputs]);

  //************************* Generate a problem for the user to solve ************************* 
  const handleGenerateProblem = useCallback(async () => {
    console.log("handleGenerateProblem called");
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

      console.log("Problem generated and set");
      sessionStorage.setItem('problem', JSON.stringify(data.problem));
      sessionStorage.setItem('userResponse', functionSignature);
      setLoading(false); 
    } catch (error) {
      console.error('Error generating problem:', error);
    }
  }, [language]);

  //************************* Evaluate the user's response ************************* 
  async function handleEvaluateResponse() {
    console.log('Evaluating response...');
    setIsEvaluating(true);

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    const uid = sessionStorage.getItem('uid');
    const problemFromSession = JSON.parse(sessionStorage.getItem('problem'));
    const userResponseFromSession = sessionStorage.getItem('userResponse');

    console.log(uid, problemFromSession, userResponseFromSession);

    const combinedUserSpeech = userSpeechInputs.length > 0 
    ? userSpeechInputs.map((input, index) => `${index + 1}. ${input}`).join(' ')
    : 'N/A';

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
          uid,
          speechInput: combinedUserSpeech,
        }),
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        setCodeEvaluation('An error occurred during evaluation.');
        setSpeechEvaluation('An error occurred during evaluation.');
        setIsEvaluating(false);
        return;
      }

      const data = await response.json();
      setCodeEvaluation(data.code_evaluation);
      setSpeechEvaluation(data.speech_evaluation);
      console.log(data);
    } catch (error) {
      console.error('Error evaluating response:', error);
      setCodeEvaluation('An error occurred during evaluation.');
      setSpeechEvaluation('An error occurred during evaluation.');
    } finally {
      setIsEvaluating(false);
      setIsSubmitted(true); 
    }
  }

  //*************************  Timer function ************************* 
  useEffect(() => {
    if (!loading) {
      countdownRef.current = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(countdownRef.current);
  }, [loading]);
  
  useEffect(() => {
    if (timer === 0) {
      handleEvaluateResponse();
    }
  }, [timer]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  //*************************  Parse function ************************* 
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

  //************************* Navigation handler ************************* 
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
      if (!isSubmitted) {
        handleNavigation();
        if (leaveAttemptsRef.current < 2) {
          event.returnValue = 'Leaving this page will result in your work being automatically submitted!';
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isSubmitted) {
        console.log("You have navigated away from the page");
        if (leaveAttemptsRef.current === 1) {
          alert('Leaving this page will result in your work being automatically submitted! You will not be able to make changes to this submission');
        }
        tabLeaveRef.current += 1;
      } else if (document.visibilityState === 'visible') {
        tabLeaveRef.current = 0; 
      }
    };

    const handleWindowBlur = () => {
      console.log("Window lost focus");
      if (!isSubmitted) {
        handleNavigation();
      }
    };

    const handleWindowFocus = () => {
      console.log("Window gained focus");
      tabLeaveRef.current = 0; 
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isSubmitted]);

  return (
    <div className="generate-problems-container">
      <div className="camera-container">
        <Camera turnOff={turnOffCamera} />
      </div>
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
                disabled={isEvaluating || isSubmitted} 
              />
              <button id="start-btn" onClick={handleEvaluateResponse} disabled={isEvaluating || isSubmitted}>
                {isEvaluating ? 'Evaluating...' : 'Submit'}
              </button>
            </div>
          </div>
          {codeEvaluation && (
            <div className="evaluation-container">
              <h2>Code Evaluation</h2>
              <p>Evaluation: {codeEvaluation.evaluation}</p>
              <p>Feedback: {codeEvaluation.feedback}</p>
              <p>Final Grade: {codeEvaluation.final_grade}</p>
            </div>
          )}
          {speechEvaluation && (
            <div className="evaluation-container">
              <h2>Speech Evaluation</h2>
              <p>Evaluation: {speechEvaluation.evaluation}</p>
              <p>Feedback: {speechEvaluation.feedback}</p>
              <p>Final Grade: {speechEvaluation.final_grade}</p>
            </div>
          )}
          <div className="control-buttons">
            {!isSubmitted ? (
              <>
                <div className="button-container">
                  <button id="start-btn" onClick={() => recognition.start()}>Start Speaking</button>
                  <button id="stop-btn" onClick={() => speechSynthesis.cancel()}>Stop Speaking</button>
                </div>
              </>
            ) : (
              <button id="start-btn" onClick={() => { setTurnOffCamera(true); navigate('/main', { replace: true }); window.location.reload(); }}>
                Go to Main
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Interview;
