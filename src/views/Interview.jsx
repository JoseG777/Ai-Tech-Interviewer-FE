import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Interview.css';

function Interview() {
  const location = useLocation();
  const { language } = location.state || { language: 'python' };
  const [problem, setProblem] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isEvaluating, setIsEvaluating] = useState(false);

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
      setLoading(false); // Set loading to false after fetching problem
    }
  }

  async function handleEvaluateResponse(event) {
    event.preventDefault();
    setIsEvaluating(true); // Set evaluating to true
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
      setIsEvaluating(false); // Set evaluating to false
    }
  }

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

  return (
    <div className="generate-problems-container">
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      )}
      {!loading && (
        <>
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
