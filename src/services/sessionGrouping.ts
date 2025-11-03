import {Session, GroupedSession, Movie, Cinema} from '@types'
import {formatTime} from '@helpers'

interface GroupingConfig<T> {
  getId: (session: Session) => number
  getTitle: (id: number, entities: T[]) => string
  entities: T[]
}

const groupSessions = <T>(
  sessions: Session[],
  config: GroupingConfig<T>
): {[key: string]: GroupedSession[]} => {
  const grouped: {[key: string]: GroupedSession[]} = {}

  sessions.forEach(session => {
    const date = new Date(session.startTime).toLocaleDateString('ru-RU')
    const entityId = config.getId(session)
    const entityTitle = config.getTitle(entityId, config.entities)
    const time = formatTime(session.startTime)

    if (!grouped[date]) {
      grouped[date] = []
    }

    const existingEntity = grouped[date].find(item => item.entityId === entityId)

    if (existingEntity) {
      existingEntity.times.push({time, sessionId: session.id})
    } else {
      grouped[date].push({
        id: entityId,
        entityId: entityId,
        entityTitle: entityTitle,
        times: [{time, sessionId: session.id}]
      })
    }
  })

  return grouped
}

export const groupSessionsByMovie = (sessions: Session[], movies: Movie[]) => {
  return groupSessions<Movie>(sessions, {
    getId: (session) => session.movieId,
    getTitle: (movieId, movies) =>
      movies.find((movie) => movie.id === movieId)?.title || 'Неизвестный фильм',
    entities: movies
  })
}

export const groupSessionsByCinema = (sessions: Session[], cinemas: Cinema[]) => {
  return groupSessions<Cinema>(sessions, {
    getId: (session) => session.cinemaId,
    getTitle: (cinemaId, cinemas) =>
      cinemas.find((cinema) => cinema.id === cinemaId)?.name || 'Неизвестный кинотеатр',
    entities: cinemas
  })
}
