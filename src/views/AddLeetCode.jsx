import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UpdateForms.css';

function AddLeetCode() {
    const [leetcodeUsername, setLeetCodeUsername] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleAddLeetCode = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/addLeetCode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leetcode_username: leetcodeUsername }),
                credentials: 'include'
            });
            const data = await response.json();
            setMessage(data.message);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating LeetCode username:', error);
        }
    };

    return (
        <div className="update-form-container">
            <h1>Add or Update LeetCode Username</h1>
            <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetCodeUsername(e.target.value)}
                placeholder="Enter LeetCode username"
            />
            <button onClick={handleAddLeetCode}>Update</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddLeetCode;
