import {useState, useEffect} from 'react'
import {cinemaApi} from '@services'
import {Cinema, Column, Page} from '@types'
import {Table} from '@components'

interface CinemasProps {
  onPageChange: (page: Page) => void
  onCinemaSelect: (cinemaId: number) => void
}

export const Cinemas = ({onPageChange, onCinemaSelect}: CinemasProps) => {
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

  const handleViewSessions = (cinemaId: number) => {
    onCinemaSelect(cinemaId)
    onPageChange(Page.SESSIONS)
  }

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
          onClick={() => handleViewSessions(row.id)}
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
