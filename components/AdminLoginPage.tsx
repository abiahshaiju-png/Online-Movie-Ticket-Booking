import React, { useState } from 'react';
import { ADMIN_USER, ADMIN_PASS } from '../constants';

interface AdminLoginPageProps {
    onLogin: () => void;
    setView: (view: 'main') => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, setView }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            onLogin();
        } else {
            setError('Invalid admin credentials.');
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="admin-username">Admin Username</label>
                    <input
                        id="admin-username"
                        type="text"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="admin-password">Admin Password</label>
                    <div className="password-wrapper">
                        <input
                            id="admin-password"
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
                <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '6px', marginTop: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Hint: Use <strong>username:</strong> admin & <strong>password:</strong> admin123
                    </p>
                </div>
                <div className="button-group" style={{ marginTop: '1.5rem' }}>
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setView('main')}>
                &larr; Back to Main
            </button>
        </div>
    );
};

export default AdminLoginPage;