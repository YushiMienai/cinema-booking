import {Seat} from '@types'

interface BookingActionsProps {
  selectedSeats: Seat[]
  bookingLoading: boolean
  onBook: () => void
}

export const BookingActions = ({ selectedSeats, bookingLoading, onBook }: BookingActionsProps) => (
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
      onClick={onBook}
      disabled={selectedSeats.length === 0 || bookingLoading}
    >
      {bookingLoading ? 'Бронирование...' : 'Забронировать'}
    </button>
  </div>
)
