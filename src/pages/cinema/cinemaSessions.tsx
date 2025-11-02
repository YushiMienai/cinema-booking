import {SessionsTable} from '@components'
import {useCinemaSessions} from '@hooks'
import {groupSessionsByMovie} from '@helpers'
import {CinemaHeader} from './cinemaHeader'

interface CinemaSessionsProps {
  cinemaId: number
  onMovieSessionSelect: (movieSessionId: number) => void
}

export const CinemaSessions = ({cinemaId, onMovieSessionSelect}: CinemaSessionsProps) => {
  const {cinema, sessions, movies, loading} = useCinemaSessions(cinemaId)

  const groupedSessions = groupSessionsByMovie(sessions, movies)

  if (!cinema) {
    return <div className='error'>Кинотеатр не найден</div>
  }

  return (
    <div className='sessions-container'>
      <CinemaHeader cinema={cinema} />
      <SessionsTable
        title='Фильм'
        loading={loading}
        results={movies}
        groupedSessions={groupedSessions}
        onSessionSelect={onMovieSessionSelect}
      />
    </div>
  )
}
