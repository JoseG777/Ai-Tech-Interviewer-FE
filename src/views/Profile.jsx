import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import '../styles/main-content.css';
import '../styles/Profile.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement, TimeScale, Title, Tooltip, Legend);

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [codeGrades, setCodeGrades] = useState([]);
  const [speechGrades, setSpeechGrades] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('uid')) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const uid = sessionStorage.getItem('uid');
        const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/getUsers?uid=${uid}`);
        const data = await response.json();
        setUserInfo(data.user);
        setCodeGrades(data.code_grades);
        setSpeechGrades(data.speech_grades);
        setAttempts(data.attempts);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Prepare data for the line chart
  const attemptsLineData = {
    labels: attempts.map(attempt => attempt.saved_date),
    datasets: [
      {
        label: 'Number of Attempts Per Date',
        data: attempts.map(attempt => attempt.count),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  // console.log(attemptsLineData);

  const codeGradeCounts = Array.from({ length: 10 }, (_, i) => codeGrades.filter(grade => grade.final_code_grade === i + 1).length);
  const speechGradeCounts = Array.from({ length: 10 }, (_, i) => speechGrades.filter(grade => grade.final_speech_grade === i + 1).length);

  const codeBarData = {
    labels: Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`),
    datasets: [
      {
        label: 'Code Grades',
        data: codeGradeCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const speechBarData = {
    labels: Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`),
    datasets: [
      {
        label: 'Speech Grades',
        data: speechGradeCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="profile-container">
        <h1>Profile Page</h1>
        <h2>Hello, {userInfo.username}!</h2>
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
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Code Grades</h3>
          <Bar data={codeBarData} options={{ scales: { x: { ticks: { font: { size: 16 } } }, y: { ticks: { font: { size: 16 } } } } }} />
        </div>

        <br />
        <br />

        <div className="chart">
          <h3>Speech Grades</h3>
          <Bar data={speechBarData} options={{ scales: { x: { ticks: { font: { size: 16 } } }, y: { ticks: { font: { size: 16 } } } } }} />
        </div>

        <br />
        <br />

        <div className="chart">
          <h3>Coding Attempts Per Date</h3>
          <Line
            data={attemptsLineData}
            options={{
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day', 
                    tooltipFormat: 'yyyy-MM-dd', 
                    displayFormats: {
                      day: 'MMM d', 
                    },
                  },
                  ticks: {
                    font: { size: 16 },
                  },
                },
                y: {
                  ticks: { font: { size: 16 } },
                },
              },
            }}
          />
        </div>

        <br />
        <br />
      </div>

      <div className="profile-item">
        <button onClick={() => navigate('/delete-account')}>Delete Account</button>
        <button onClick={() => navigate('/update-password')}>Change Password</button>
      </div>
    </div>
  );
}

export default Profile;
