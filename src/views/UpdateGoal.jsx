import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UpdateForms.css';

function UpdateGoal() {
    const [goal, setGoal] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleUpdateGoal = async () => {
        const uid = sessionStorage.getItem('uid');
        try {
            const response = await fetch('/api/updateGoal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, current_goal: goal })
            });
            const data = await response.json();
            setMessage(data.message);
            navigate('/profile')
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    return (
        <div className="update-form-container">
            <h1>Update Current Goal</h1>
            <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Enter new goal"
            />
            <button onClick={handleUpdateGoal}>Update</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default UpdateGoal;
