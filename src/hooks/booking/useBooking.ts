import {useState} from 'react'
import {movieSessionsApi} from '@services'
import {Seat} from '@types'

export const useBooking = () => {
  const [bookingLoading, setBookingLoading] = useState(false)

  const bookSeats = async (movieSessionId: number, selectedSeats: Seat[]) => {
    if (selectedSeats.length === 0) return null

    setBookingLoading(true)
    try {
      await movieSessionsApi.bookSeats(movieSessionId, selectedSeats)
      return await movieSessionsApi.getMovieSession(movieSessionId)
    } catch (error) {
      console.error('Error booking tickets:', error)
      throw error
    } finally {
      setBookingLoading(false)
    }
  }

  return {bookingLoading, bookSeats}
}
