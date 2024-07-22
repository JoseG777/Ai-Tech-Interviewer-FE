// src/views/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, BarElement } from 'chart.js';
import '../styles/main-content.css';
import '../styles/Profile.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement);

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('uid')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const uid = sessionStorage.getItem('uid');
        const response = await fetch(`/api/getUsers?uid=${uid}`);
        const data = await response.json();
        setUserInfo(data.user);
        setGrades(data.grades);
        setAttempts(data.attempts);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Prepare data for the line graph (grades progress)
  const lineData = {
    labels: grades.map(grade => grade.saved_date),
    datasets: [
      {
        label: 'Grades Over Time',
        data: grades.map(grade => grade.final_grade),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };

  // Prepare data for the bar graph (attempts per date)
  const barData = {
    labels: attempts.map(attempt => attempt.saved_date),
    datasets: [
      {
        label: 'Number of Attempts Per Date',
        data: attempts.map(attempt => attempt.count),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
      <div className="main-content">
        <div className="profile-container">
          <h1>Profile Page</h1>
          <h2>Hello, {userInfo.username || 'user'}!</h2>
          <div className="profile-info">
            <div className="profile-item">
              <label>Level Description:</label>
              <span>{userInfo.level_description}</span>
              <button onClick={() => navigate('/update-level-description')}>Update</button>
            </div>
            <div className="profile-item">
              <label>Goal:</label>
              <span>{userInfo.current_goal || 'Not set'}</span>
              <button onClick={() => navigate('/update-current-goal')}>Update</button>
            </div>
            <div className="profile-item">
              <label>Upcoming Interview:</label>
              <span>{userInfo.upcoming_interview || 'Not set'}</span>
              <button onClick={() => navigate('/update-upcoming-interview')}>Update</button>
            </div>
            <div className="profile-item">
              <label>Change Password:</label>
              <button onClick={() => navigate('/change-password')}>Change Password</button>
            </div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart">
            <h3>Grades Progress</h3>
            <Line data={lineData} />
          </div>
          <div className="chart">
            <h3>Attempts Per Date</h3>
            <Bar data={barData} />
          </div>
        </div>
      </div>
  );
}

export default Profile;

