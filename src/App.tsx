import {useEffect, useRef, useState} from 'react'
import {Layout} from '@components'
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
import {Page} from '@types'
import {useAuthStore} from '@stores'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN)
  const [selectedCinemaId, setSelectedCinemaId] = useState<number>()
  const [selectedMovieId, setSelectedMovieId] = useState<number>()
  const [selectedMovieSessionId, setSelectedMovieSessionId] = useState<number>()
  const {isAuthenticated, logout, loginTime} = useAuthStore()

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !loginTime) return

    const handleAutoLogout = () => {
      logout()
      setCurrentPage(Page.LOGIN)
    }

    const timePassed = Date.now() - loginTime
    const timeLeft = 60 * 60 * 1000 - timePassed

    if (timeLeft <= 0) {
      handleAutoLogout()
      return
    }

    timeoutRef.current = setTimeout(handleAutoLogout, timeLeft)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isAuthenticated, loginTime, logout, setCurrentPage])

  useEffect(() => {
    if (isAuthenticated && (currentPage === Page.LOGIN || currentPage === Page.REGISTER)) {
      setCurrentPage(Page.MY_TICKETS)
    }
  }, [isAuthenticated, currentPage])

  const handlePageChange = (page: Page) => {
    if (page === Page.LOGOUT) {
      logout()
      setCurrentPage(Page.MOVIES)
    } else {
      setCurrentPage(page)
    }
  }

  const handleCinemaSelect = (cinemaId: number) => {
    setSelectedCinemaId(cinemaId)
    setSelectedMovieId(undefined)
  }

  const handleMovieSelect = (movieId: number) => {
    setSelectedMovieId(movieId)
    setSelectedCinemaId(undefined)
  }

  const handleMovieSessionSelect = (movieSessionId: number) => {
    setSelectedMovieSessionId(movieSessionId)
    setCurrentPage(Page.BOOKING)
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.MOVIES:
        return (
          <Movies
            onPageChange={handlePageChange}
            onMovieSelect={handleMovieSelect}
          />
        )
      case Page.CINEMAS:
        return (
          <Cinemas
            onPageChange={handlePageChange}
            onCinemaSelect={handleCinemaSelect}
          />
        )
      case Page.MY_TICKETS:
        return <MyTickets onPageChange={handlePageChange} />
      case Page.LOGIN:
        return <Login onSwitchToRegister={() => setCurrentPage(Page.REGISTER)} />
      case Page.REGISTER:
        return <Register onSwitchToLogin={() => setCurrentPage(Page.LOGIN)} />
      case Page.SESSIONS:
        if (selectedCinemaId) {
          return (
            <CinemaSessions
              cinemaId={selectedCinemaId}
              onMovieSessionSelect={handleMovieSessionSelect}
            />
          )
        } else if (selectedMovieId) {
          return (
            <MovieSessions
              movieId={selectedMovieId}
              onMovieSessionSelect={handleMovieSessionSelect}
            />
          )
        } else {
          return <div className='error'>Ошибка: не выбран кинотеатр или фильм</div>
        }
      case Page.BOOKING:
        return (
          <Booking
            movieSessionId={selectedMovieSessionId!}
            onPageChange={handlePageChange}
          />
        )
      default:
        return <Movies onPageChange={handlePageChange} onMovieSelect={handleMovieSelect} />
    }
  }

  return (
    <div className='app'>
      <Layout
        currentPage={currentPage}
        onPageChange={handlePageChange}
      >
        {renderPage()}
      </Layout>
    </div>
  )
}

export default App
