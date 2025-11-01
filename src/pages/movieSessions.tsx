import {useState, useEffect} from 'react'
import {moviesApi, cinemaApi} from '@services'
import {Movie, Session, Cinema, GroupedSession} from '@types'
import {SessionsTable} from '@components'

const API_URL = import.meta.env.VITE_API_URL

interface MovieSessionsProps {
  movieId: number
  onMovieSessionSelect: (movieSessionId: number) => void
}

export const MovieSessions = ({movieId, onMovieSessionSelect}: MovieSessionsProps) => {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, sessionsData, cinemasData]: [Movie[], Session[], Cinema[]] = await Promise.all([
          moviesApi.getMovies(),
          moviesApi.getMovieSessions(movieId),
          cinemaApi.getCinemas()
        ])

        const movieData = moviesData.find(movie => movie.id === movieId)
        setMovie(movieData || null)
        setSessions(sessionsData)
        setCinemas(cinemasData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieId])

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}ч ${mins}м`
  }

  const getCinemaName = (cinemaId: number): string => {
    const cinema = cinemas.find(cinema => cinema.id === cinemaId)
    return cinema?.name || 'Неизвестный кинотеатр'
  }

  const groupSessionsByCinema = (sessions: Session[]) => {
    const groupedByCinema: {[key: string]: GroupedSession[]} = {}

    sessions.forEach(session => {
      const date = new Date(session.startTime).toLocaleDateString('ru-RU')
      const cinemaName = getCinemaName(session.cinemaId)
      const time = formatTime(session.startTime)

      if (!groupedByCinema[date]) {
        groupedByCinema[date] = []
      }

      const existingCinema = groupedByCinema[date].find(cinema => cinema.entityId === session.cinemaId)

      if (existingCinema) {
        existingCinema.times.push({time, sessionId: session.id})
      } else {
        groupedByCinema[date].push({
          id: session.cinemaId,
          entityId: session.cinemaId,
          entityTitle: cinemaName,
          times: [{time, sessionId: session.id}]
        })
      }
    })

    return groupedByCinema
  }

  const sessionColumns = [
    {
      key: 'cinema',
      title: 'Кинотеатр',
      field: 'entityTitle'
    },
    {
      key: 'times',
      title: 'Время'
    }
  ]

  if (loading) {
    return <div className='loading'>Загрузка сеансов...</div>
  }

  if (!movie) {
    return <div className='error'>Фильм не найден</div>
  }

  const groupedSessions = groupSessionsByCinema(sessions)

  return (
    <div className='movie-sessions-container'>
      <div className='movie-info'>
        <h2 className='movie-title'>{movie.title}</h2>
        <div className='movie-details'>
          <img
            src={API_URL + movie.posterImage}
            alt={movie.title}
            className='movie-poster-large'
          />
          <div className='movie-info-text'>
            <p className='movie-description'>{movie.description}</p>
            <div className='movie-meta'>
              <span><strong>Год:</strong> {movie.year}</span>
              <span><strong>Продолжительность:</strong> {formatDuration(movie.lengthMinutes)}</span>
              <span><strong>Рейтинг:</strong> {movie.rating}</span>
            </div>
          </div>
        </div>
      </div>
      <SessionsTable
        groupedSessions={groupedSessions}
        columns={sessionColumns}
        onSessionSelect={onMovieSessionSelect}
      />
    </div>
  )
}
