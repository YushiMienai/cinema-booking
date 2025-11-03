import {useState, useEffect, useCallback} from 'react'
import {bookingsApi, movieSessionsApi, moviesApi, cinemaApi, settingsApi} from '@services'
import {BookingWithDetails, TicketCategory, Seat, Booking, Movie, Cinema} from '@types'
import {useAuthStore} from '@stores'
import {Table} from '@components'

const TicketCategoryTitles = {
  [TicketCategory.UNPAID]: 'Неоплаченные',
  [TicketCategory.UPCOMING]: 'Будущие',
  [TicketCategory.PAST]: 'Прошедшие'
} as const

export const MyTickets = () => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [paymentTimeout, setPaymentTimeout] = useState<number>(300) // 5 минут по умолчанию
  const [loading, setLoading] = useState<boolean>(true)
  const [payingIds, setPayingIds] = useState<Set<string>>(new Set())
  const {isAuthenticated} = useAuthStore()


  useEffect(() => {
    if (!isAuthenticated) return

    const fetchData = async () => {
      try {
        const [
          settingsData,
          bookingsData,
          moviesData,
          cinemasData
        ]: [{bookingPaymentTimeSeconds: number}, Booking[], Movie[], Cinema[]] = await Promise.all([
          settingsApi.getSettings(),
          bookingsApi.getMyBookings(),
          moviesApi.getMovies(),
          cinemaApi.getCinemas()
        ])

        setPaymentTimeout(settingsData.bookingPaymentTimeSeconds)

        const bookingsWithDetails = await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const session = await movieSessionsApi.getMovieSession(booking.movieSessionId)
              const movie = moviesData.find(movie => movie.id === session.movieId)
              const cinema = cinemasData.find(cinema => cinema.id === session.cinemaId)

              return {
                ...booking,
                startTime: session.startTime,
                movieTitle: movie?.title,
                cinemaName: cinema?.name
              }
            } catch (error) {
              console.error('Error fetching session details:', error)
              return booking
            }
          })
        )

        setBookings(bookingsWithDetails)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  const calculateTimeLeft = useCallback((bookedAt: string, timeout: number): number => {
    const bookedTime = new Date(bookedAt).getTime()
    const currentTime = new Date().getTime()
    const elapsedSeconds = Math.floor((currentTime - bookedTime) / 1000)
    return Math.max(0, timeout - elapsedSeconds)
  }, [])

  // Таймер для проверки истекшего времени оплаты
  useEffect(() => {
    if (!bookings.length) return

    const interval = setInterval(() => {
      setBookings(prevBookings =>
        prevBookings.filter(booking =>
          booking.isPaid || calculateTimeLeft(booking.bookedAt, paymentTimeout) > 0
        )
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [bookings.length, paymentTimeout, calculateTimeLeft])

  const formatTimeLeft = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handlePayBooking = async (bookingId: string) => {
    setPayingIds(prev => new Set(prev).add(bookingId))

    try {
      await bookingsApi.payBooking(bookingId)

      // Обновляем статус билета
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? {...booking, isPaid: true}: booking
        )
      )
    } catch (error) {
      console.error('Error paying booking:', error)
      alert('Ошибка при оплате билета')
    } finally {
      setPayingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(bookingId)
        return newSet
      })
    }
  }

  const categorizeBookings = (bookings: BookingWithDetails[]) => {
    const now = new Date()

    return {
      [TicketCategory.UNPAID]: bookings.filter(booking =>
        !booking.isPaid && calculateTimeLeft(booking.bookedAt, paymentTimeout) > 0
      ),
      [TicketCategory.UPCOMING]: bookings.filter(booking =>
        booking.isPaid && booking.startTime && new Date(booking.startTime) > now
      ),
      [TicketCategory.PAST]: bookings.filter(booking =>
        booking.isPaid && booking.startTime && new Date(booking.startTime) <= now
      )
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  }

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})
  }

  const formatSeats = (seats: Seat[]): string => {
    const seatsByRow: {[key: number]: number[]} = {}

    seats.forEach(seat => {
      if (!seatsByRow[seat.rowNumber]) {
        seatsByRow[seat.rowNumber] = []
      }
      seatsByRow[seat.rowNumber].push(seat.seatNumber)
    })

    return Object.entries(seatsByRow)
      .map(([row, seatNumbers]) => {
        const sortedSeats = seatNumbers.sort((a, b) => a - b)
        const ranges: string[] = []
        let start = sortedSeats[0]
        let end = sortedSeats[0]

        for (let i = 1; i < sortedSeats.length; i++) {
          if (sortedSeats[i] === end + 1) {
            end = sortedSeats[i]
          } else {
            ranges.push(start === end ? `${start}` : `${start}-${end}`)
            start = sortedSeats[i]
            end = sortedSeats[i]
          }
        }
        ranges.push(start === end ? `${start}` : `${start}-${end}`)

        return `Ряд ${row}: ${ranges.join(', ')}`
      })
      .join('; ')
  }

  const bookingColumns = [
    {
      key: 'movie',
      title: 'Фильм',
      field: 'movieTitle'
    },
    {
      key: 'cinema',
      title: 'Кинотеатр',
      field: 'cinemaName'
    },
    {
      key: 'time',
      title: 'Дата и время',
      renderCellContent: ({row}: {row: BookingWithDetails}) =>
        row.startTime ? `${formatDate(row.startTime)} ${formatTime(row.startTime)}` : 'Неизвестно'
    },
    {
      key: 'seats',
      title: 'Места',
      renderCellContent: ({row}: {row: BookingWithDetails}) => (
        <div className='seats-display'>
          {formatSeats(row.seats)}
        </div>
      )
    },
    {
      key: 'bookedAt',
      title: 'Забронировано',
      renderCellContent: ({row}: {row: BookingWithDetails}) => formatDate(row.bookedAt)
    },
    {
      key: 'actions',
      title: '',
      renderCellContent: ({row}: {row: BookingWithDetails}) => {
        if (row.isPaid) return null

        const timeLeft = calculateTimeLeft(row.bookedAt, paymentTimeout)
        if (timeLeft <= 0) return <span className='expired'>Время истекло</span>

        return (
          <div className='payment-actions'>
            <div className='time-left'>Осталось: {formatTimeLeft(timeLeft)}</div>
            <button
              className='pay-button'
              onClick={() => handlePayBooking(row.id)}
              disabled={payingIds.has(row.id)}
            >
              {payingIds.has(row.id) ? 'Оплата...' : 'Оплатить'}
            </button>
          </div>
        )
      }
    }
  ]

  const categorizedBookings = categorizeBookings(bookings)

  if (!isAuthenticated) {
    return <div className='loading'>Перенаправление на страницу авторизации...</div>
  }

  if (loading) {
    return <div className='loading'>Загрузка билетов...</div>
  }

  return (
    <div className='my-tickets-container'>
      <h2 className='my-tickets-title'>Мои Билеты</h2>

      <div className='tickets-categories'>
        {Object.values(TicketCategory).map(category => (
          <div key={category} className='ticket-category'>
            <h3 className={`category-title ${category}`}>
              {TicketCategoryTitles[category]} ({categorizedBookings[category].length})
            </h3>
            {categorizedBookings[category].length > 0 ? (
              <Table columns={bookingColumns} results={categorizedBookings[category]} />
            ) : (
              <div className='no-tickets'>Нет билетов</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
