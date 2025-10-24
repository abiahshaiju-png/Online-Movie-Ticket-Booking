export interface User {
    username: string;
    password?: string; // Password is not always needed on the client side
}

export interface Showtime {
    id: number;
    time: string;
    totalSeats: number;
}

export interface Movie {
    id: number;

    name: string;
    genre: string;
    director: string;
    showtimes: Showtime[];
}

export interface Seat {
    showtimeId: number;
    seatNumber: number;
}

export interface Booking {
    id: string;
    username: string;
    movieName: string;
    showtime: string;
    seats: number[];
    totalPrice: number;
}

// Defines the shape of the entire database stored in localStorage
export interface AppDatabase {
    lastId: number;
    users: User[];
    movies: Movie[];
    bookedSeats: Seat[];
    bookings: Booking[];
}

export type AuthResult = { success: true, user: User } | { success: false, message: string };