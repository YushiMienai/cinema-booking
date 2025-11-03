import {useAuthStore} from '@stores'
import {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  Cinema,
  Session,
  Movie,
  MovieSession,
  Seat,
  Booking
} from '@types'
import {API_CONFIG} from '@config'

const getToken = (): string | null => {
  const state = useAuthStore.getState()

  if (state.isAuthenticated && state.checkAuthTimeout()) {
    return null
  }

  return state.token || null
}

export const authApi = {
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    return response.json()
  },

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    const {username, password} = credentials

    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Registration failed')
    }

    return response.json()
  },
}

export const cinemaApi = {
  async getCinemas(): Promise<Cinema[]> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.cinemas}`)
    if (!response.ok) {
      throw new Error('Failed to fetch cinemas')
    }
    return response.json()
  },

  async getCinemaSessions(cinemaId: number): Promise<Session[]> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.cinemas}/${cinemaId}/sessions`)
    if (!response.ok) {
      throw new Error('Failed to fetch cinema sessions')
    }
    return response.json()
  }
}

export const moviesApi = {
  async getMovies(): Promise<Movie[]> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.movies}`)
    if (!response.ok) {
      throw new Error('Failed to fetch movies')
    }
    return response.json()
  },

  async getMovieSessions(movieId: number): Promise<Session[]> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.movies}/${movieId}/sessions`)
    if (!response.ok) {
      throw new Error('Failed to fetch movie sessions')
    }
    return response.json()
  }
}

export const movieSessionsApi = {
  async getMovieSession(movieSessionId: number): Promise<MovieSession> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.movieSessions}/${movieSessionId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch movie session')
    }
    return response.json()
  },

  async bookSeats(movieSessionId: number, seats: Seat[]): Promise<void> {
    const token = getToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.movieSessions}/${movieSessionId}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({seats}),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Booking failed')
    }
  }
}

export const bookingsApi = {
  async getMyBookings(): Promise<Booking[]> {
    const token = getToken()

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.meBookings}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error('Failed to fetch bookings')
    }

    return response.json()
  },

  async payBooking(bookingId: string): Promise<void> {
    const token = getToken()

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.bookings}/${bookingId}/payments`, {
      method: 'POST',
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Payment failed')
    }
  }
}

export const settingsApi = {
  async getSettings(): Promise<{bookingPaymentTimeSeconds: number}> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.settings}`)
    if (!response.ok) {
      throw new Error('Failed to fetch settings')
    }
    return response.json()
  }
}
