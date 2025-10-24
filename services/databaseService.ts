import { TOTAL_SEATS, SEAT_PRICE } from '../constants';
import { User, Movie, AppDatabase, Seat, Booking, Showtime, AuthResult } from '../types';

const DB_KEY = 'movie_system_db';

class DatabaseService {
    private db: AppDatabase;

    constructor() {
        this.db = this.loadDatabase();
        if (typeof this.db.lastId !== 'number') {
            this.db.lastId = Date.now();
        }
    }

    private loadDatabase(): AppDatabase {
        try {
            const data = localStorage.getItem(DB_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error("Failed to load database from localStorage", error);
        }
        // If no data, initialize with default
        const newDb = this.getInitialData();
        this.saveDatabase(newDb);
        return newDb;
    }

    private saveDatabase(db: AppDatabase) {
        try {
            localStorage.setItem(DB_KEY, JSON.stringify(db));
        } catch (error) {
            console.error("Failed to save database to localStorage", error);
        }
    }

    private commit() {
        this.saveDatabase(this.db);
    }

    private getNextId(): number {
        this.db.lastId++;
        return this.db.lastId;
    }

    private getInitialData(): AppDatabase {
        const times = ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM", "09:00 PM"];
        let idCounter = 0;
        const getInitialId = () => ++idCounter;

        const createShowtimes = (): Showtime[] => {
            return times.map((time) => ({
                id: getInitialId(),
                time,
                totalSeats: TOTAL_SEATS,
            }));
        };
        
        const initialMovies: Movie[] = [
            { id: getInitialId(), name: "Inception", genre: "Sci-Fi", director: "Christopher Nolan", showtimes: createShowtimes() },
            { id: getInitialId(), name: "Titanic", genre: "Romance", director: "James Cameron", showtimes: createShowtimes() },
            { id: getInitialId(), name: "Avengers: Endgame", genre: "Action", director: "Russo Brothers", showtimes: createShowtimes() },
            { id: getInitialId(), name: "Joker", genre: "Drama", director: "Todd Phillips", showtimes: createShowtimes() },
            { id: getInitialId(), name: "Frozen II", genre: "Animation", director: "Chris Buck", showtimes: createShowtimes() }
        ];


        return {
            lastId: idCounter,
            users: [],
            movies: initialMovies,
            bookedSeats: [],
            bookings: [],
        };
    }

    // User Methods
    authenticateUser(username: string, password_raw: string): AuthResult {
        const user = this.db.users.find(u => u.username === username);
        if (!user) {
            return { success: false, message: 'User not found. Please create an account.' };
        }
        if (user.password !== password_raw) {
            return { success: false, message: 'Invalid password.' };
        }
        return { success: true, user: { username: user.username } };
    }

    registerUser(username: string, password_raw: string): boolean {
        if (this.db.users.some(u => u.username === username)) {
            return false;
        }
        this.db.users.push({ username, password: password_raw });
        this.commit();
        return true;
    }

    // Movie Methods
    getMovies(): Movie[] {
        return [...this.db.movies];
    }

    addMovie(name: string, genre: string, director: string): Movie {
        const newId = this.getNextId();
        const times = ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM", "09:00 PM"];
        const newShowtimes: Showtime[] = times.map((time) => ({
            id: this.getNextId(),
            time,
            totalSeats: TOTAL_SEATS
        }));

        const newMovie: Movie = {
            id: newId,
            name,
            genre,
            director,
            showtimes: newShowtimes
        };
        this.db.movies.push(newMovie);
        this.commit();
        return newMovie;
    }
    
    removeMovie(movieId: number): void {
        const movie = this.db.movies.find(m => m.id === movieId);
        if(!movie) return;

        const showtimeIds = movie.showtimes.map(st => st.id);
        
        this.db.bookedSeats = this.db.bookedSeats.filter(seat => !showtimeIds.includes(seat.showtimeId));
        this.db.movies = this.db.movies.filter(m => m.id !== movieId);
        this.commit();
    }

    // Showtime Methods
    addShowtime(movieId: number, time: string): void {
        const movie = this.db.movies.find(m => m.id === movieId);
        if (movie) {
            const newShowtime: Showtime = {
                id: this.getNextId(),
                time,
                totalSeats: TOTAL_SEATS
            };
            movie.showtimes.push(newShowtime);
            this.commit();
        }
    }
    
    // Seat & Booking Methods
    getSeatStatus(showtimeId: number): boolean[] {
        const seatStatus = new Array(TOTAL_SEATS).fill(false);
        const booked = this.db.bookedSeats.filter(s => s.showtimeId === showtimeId);
        booked.forEach(seat => {
            if(seat.seatNumber >= 1 && seat.seatNumber <= TOTAL_SEATS) {
                seatStatus[seat.seatNumber - 1] = true;
            }
        });
        return seatStatus;
    }
    
    getAvailableSeatsCount(showtimeId: number): number {
        const bookedCount = this.db.bookedSeats.filter(s => s.showtimeId === showtimeId).length;
        return TOTAL_SEATS - bookedCount;
    }

    bookSeats(username: string, movie: Movie, showtime: Showtime, seatNumbers: number[]): void {
        const newSeats: Seat[] = seatNumbers.map(seatNumber => ({
            showtimeId: showtime.id,
            seatNumber,
        }));
        this.db.bookedSeats.push(...newSeats);

        const newBooking: Booking = {
            id: `booking-${this.getNextId()}`,
            username,
            movieName: movie.name,
            showtime: showtime.time,
            seats: seatNumbers,
            totalPrice: seatNumbers.length * SEAT_PRICE
        };
        this.db.bookings.push(newBooking);

        this.commit();
    }

    getUserBookings(username: string): Booking[] {
        return this.db.bookings.filter(b => b.username === username);
    }
}

// Export a singleton instance
export const dbService = new DatabaseService();