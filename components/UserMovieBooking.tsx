import React, { useState, useEffect, useMemo } from 'react';
import { User, Movie, Showtime, Booking } from '../types';
import { dbService } from '../services/databaseService';
import SeatSelection from './SeatSelection';

interface UserMovieBookingProps {
    user: User;
    onLogout: () => void;
}

const UserMovieBooking: React.FC<UserMovieBookingProps> = ({ user, onLogout }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
    const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(null);
    const [isSeatSelectorOpen, setSeatSelectorOpen] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const selectedMovie = useMemo(() => movies.find(m => m.id === selectedMovieId) || null, [movies, selectedMovieId]);
    const selectedShowtime = useMemo(() => selectedMovie?.showtimes.find(st => st.id === selectedShowtimeId) || null, [selectedMovie, selectedShowtimeId]);

    const refreshBookings = () => {
        setBookings(dbService.getUserBookings(user.username));
    };

    const refreshMovies = () => {
        setMovies(dbService.getMovies());
    };

    useEffect(() => {
        refreshMovies();
        refreshBookings();
    }, [user.username]);

    const handleMovieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const movieId = parseInt(e.target.value, 10);
        setSelectedMovieId(movieId);
        setSelectedShowtimeId(null);
    };

    const handleShowtimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const showtimeId = parseInt(e.target.value, 10);
        setSelectedShowtimeId(showtimeId);
    };

    const handleBookingComplete = () => {
        setSeatSelectorOpen(false);
        refreshBookings();
        refreshMovies(); // Refresh movie data to update available seat counts
        setSelectedMovieId(null);
        setSelectedShowtimeId(null);
    };

    return (
        <div className="responsive-flex-container">
            <div className="flex-child-1">
                <h2>Book Your Tickets</h2>
                <p>Welcome, {user.username}!</p>
                <div className="input-group">
                    <label>Select Movie:</label>
                    <select className="select" onChange={handleMovieChange} value={selectedMovieId ?? ''}>
                        <option value="" disabled>-- Choose a Movie --</option>
                        {movies.map(movie => (
                            <option key={movie.id} value={movie.id}>{movie.name}</option>
                        ))}
                    </select>
                </div>
                {selectedMovie && (
                    <div className="input-group">
                        <label>Select Showtime:</label>
                        <select className="select" onChange={handleShowtimeChange} value={selectedShowtimeId ?? ''} disabled={!selectedMovieId}>
                            <option value="" disabled>-- Choose a Showtime --</option>
                            {selectedMovie.showtimes.map(showtime => {
                                const availableSeats = dbService.getAvailableSeatsCount(showtime.id);
                                return (
                                    <option key={showtime.id} value={showtime.id} disabled={availableSeats === 0}>
                                        {showtime.time} ({availableSeats} seats available)
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )}
                <button
                    className="btn btn-primary"
                    onClick={() => setSeatSelectorOpen(true)}
                    disabled={!selectedMovie || !selectedShowtime}
                >
                    Select Seats
                </button>
                <button onClick={onLogout} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Logout</button>
            </div>
            
            <div className="flex-child-2">
                <h2>Your Booking History</h2>
                {bookings.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {bookings.map(booking => (
                            <li key={booking.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>{booking.movieName}</h3>
                                <p style={{ margin: '0.25rem 0' }}>Showtime: {booking.showtime}</p>
                                <p style={{ margin: '0.25rem 0' }}>Seats: {booking.seats.join(', ')}</p>
                                <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>Total: ₹{booking.totalPrice}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have no bookings yet.</p>
                )}
            </div>

            {isSeatSelectorOpen && selectedMovie && selectedShowtime && (
                <SeatSelection
                    key={selectedShowtime.id}
                    user={user}
                    movie={selectedMovie}
                    showtime={selectedShowtime}
                    onClose={() => setSeatSelectorOpen(false)}
                    onBookingComplete={handleBookingComplete}
                />
            )}
        </div>
    );
};

export default UserMovieBooking;