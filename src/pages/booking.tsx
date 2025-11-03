import {useNavigate, useParams} from 'react-router-dom'
import {useAuthStore, useToastStore} from '@stores'
import {useBooking, useBookingData, useSeatSelection} from '@hooks'
import {getRoute, isSeatBooked} from '@services'
import {formatDateTime} from '@helpers'
import {AuthWarning, BookingActions, SeatsGrid} from '@components'
import {Page} from '@types'

export const Booking = () => {
  const {sessionId} = useParams<{sessionId: string}>()
  const navigate = useNavigate()
  const {isAuthenticated} = useAuthStore()
  const {showToast} = useToastStore()

  const movieSessionId = Number(sessionId)
  const {movieSession, movie, cinema, loading} = useBookingData(movieSessionId)
  const {selectedSeats, handleSeatClick, isSeatSelected, clearSelection} = useSeatSelection()
  const {bookingLoading, bookSeats} = useBooking()

  const handleSeatSelection = (rowNumber: number, seatNumber: number) => {
    const success = handleSeatClick(
      rowNumber,
      seatNumber,
      isAuthenticated,
      (row, seat) => isSeatBooked(movieSession, row, seat)
    )

    if (!success && !isAuthenticated) {
      navigate(getRoute(Page.LOGIN))
    }
  }

  const handleBooking = async () => {
    if (!isAuthenticated || selectedSeats.length === 0) return

    try {
      const updatedSession = await bookSeats(movieSessionId, selectedSeats)
      if (updatedSession) {
        clearSelection()
        navigate(getRoute(Page.MY_TICKETS))
        showToast('Билеты успешно забронированы!', 'success')
      }
    } catch (error) {
      showToast(`Ошибка при бронировании билетов. Попробуйте еще раз. ${error}`, 'error')
    }
  }

  if (loading) return <div className='loading'>Загрузка информации о сеансе...</div>
  if (!movieSession) return <div className='error'>Сеанс не найден</div>

  return (
    <div className='booking-container'>
      <h2 className='booking-title'>Бронирование мест</h2>

      <div className='session-info'>
        <h3>{movie?.title || 'Название фильма'}</h3>
        <p className='cinema-name'>{cinema?.name || 'Кинотеатр'}</p>
        <p className='session-time'>{formatDateTime(movieSession.startTime)}</p>
      </div>

      <SeatsGrid
        movieSession={movieSession}
        selectedSeats={selectedSeats}
        isAuthenticated={isAuthenticated}
        onSeatClick={handleSeatSelection}
        isSeatSelected={isSeatSelected}
        isSeatBooked={(row, seat) => isSeatBooked(movieSession, row, seat)}
      />

      {isAuthenticated ? (
        <BookingActions
          selectedSeats={selectedSeats}
          bookingLoading={bookingLoading}
          onBook={handleBooking}
        />
      ) : (
        <AuthWarning />
      )}
    </div>
  )
}
