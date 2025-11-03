import {useState, useEffect} from 'react'
import {cinemaApi, moviesApi, movieSessionsApi} from '@services'
import {MovieSession, Movie, Cinema} from '@types'

interface BookingData {
  movieSession: MovieSession | null
  movie: Movie | null
  cinema: Cinema | null
  loading: boolean
}

export const useBookingData = (movieSessionId: number): BookingData => {
  const [movieSession, setMovieSession] = useState<MovieSession | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [cinema, setCinema] = useState<Cinema | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionData, moviesData, cinemasData]: [MovieSession, Movie[], Cinema[]] = await Promise.all([
          movieSessionsApi.getMovieSession(movieSessionId),
          moviesApi.getMovies(),
          cinemaApi.getCinemas()
        ])

        const movieData = moviesData.find(movie => movie.id === sessionData.movieId)
        const cinemaData = cinemasData.find(cinema => cinema.id === sessionData.cinemaId)

        setMovieSession(sessionData)
        setMovie(movieData || null)
        setCinema(cinemaData || null)
      } catch (error) {
        console.error('Error fetching movie session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieSessionId])

  return {movieSession, movie, cinema, loading}
}
