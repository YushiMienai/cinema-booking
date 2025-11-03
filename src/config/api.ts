const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  console.error('VITE_API_URL is not defined in environment variables')
}

export const API_CONFIG = {
  baseURL: API_URL || 'http://localhost:3022',
  timeout: 10000,
  endpoints: {
    movies: '/movies',
    cinemas: '/cinemas',
    movieSessions: '/movieSessions',
    cinemaSessions: '/cinemaSessions',
    login: '/login',
    register: '/register',
    meBookings: '/me/bookings',
    bookings: '/bookings',
    settings: '/settings',
  }
}
