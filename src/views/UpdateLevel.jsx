import React, { useState } from 'react';

function UpdateLevel() {
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdateLevelDescription = async () => {
        const uid = sessionStorage.getItem('uid');
        try {
            const response = await fetch('/api/updateLevel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, level_description: description })
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Error updating level description:', error);
        }
    };

    return (
        <div>
            <h1>Update Level Description</h1>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter new level description"
            />
            <button onClick={handleUpdateLevelDescription}>Update</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default UpdateLevel;
