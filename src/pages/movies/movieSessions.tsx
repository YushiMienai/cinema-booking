import {useParams} from 'react-router-dom'
import {SessionsTable} from '@components'
import {groupSessionsByCinema} from '@services'
import {useMovieSessions} from '@hooks'
import {Page} from '@types'
import {MovieHeader} from './movieHeader'

export const MovieSessions = () => {
  const {movieId} = useParams<{movieId: string}>()
  const {movie, sessions, cinemas, loading} = useMovieSessions(Number(movieId))

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
        groupedSessions={groupedSessions}
        page={Page.MOVIE_SESSIONS}
      />
    </div>
  )
}
