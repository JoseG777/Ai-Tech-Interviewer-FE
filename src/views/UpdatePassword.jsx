// src/views/ChangePassword.jsx
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Import auth from your firebase setup

function UpdatePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem('uid')) {
            navigate('/');
        }
      }, []);

    const handlePasswordChange = async (event) => {
        event.preventDefault();

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        const user = auth.currentUser;

        if (user) {
            try {
                // Re-authenticate the user with the current password
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);

                // Update the password
                await updatePassword(user, newPassword);

                setSuccess('Password updated successfully!');
                setError('');
                navigate('/profile');
            } catch (err) {
                setError('Error updating password: ' + err.message);
            }
        } else {
            setError('No user is currently signed in.');
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                    <label htmlFor="current-password">Current Password:</label>
                    <input
                        type="password"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="new-password">New Password:</label>
                    <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update Password</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
}

export default UpdatePassword;
