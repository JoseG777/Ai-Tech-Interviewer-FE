import React, { useState } from 'react';

function GenerateProblems() { 
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerateProblem() {
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

  return (
    <div>
      <h1>Generate a Coding Problem</h1>
      <button onClick={handleGenerateProblem} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Problem'}
      </button>
      {problem && (
        <div>
          <h2>Generated Problem</h2>
          <pre>{problem}</pre>
        </div>
      )}
    </div>
  );
}

export default GenerateProblems;
