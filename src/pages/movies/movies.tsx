import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {getRoute, moviesApi} from '@services'
import {Column, Movie, Page} from '@types'
import {Table} from '@components'
import {API_CONFIG} from '@config'

export const Movies = () => {
  const navigate = useNavigate()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await moviesApi.getMovies()
        setMovies(data)
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }

  const columns: Column<Movie>[] = [
    {
      key: 'poster',
      title: '',
      renderCellContent: ({row}: {row: Movie}) => (
        <img
          src={API_CONFIG.baseURL + row.posterImage}
          alt={row.title}
          className='movie-poster-small'
        />
      )
    },
    {
      key: 'title',
      title: 'Название',
      field: 'title'
    },
    {
      key: 'duration',
      title: 'Продолжительность',
      renderCellContent: ({row}: {row: Movie}) => formatDuration(row.lengthMinutes)
    },
    {
      key: 'rating',
      title: 'Рейтинг',
      field: 'rating'
    },
    {
      key: 'actions',
      title: '',
      renderCellContent: ({row}: {row: Movie}) => (
        <button
          onClick={() => navigate(getRoute(Page.MOVIE_SESSIONS, row.id))}
          className='view-sessions-btn'
        >
          Посмотреть сеансы
        </button>
      )
    }
  ]

  if (loading) {
    return <div className='loading'>Загрузка фильмов...</div>
  }

  return (
    <div className='movies-container'>
      <h2 className='movies-title'>Фильмы</h2>
      <Table<Movie>
        columns={columns}
        results={movies}
      />
    </div>
  )
}
