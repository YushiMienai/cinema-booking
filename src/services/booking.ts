import {MovieSession} from '@types'

export const isSeatBooked = (movieSession: MovieSession | null, rowNumber: number, seatNumber: number): boolean => {
  if (!movieSession?.bookedSeats) return false

  return movieSession.bookedSeats.some(
    seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
  )
}

