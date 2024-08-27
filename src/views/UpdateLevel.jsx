import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UpdateForms.css';

function UpdateLevel() {
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleUpdateLevelDescription = async () => {
        const uid = sessionStorage.getItem('uid');
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/updateLevel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, level_description: description })
            });
            const data = await response.json();
            setMessage(data.message);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating level description:', error);
        }
    };

    return (
        <div className="update-form-container">
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
