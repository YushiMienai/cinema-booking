export const getMovieTitle = (movieId: number, movies): string => {
  const movie = movies.find(movie => movie.id === movieId)
  return movie?.title || 'Неизвестный фильм'
}

export const getCinemaName = (cinemaId: number, cinemas): string => {
  const cinema = cinemas.find(cinema => cinema.id === cinemaId)
  return cinema?.name || 'Неизвестный кинотеатр'
}
