import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {cinemaApi, getRoute} from '@services'
import {Cinema, Column, Page} from '@types'
import {Table} from '@components'

export const Cinemas = () => {
  const navigate = useNavigate()
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const data = await cinemaApi.getCinemas()
        setCinemas(data)
      } catch (error) {
        console.error('Error fetching cinemas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCinemas()
  }, [])

  const columns: Column<Cinema>[] = [
    {
      key: 'name',
      title: 'Кинотеатр',
      field: 'name'
    },
    {
      key: 'address',
      title: 'Адрес',
      field: 'address'
    },
    {
      key: 'actions',
      renderCellContent: ({row}: {row: Cinema}) => (
        <button
          onClick={() => navigate(getRoute(Page.CINEMA_SESSIONS, row.id))}
          className='view-sessions-btn'
        >
          Посмотреть сеансы
        </button>
      )
    }
  ]

  if (loading) {
    return <div className='loading'>Загрузка кинотеатров...</div>
  }

  return (
    <div className='cinemas-container'>
      <h2 className='cinemas-title'>Кинотеатры</h2>
      <Table<Cinema>
        columns={columns}
        results={cinemas}
      />
    </div>
  )
}
