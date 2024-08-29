import React, { useEffect, useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


function DeleteAccount() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    // make sures user exists
    const reauthenticate = (currentPassword) => {
        const user = auth.currentUser;
        const cred = EmailAuthProvider.credential(user.email, currentPassword);
        return reauthenticateWithCredential(user, cred);
    };

    const handleDeleteAccount = () => {
        reauthenticate(password).then(() => {
            const user = auth.currentUser;
    
            fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/deleteUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    deleteUser(user).then(() => {
                        navigate('/');
                        location.reload();
                        alert("Account deleted successfully!");
                    }).catch((error) => {
                        console.error("Error deleting account", error);
                        alert("Error deleting account. Please try again.");
                    });
                } else {
                    console.error("Error deleting user data from backend", data.error);
                    alert("Error deleting user data from backend. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error sending user ID to backend:", error);
                alert("Error communicating with backend. Please try again.");
            });
        }).catch((error) => {
            console.error("Reauthentication failed", error);
            alert("Reauthentication failed. Please check your password and try again.");
        });
    };
    

    // styling
    return (
        <div className="fullscreen-flex-container">
            <h2 className="title-text">Delete Account</h2>
            <form className="centered-form-wrapper" onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(); }}>
                <input
                    className="styled-input"
                    placeholder="Enter Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button className="primary-button" type="submit">Delete My Account</button>
            </form>
        </div>
    );
}

export default DeleteAccount;