import {Cinema} from '@types'

interface CinemaHeaderProps {
  cinema: Cinema
}

export const CinemaHeader = ({cinema}: CinemaHeaderProps) => (
  <div className="sessions-header">
    <div className="cinema-info">
      <h2 className="sessions-title">
        <span className="cinema-icon">🎬</span>
        Сеансы в {cinema.name}
      </h2>
      <p className="cinema-address">
        <span className="address-icon">📍</span>
        {cinema.address}
      </p>
    </div>
  </div>
)
