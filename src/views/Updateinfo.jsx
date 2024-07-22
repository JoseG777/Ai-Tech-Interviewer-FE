// src/views/UpdateInfo.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/UpdateInfo.css';
import '../styles/main-content.css';

function UpdateInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { field } = location.state || {};
  const [currentValue, setCurrentValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!sessionStorage.getItem('uid')) {
        navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch current value of the field to display
    const fetchCurrentValue = async () => {
      try {
        const uid = sessionStorage.getItem('uid');
        const response = await fetch(`/api/getUserInfo?uid=${uid}`);
        const data = await response.json();
        setCurrentValue(data[field]);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchCurrentValue();
  }, [field]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!newValue.trim()) {
      setErrorMessage('Field cannot be empty.');
      return;
    }

    try {
      const uid = sessionStorage.getItem('uid');
      const response = await fetch('/api/updateUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          field,
          newValue
        }),
      });
      const data = await response.json();
      console.log(data); // Handle response from the backend
      navigate('/profile');
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  return (
    <div className="main-content">
    <div className="update-info-container">
      <h1>Update Information {field}</h1>
      <h2>Update {field}</h2>
      <p>Current Value: {currentValue}</p>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Enter new ${field}`}
          required
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Update</button>
      </form>
    </div>
    </div>
  );
}

export default UpdateInfo;
