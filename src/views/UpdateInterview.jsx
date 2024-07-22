import React, { useState } from 'react';

function UpdateInterview() {
    const [interview, setInterview] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdateInterview = async () => {
        const uid = sessionStorage.getItem('uid');
        try {
            const response = await fetch('/api/updateInterview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, upcoming_interview: interview })
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Error updating interview:', error);
        }
    };

    return (
        <div>
            <h1>Update Upcoming Interview</h1>
            <input
                type="text"
                value={interview}
                onChange={(e) => setInterview(e.target.value)}
                placeholder="Enter new interview"
            />
            <button onClick={handleUpdateInterview}>Update</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default UpdateInterview;
