import {useState} from 'react'
import {Seat} from '@types'

export const useSeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])

  const handleSeatClick = (rowNumber: number, seatNumber: number, isAuthenticated: boolean, isSeatBooked: (row: number, seat: number) => boolean) => {
    if (!isAuthenticated) return false

    if (isSeatBooked(rowNumber, seatNumber)) {
      return false
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
    return true
  }

  const isSeatSelected = (rowNumber: number, seatNumber: number): boolean => {
    return selectedSeats.some(seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber)
  }

  const clearSelection = () => setSelectedSeats([])

  return {selectedSeats, handleSeatClick, isSeatSelected, clearSelection}
}
