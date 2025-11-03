import {MovieSession, Seat} from '@types'

interface SeatsGridProps {
  movieSession: MovieSession
  selectedSeats: Seat[]
  isAuthenticated: boolean
  onSeatClick: (rowNumber: number, seatNumber: number) => void
  isSeatSelected: (rowNumber: number, seatNumber: number) => boolean
  isSeatBooked: (rowNumber: number, seatNumber: number) => boolean
}

export const SeatsGrid = ({movieSession, isAuthenticated, onSeatClick, isSeatSelected, isSeatBooked}: SeatsGridProps) => {
  const { rows, seatsPerRow } = movieSession.seats
  const seats = []

  for (let row = 1; row <= rows; row++) {
    const rowSeats = []
    for (let seat = 1; seat <= seatsPerRow; seat++) {
      const isBooked = isSeatBooked(row, seat)
      const isSelected = isSeatSelected(row, seat)

      let seatClass = 'seat '
      if (isBooked) seatClass += 'booked'
      else if (isSelected) seatClass += 'selected'
      else if (isAuthenticated) seatClass += 'available'
      else seatClass += 'disabled'

      rowSeats.push(
        <div
          key={`${row}-${seat}`}
          className={seatClass}
          onClick={() => onSeatClick(row, seat)}
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

  return (
    <div className='seats-container'>
      <div className='screen'>ЭКРАН</div>
      <div className='seats-grid'>{seats}</div>
      <SeatsLegend isAuthenticated={isAuthenticated} />
    </div>
  )
}

const SeatsLegend = ({isAuthenticated}: {isAuthenticated: boolean}) => (
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
)
