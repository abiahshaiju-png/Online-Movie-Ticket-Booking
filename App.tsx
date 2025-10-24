import React, { useState } from 'react';
import { User } from './types';
import MainPage from './components/MainPage';
import UserLoginPage from './components/UserLoginPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import UserMovieBooking from './components/UserMovieBooking';

type View = 'main' | 'userLogin' | 'adminLogin' | 'adminDashboard' | 'userDashboard';

const App: React.FC = () => {
    const [view, setView] = useState<View>('main');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const handleUserLogin = (user: User) => {
        setCurrentUser(user);
        setIsAdmin(false);
        setView('userDashboard');
    };

    const handleAdminLogin = () => {
        setCurrentUser({ username: 'admin' });
        setIsAdmin(true);
        setView('adminDashboard');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsAdmin(false);
        setView('main');
    };

    const renderView = () => {
        switch (view) {
            case 'main':
                return <MainPage setView={setView} />;
            case 'userLogin':
                return <UserLoginPage onLogin={handleUserLogin} setView={setView} />;
            case 'adminLogin':
                return <AdminLoginPage onLogin={handleAdminLogin} setView={setView} />;
            case 'adminDashboard':
                return <AdminDashboard onLogout={handleLogout} />;
            case 'userDashboard':
                if (currentUser) {
                    return <UserMovieBooking user={currentUser} onLogout={handleLogout} />;
                }
                // Fallback to login if user is not set, preventing an inconsistent state.
                return <UserLoginPage onLogin={handleUserLogin} setView={setView} />;
            default:
                return <MainPage setView={setView} />;
        }
    };

    return (
        <div className={`container ${view === 'adminDashboard' || view === 'userDashboard' ? '' : 'form-container'}`}>
            {renderView()}
        </div>
    );
};

export default App;