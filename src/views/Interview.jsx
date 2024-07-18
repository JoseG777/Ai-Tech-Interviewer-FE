import React, { useState } from 'react';

function GenerateProblems() { 
  const [problem, setProblem] = useState(null);
  const [userResponse, setUserResponse] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  const [loading, setLoading] = useState(false);

  async function handleGenerateProblem() 
  {
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

  async function handleEvaluateResponse(event)
  {
    event.preventDefault();
    try{
      const response = await fetch('/api/evaluateResponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ problem, userResponse }),
        });
        const data = await response.json();
        setEvaluation(data.evaluation);
        console.log(data)
    }
    catch (error) {
      console.error('Error evaluating response:', error);
    }
  }

  return (
    <>
      <h1>Generate a Coding Problem</h1>
      <button onClick={handleGenerateProblem} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Problem'}
      </button>
      {problem && (
        <>
          <div>
            <h2>Generated Problem</h2>
            <pre>{problem}</pre>
          </div>

          <form onSubmit={handleEvaluateResponse}>
            <input
              type="text"
              onChange={(e) => setUserResponse(e.target.value)}
            />
            <button type="submit">Evaluate Response</button>
          </form>
          
        </>
      )}

      {evaluation && (
        <div>
          <h2>Evaluation</h2>
          <pre>{evaluation}</pre>
        </div>
      )}
    </>
  );
}

export default GenerateProblems;
