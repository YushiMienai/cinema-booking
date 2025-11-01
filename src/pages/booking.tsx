import {useState, useEffect} from 'react'
import {cinemaApi, moviesApi, movieSessionsApi} from '@services'
import {MovieSession, Movie, Cinema, Seat, Page} from '@types'
import {useAuthStore} from '@stores'

interface BookingProps {
  movieSessionId: number
  onPageChange: (page: Page) => void
}

export const Booking = ({movieSessionId, onPageChange}: BookingProps) => {
  const [movieSession, setMovieSession] = useState<MovieSession | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [cinema, setCinema] = useState<Cinema | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [bookingLoading, setBookingLoading] = useState<boolean>(false)
  const {isAuthenticated} = useAuthStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionData, moviesData, cinemasData]: [MovieSession, Movie[], Cinema[]] = await Promise.all([
          movieSessionsApi.getMovieSession(movieSessionId),
          moviesApi.getMovies(),
          cinemaApi.getCinemas()
        ])

        const movieData = moviesData.find(movie => movie.id === sessionData.movieId)
        const cinemaData = cinemasData.find(cinema => cinema.id === sessionData.cinemaId)

        setMovieSession(sessionData)
        setMovie(movieData || null)
        setCinema(cinemaData || null)
      } catch (error) {
        console.error('Error fetching movie session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieSessionId])

  const handleSeatClick = (rowNumber: number, seatNumber: number) => {
    if (!isAuthenticated) {
      onPageChange(Page.LOGIN)
      return
    }

    // Проверяем, не забронировано ли место
    if (isSeatBooked(rowNumber, seatNumber)) {
      return
    }

    const seat = {rowNumber, seatNumber}
    const isSelected = selectedSeats.some(
      s => s.rowNumber === rowNumber && s.seatNumber === seatNumber
    )

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(
        s => !(s.rowNumber === rowNumber && s.seatNumber === seatNumber)
      ))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const isSeatBooked = (rowNumber: number, seatNumber: number): boolean => {
    if (!movieSession?.bookedSeats) return false

    return movieSession.bookedSeats.some(
      seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
    )
  }

  const isSeatSelected = (rowNumber: number, seatNumber: number): boolean => {
    return selectedSeats.some(seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber)
  }

  const handleBookTickets = async () => {
    if (!isAuthenticated || selectedSeats.length === 0) return

    setBookingLoading(true)
    try {
      await movieSessionsApi.bookSeats(movieSessionId, selectedSeats)
      setSelectedSeats([])

      // Обновляем данные сеанса после бронирования
      const updatedSession = await movieSessionsApi.getMovieSession(movieSessionId)
      setMovieSession(updatedSession)

      onPageChange(Page.MY_TICKETS)
    } catch (error) {
      console.error('Error booking tickets:', error)
      alert('Ошибка при бронировании билетов')
    } finally {
      setBookingLoading(false)
    }
  }

  const renderSeats = () => {
    if (!movieSession?.seats) {
      console.log('No seats data available')
      return null
    }

    const {rows, seatsPerRow} = movieSession.seats
    const seats = []

    for (let row = 1; row <= rows; row++) {
      const rowSeats = []
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const isBooked = isSeatBooked(row, seat)
        const isSelected = isSeatSelected(row, seat)

        let seatClass = 'seat '
        if (isBooked) {
          seatClass += 'booked'
        } else if (isSelected) {
          seatClass += 'selected'
        } else if (isAuthenticated) {
          seatClass += 'available'
        } else {
          seatClass += 'disabled'
        }

        rowSeats.push(
          <div
            key={`${row}-${seat}`}
            className={seatClass}
            onClick={() => handleSeatClick(row, seat)}
            title={isBooked ? 'Занято' : isSelected ? 'Выбрано' : 'Свободно'}
          >
            {seat}
          </div>
        )
      }
      seats.push(
        <div key={row} className='seat-row'>
          <div className='row-number'>{row}</div>
          {rowSeats}
        </div>
      )
    }

    return seats
  }

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className='loading'>Загрузка информации о сеансе...</div>
  }

  if (!movieSession) {
    return <div className='error'>Сеанс не найден</div>
  }

  return (
    <div className='booking-container'>
      <h2 className='booking-title'>Бронирование мест</h2>

      <div className='session-info'>
        <h3>{movie?.title || 'Название фильма'}</h3>
        <p className='cinema-name'>{cinema?.name || 'Кинотеатр'}</p>
        <p className='session-time'>{formatDateTime(movieSession.startTime)}</p>
      </div>

      <div className='seats-container'>
        <div className='screen'>ЭКРАН</div>

        <div className='seats-grid'>
          {renderSeats()}
        </div>

        <div className='seats-legend'>
          <div className='legend-item'>
            <div className='seat-legend available'></div>
            <span>Свободно</span>
          </div>
          <div className='legend-item'>
            <div className='seat-legend selected'></div>
            <span>Выбрано</span>
          </div>
          <div className='legend-item'>
            <div className='seat-legend booked'></div>
            <span>Занято</span>
          </div>
          {!isAuthenticated && (
            <div className='legend-item'>
              <div className='seat-legend disabled'></div>
              <span>Требуется авторизация</span>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated ? (
        <div className='booking-actions'>
          <div className='selected-seats-info'>
            Выбрано мест: {selectedSeats.length}
            {selectedSeats.length > 0 && (
              <div className='seats-list'>
                {selectedSeats.map((seat, index) => (
                  <span key={index} className='seat-badge'>
                    Ряд {seat.rowNumber}, Место {seat.seatNumber}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            className='book-button'
            onClick={handleBookTickets}
            disabled={selectedSeats.length === 0 || bookingLoading}
          >
            {bookingLoading ? 'Бронирование...' : 'Забронировать'}
          </button>
        </div>
      ) : (
        <div className='auth-warning'>
          <p>Для бронирования мест необходимо авторизоваться</p>
          <button
            className='auth-button'
            onClick={() => onPageChange(Page.LOGIN)}
          >
            Войти / Зарегистрироваться
          </button>
        </div>
      )}
    </div>
  )
}
