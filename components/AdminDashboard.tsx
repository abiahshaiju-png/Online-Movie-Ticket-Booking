import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { dbService } from '../services/databaseService';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieName, setMovieName] = useState('');
    const [genre, setGenre] = useState('');
    const [director, setDirector] = useState('');

    useEffect(() => {
        setMovies(dbService.getMovies());
    }, []);

    const refreshMovies = () => {
        setMovies(dbService.getMovies());
    }

    const handleAddMovie = (e: React.FormEvent) => {
        e.preventDefault();
        if (!movieName || !genre || !director) {
            alert('Please fill all movie fields.');
            return;
        }
        dbService.addMovie(movieName, genre, director);
        setMovieName('');
        setGenre('');
        setDirector('');
        refreshMovies();
    };

    const handleRemoveMovie = (movieId: number) => {
        if (window.confirm('Are you sure you want to remove this movie and all its showtimes?')) {
            dbService.removeMovie(movieId);
            refreshMovies();
        }
    };
    
    const handleAddShowtime = (movieId: number) => {
        const time = prompt("Enter new showtime (e.g., 11:00 AM):");
        if(time) {
            dbService.addShowtime(movieId, time);
            refreshMovies();
            alert("Showtime added!");
        }
    };

    return (
        <div className="responsive-flex-container">
            <div className="flex-child-1">
                <h2>Movie Management</h2>
                <form onSubmit={handleAddMovie}>
                    <div className="input-group">
                        <label>Movie Name</label>
                        <input className="input" value={movieName} onChange={e => setMovieName(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Genre</label>
                        <input className="input" value={genre} onChange={e => setGenre(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Director</label>
                        <input className="input" value={director} onChange={e => setDirector(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Movie</button>
                </form>
                 <button onClick={onLogout} className="btn btn-secondary" style={{ marginTop: '2rem' }}>Logout</button>
            </div>

            <div className="flex-child-2">
                <h2>Current Movies</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {movies.map(movie => (
                        <li key={movie.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{movie.name}</h3>
                            <p style={{ margin: '0.25rem 0 1rem 0', color: 'var(--text-secondary)' }}>{movie.genre} - Directed by {movie.director}</p>
                             <p><strong>Showtimes:</strong> {movie.showtimes.map(st => st.time).join(', ')}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                <button className="btn btn-secondary" style={{width: 'auto', padding: '0.5rem 1rem'}} onClick={() => handleAddShowtime(movie.id)}>Add Showtime</button>
                                <button className="btn btn-danger" style={{width: 'auto', padding: '0.5rem 1rem'}} onClick={() => handleRemoveMovie(movie.id)}>Remove Movie</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;