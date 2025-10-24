import React, { useState, useMemo } from 'react';
import { User, Movie, Showtime } from '../types';
import { dbService } from '../services/databaseService';
import { TOTAL_SEATS, SEAT_PRICE } from '../constants';

interface SeatSelectionProps {
    user: User;
    movie: Movie;
    showtime: Showtime;
    onClose: () => void;
    onBookingComplete: () => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ user, movie, showtime, onClose, onBookingComplete }) => {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [cardDetails, setCardDetails] = useState('');
    const [isPaying, setIsPaying] = useState(false);

    const bookedSeats = useMemo(() => {
        const status = dbService.getSeatStatus(showtime.id);
        const booked: number[] = [];
        status.forEach((isBooked, index) => {
            if (isBooked) {
                booked.push(index + 1);
            }
        });
        return booked;
    }, [showtime.id]);

    const handleSeatClick = (seatNumber: number) => {
        setSelectedSeats(prev =>
            prev.includes(seatNumber)
                ? prev.filter(s => s !== seatNumber)
                : [...prev, seatNumber]
        );
    };

    const handleConfirmPayment = () => {
        if (!cardDetails) {
            alert('Please enter mock card details.');
            return;
        }
        dbService.bookSeats(user.username, movie, showtime, selectedSeats);
        alert('Payment successful! Your seats are booked.');
        onBookingComplete();
    };

    const totalPrice = selectedSeats.length * SEAT_PRICE;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {!isPaying ? (
                    <>
                        <h2>Select Your Seats</h2>
                        <p>{movie.name} at {showtime.time}</p>
                        
                        <div className="legend-container">
                            <div className="legend-item"><span className="legend-color-box" style={{backgroundColor: 'var(--white)', border: '1px solid var(--border)'}}></span> Available</div>
                            <div className="legend-item"><span className="legend-color-box" style={{backgroundColor: 'var(--success)'}}></span> Selected</div>
                            <div className="legend-item"><span className="legend-color-box" style={{backgroundColor: 'var(--accent)'}}></span> Booked</div>
                        </div>

                        <div className="seat-grid">
                            {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map(seatNumber => {
                                const isBooked = bookedSeats.includes(seatNumber);
                                const isSelected = selectedSeats.includes(seatNumber);
                                return (
                                    <button
                                        key={seatNumber}
                                        className={`seat-btn ${isBooked ? 'is-booked' : ''} ${isSelected ? 'is-selected' : ''}`}
                                        onClick={() => handleSeatClick(seatNumber)}
                                        disabled={isBooked}
                                    >
                                        {seatNumber}
                                    </button>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <p>Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
                            <h3>Total Price: ₹{totalPrice}</h3>
                        </div>
                        <div className="button-group" style={{ flexDirection: 'row', marginTop: '1.5rem', gap: '1rem' }}>
                            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button className="btn btn-primary" disabled={selectedSeats.length === 0} onClick={() => setIsPaying(true)}>
                                Proceed to Payment
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Confirm Payment</h2>
                        <p><strong>Movie:</strong> {movie.name}</p>
                        <p><strong>Showtime:</strong> {showtime.time}</p>
                        <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                        <h3>Total Price: ₹{totalPrice}</h3>
                        <div className="input-group" style={{marginTop: '1.5rem'}}>
                            <label>Card Number (mock)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Enter any card number"
                                value={cardDetails}
                                onChange={e => setCardDetails(e.target.value)}
                            />
                        </div>
                        <div className="button-group" style={{ flexDirection: 'row', marginTop: '1.5rem', gap: '1rem' }}>
                             <button className="btn btn-secondary" onClick={() => setIsPaying(false)}>Back</button>
                            <button className="btn btn-primary" onClick={handleConfirmPayment}>Confirm Payment</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SeatSelection;