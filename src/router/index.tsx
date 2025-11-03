import {createBrowserRouter} from 'react-router-dom'
import {
  Booking,
  Cinemas,
  CinemaSessions,
  Login,
  Movies,
  MovieSessions,
  MyTickets,
  Register
} from '@pages'
import App from '../App'
import {ProtectedRoute} from './protectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {path: 'movies', element: <Movies />},
      {path: 'cinemas', element: <Cinemas />},
      {path: 'login', element: <Login />},
      {path: 'register', element: <Register />},
      {
        path: 'sessions',
        children: [
          {path: 'cinema/:cinemaId', element: <CinemaSessions />},
          {path: 'movie/:movieId', element: <MovieSessions />}
        ]
      },
      {path: 'booking/:sessionId', element: <Booking />},
      {
        path: 'my-tickets',
        element:
          <ProtectedRoute>
            <MyTickets />
          </ProtectedRoute>
      }
    ]
  }
])
