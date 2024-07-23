import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserHistory.css';

function UserHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserHistory = async () => {
      const uid = sessionStorage.getItem('uid');
      try {
        const response = await fetch(`/api/getUserHistory?uid=${uid}`);
        const data = await response.json();
        if (data.history) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error('Error fetching user history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, []);

  return (
    <div className="history-container">
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      )}
      {!loading && (
        <>
          <h1>User History</h1>
          <button onClick={() => navigate('/main')}>Go to Main</button>
          {history.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Response</th>
                  <th>Code Evaluation</th>
                  <th>Code Feedback</th>
                  <th>Final Code Grade</th>
                  <th>Speech Evaluation</th>
                  <th>Speech Feedback</th>
                  <th>Final Speech Grade</th>
                  <th>Saved Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr key={index}>
                    <td>{record.user_question}</td>
                    <td>{record.user_response}</td>
                    <td>{record.code_evaluation}</td>
                    <td>{record.code_feedback}</td>
                    <td>{record.final_code_grade}</td>
                    <td>{record.speech_evaluation || 'N/A'}</td>
                    <td>{record.speech_feedback || 'N/A'}</td>
                    <td>{record.final_speech_grade || 'N/A'}</td>
                    <td>{record.saved_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No history available.</p>
          )}
        </>
      )}
    </div>
  );
}

export default UserHistory;
