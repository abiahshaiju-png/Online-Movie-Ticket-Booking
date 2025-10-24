import React from 'react';

interface MainPageProps {
    setView: (view: 'userLogin' | 'adminLogin') => void;
}

const MainPage: React.FC<MainPageProps> = ({ setView }) => {
    return (
        <div>
            <h1>🎬 Movie Ticket Booking</h1>
            <p>Welcome to your premium cinema experience. Please select your login type to proceed.</p>
            <div className="button-group">
                <button className="btn btn-primary" onClick={() => setView('userLogin')}>
                    👤 User Login / Signup
                </button>
                <button className="btn btn-secondary" onClick={() => setView('adminLogin')}>
                    ⚙️ Admin Login
                </button>
            </div>
        </div>
    );
};

export default MainPage;
