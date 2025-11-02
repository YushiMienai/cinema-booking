import {SessionsTable} from '@components'
import {groupSessionsByCinema} from '@helpers'
import {useMovieSessions} from '@hooks'
import {MovieHeader} from './movieHeader'

interface MovieSessionsProps {
  movieId: number
  onMovieSessionSelect: (movieSessionId: number) => void
}

export const MovieSessions = ({movieId, onMovieSessionSelect}: MovieSessionsProps) => {
  const {movie, sessions, cinemas, loading} = useMovieSessions(movieId)

  if (!movie) {
    return <div className='error'>Фильм не найден</div>
  }

  const groupedSessions = groupSessionsByCinema(sessions, cinemas)

  return (
    <div className='sessions-container'>
      <MovieHeader movie={movie} />
      <SessionsTable
        title='Кинотеатр'
        loading={loading}
        results={cinemas}
        groupedSessions={groupedSessions}
        onSessionSelect={onMovieSessionSelect}
      />
    </div>
  )
}
