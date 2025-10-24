import React, { useState } from 'react';
import { User } from '../types';
import { dbService } from '../services/databaseService';

interface UserLoginPageProps {
    onLogin: (user: User) => void;
    setView: (view: 'main') => void;
}

const UserLoginPage: React.FC<UserLoginPageProps> = ({ onLogin, setView }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }
        const result = dbService.authenticateUser(username, password);
        // FIX: Use the `in` operator for robust type-narrowing of the AuthResult discriminated union.
        if ('user' in result) {
            onLogin(result.user);
        } else {
            setError(result.message);
        }
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }
        if (dbService.registerUser(username, password)) {
            setSuccessMessage('Account created successfully! Please log in.');
            setUsername('');
            setPassword('');
        } else {
            setError('Username already exists. Please choose another.');
        }
    };

    return (
        <div>
            <h2>User Authentication</h2>
            <form>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            id="password"
                            type={isPasswordVisible ? 'text' : 'password'}
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                        >
                            {isPasswordVisible ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <p className="input-hint">Click the 🙈 icon to hide your password.</p>
                </div>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p style={{ color: 'var(--success)' }}>{successMessage}</p>}
                <div className="button-group" style={{ marginTop: '1.5rem', gap: '0.75rem' }}>
                    <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                    <button className="btn btn-secondary" onClick={handleSignup}>Create Account</button>
                </div>
            </form>
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setView('main')}>
                &larr; Back to Main
            </button>
        </div>
    );
};

export default UserLoginPage;