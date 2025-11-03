import {useParams} from 'react-router-dom'
import {SessionsTable} from '@components'
import {useCinemaSessions} from '@hooks'
import {Page} from '@types'
import {groupSessionsByMovie} from '@services'
import {CinemaHeader} from './cinemaHeader'

export const CinemaSessions = () => {
  const {cinemaId} = useParams<{cinemaId: string}>()
  const {cinema, sessions, movies, loading} = useCinemaSessions(Number(cinemaId))

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
        groupedSessions={groupedSessions}
        page={Page.CINEMA_SESSIONS}
      />
    </div>
  )
}
