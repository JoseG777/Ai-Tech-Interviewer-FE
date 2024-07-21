// src/views/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('uid')) {
        navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch user info from the API or session storage
    const fetchUsers = async () => {
      try {
        const uid = sessionStorage.getItem('uid');
        const response = await fetch(`/api/getUsers?uid=${uid}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateClick = (field) => {
    navigate('/updateinfo', { state: { field } });
  };

  if (!users) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <h2>Hello, {users.leetcodeUsername}!</h2>
      <div className="profile-info">
        <div className="profile-item">
          <label>Password:</label>
          <span>{users.password}</span>
          <button onClick={() => handleUpdateClick('password')}>Update</button>
        </div>
        <div className="profile-item">
          <label>Goal:</label>
          <span>{users.goal}</span>
          <button onClick={() => handleUpdateClick('goal')}>Update</button>
        </div>
        <div className="profile-item">
          <label>Upcoming Interview:</label>
          <span>{users.upcomingInterview}</span>
          <button onClick={() => handleUpdateClick('upcomingInterview')}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
