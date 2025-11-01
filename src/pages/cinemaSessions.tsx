import {useState, useEffect} from 'react'
import {cinemaApi, moviesApi} from '@services'
import {Cinema, Session, Movie, GroupedSession} from '@types'
import {SessionsTable} from '@components'

interface CinemaSessionsProps {
  cinemaId: number
  onMovieSessionSelect: (movieSessionId: number) => void
}

export const CinemaSessions = ({cinemaId, onMovieSessionSelect}: CinemaSessionsProps) => {
  const [cinema, setCinema] = useState<Cinema | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cinemasData, sessionsData, moviesData]: [Cinema[], Session[], Movie[]] = await Promise.all([
          cinemaApi.getCinemas(),
          cinemaApi.getCinemaSessions(cinemaId),
          moviesApi.getMovies()
        ])

        const selectedCinema = cinemasData.find(cinema => cinema.id === cinemaId)
        setCinema(selectedCinema || null)
        setSessions(sessionsData)
        setMovies(moviesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [cinemaId])

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})
  }

  const getMovieTitle = (movieId: number): string => {
    const movie = movies.find(movie => movie.id === movieId)
    return movie?.title || 'Неизвестный фильм'
  }

  const groupSessionsByMovie = (sessions: Session[]) => {
    const groupedByMovie: {[key: string]: GroupedSession[]} = {}

    sessions.forEach(session => {
      const date = new Date(session.startTime).toLocaleDateString('ru-RU')
      const movieTitle = getMovieTitle(session.movieId)
      const time = formatTime(session.startTime)

      if (!groupedByMovie[date]) {
        groupedByMovie[date] = []
      }

      const existingMovie = groupedByMovie[date].find(movie => movie.entityId === session.movieId)

      if (existingMovie) {
        existingMovie.times.push({time, sessionId: session.id})
      } else {
        groupedByMovie[date].push({
          id: session.movieId,
          entityId: session.movieId,
          entityTitle: movieTitle,
          times: [{time, sessionId: session.id}]
        })
      }
    })

    return groupedByMovie
  }

  const sessionColumns = [
    {
      key: 'movie',
      title: 'Фильм',
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

  if (!cinema) {
    return <div className='error'>Кинотеатр не найден</div>
  }

  const groupedSessions = groupSessionsByMovie(sessions)

  return (
    <div className='sessions-container'>
      <h2 className='sessions-title'>Сеансы - {cinema.name}</h2>
      <p className='cinema-address'>{cinema.address}</p>

      <SessionsTable
        groupedSessions={groupedSessions}
        columns={sessionColumns}
        onSessionSelect={onMovieSessionSelect}
      />
    </div>
  )
}
