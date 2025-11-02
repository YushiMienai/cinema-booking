import {formatDuration} from '@helpers'
import {API_CONFIG} from '@config'

export const MovieHeader = ({movie}) => {

  return (
    <div className='movie-info'>
      <h2 className='movie-title'>{movie.title}</h2>
      <div className='movie-details'>
        <img
          src={API_CONFIG.baseURL + movie.posterImage}
          alt={movie.title}
          className='movie-poster-large'
        />
        <div className='movie-info-text'>
          <p className='movie-description'>{movie.description}</p>
          <div className='movie-meta'>
            <span><strong>Год:</strong> {movie.year}</span>
            <span><strong>Продолжительность:</strong> {formatDuration(movie.lengthMinutes)}</span>
            <span><strong>Рейтинг:</strong> {movie.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
