import {useEffect, useState} from 'react'
import {Cinema, Movie, Session} from '@types'
import {cinemaApi, moviesApi} from '@services'

interface SessionData<T, R> {
  entity: T | null
  sessions: Session[]
  relatedEntities: R[]
  loading: boolean
}

export const useSessions = <T, R>(
  entityId: number,
  config: {
    fetchEntities: () => Promise<T[]>
    fetchSessions: (id: number) => Promise<Session[]>
    fetchRelated: () => Promise<R[]>
    findEntity: (entities: T[], id: number) => T | undefined
  }
): SessionData<T, R> => {
  const [entity, setEntity] = useState<T | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [relatedEntities, setRelatedEntities] = useState<R[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entitiesData, sessionsData, relatedData] = await Promise.all([
          config.fetchEntities(),
          config.fetchSessions(entityId),
          config.fetchRelated()
        ])

        const foundEntity = config.findEntity(entitiesData, entityId)
        setEntity(foundEntity || null)
        setSessions(sessionsData)
        setRelatedEntities(relatedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [entityId, config])

  return {entity, sessions, relatedEntities, loading}
}

export const useCinemaSessions = (cinemaId: number) => {
  const {entity: cinema, sessions, relatedEntities: movies, loading} =
    useSessions<Cinema, Movie>(cinemaId, {
      fetchEntities: cinemaApi.getCinemas,
      fetchSessions: cinemaApi.getCinemaSessions,
      fetchRelated: moviesApi.getMovies,
      findEntity: (cinemas: Cinema[], id) => cinemas.find(cinema => cinema.id === id)
    })

  return {cinema, sessions, movies, loading}
}

export const useMovieSessions = (movieId: number) => {
  const {entity: movie, sessions, relatedEntities: cinemas, loading} =
    useSessions<Movie, Cinema>(movieId, {
      fetchEntities: moviesApi.getMovies,
      fetchSessions: moviesApi.getMovieSessions,
      fetchRelated: cinemaApi.getCinemas,
      findEntity: (movies: Movie[], id) => movies.find(m => m.id === id)
    })

  return {movie, sessions, cinemas, loading}
}
