import {Page} from '@types'

export const routes = {
  movies: '/movies',
  movieSessions: '/sessions/movie',
  cinemas: '/cinemas',
  cinemaSessions: '/sessions/cinema',
  myTickets: '/my-tickets',
  login: '/login',
  register: '/register',
  booking: '/booking'
} as const

export const pageToRouteMap = {
  [Page.MOVIES]: routes.movies,
  [Page.MOVIE_SESSIONS]: (id) => `${routes.movieSessions}/${id}`,
  [Page.CINEMAS]: routes.cinemas,
  [Page.CINEMA_SESSIONS]: (id) => `${routes.cinemaSessions}/${id}`,
  [Page.MY_TICKETS]: routes.myTickets,
  [Page.LOGIN]: routes.login,
  [Page.REGISTER]: routes.register,
  [Page.BOOKING]: (id) => `${routes.booking}/${id}`,
} as const

export const getRoute = (page: Page, id?: number): string => {
  const route = pageToRouteMap[page]
  return typeof route === 'function' ? route(id) : route
}


export const getPageFromPath = (path: string): Page => {
  if (path === routes.movies || path.startsWith(routes.movieSessions) || path === '/') return Page.MOVIES
  if (path === routes.cinemas || path.startsWith(routes.cinemaSessions)) return Page.CINEMAS
  if (path === routes.myTickets) return Page.MY_TICKETS
  if (path === routes.login) return Page.LOGIN
  if (path === routes.register) return Page.REGISTER
  if (path.startsWith(routes.booking)) return Page.BOOKING
  return Page.MOVIES
}
