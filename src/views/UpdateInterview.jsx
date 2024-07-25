import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UpdateForms.css';

function UpdateInterview() {
    const [interview, setInterview] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem('uid')) {
            navigate('/');
        }
      }, []);

    const handleUpdateInterview = async () => {
        const uid = sessionStorage.getItem('uid');
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/updateInterview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, upcoming_interview: interview })
            });
            const data = await response.json();
            setMessage(data.message);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating interview:', error);
        }
    };

    return (
        <div className="update-form-container">
            <h1>Update Upcoming Interview</h1>
            <input
                type="text"
                value={interview}
                onChange={(e) => setInterview(e.target.value)}
                placeholder="Enter new upcoming interview"
            />
            <button onClick={handleUpdateInterview}>Update</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default UpdateInterview;
