export interface Cinema {
  id: number
  name: string
  address: string
}

export interface Session {
  id: number
  movieId: number
  cinemaId: number
  startTime: string
}

export interface Movie {
  id: number
  title: string
  description: string
  posterImage: string
  lengthMinutes: number
  rating: number
  year: number
}

export interface Seat {
  rowNumber: number
  seatNumber: number
}

export interface MovieSession {
  id: number
  movieId: number
  cinemaId: number
  startTime: string
  seats: {
    rows: number
    seatsPerRow: number
  }
  bookedSeats: Seat[]
}

export interface Booking {
  id: string
  userId: number
  movieSessionId: number
  sessionId: number
  bookedAt: string
  seats: Seat[]
  isPaid: boolean
}

export interface BookingWithDetails extends Booking {
  movieTitle?: string
  cinemaName?: string
  startTime?: string
}
