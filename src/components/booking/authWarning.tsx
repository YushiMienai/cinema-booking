import {useNavigate} from 'react-router-dom'

export const AuthWarning = () => {
  const navigate = useNavigate()

  return (
    <div className='auth-warning'>
      <p>Для бронирования мест необходимо авторизоваться</p>
      <button
        className='auth-button'
        onClick={() => navigate('/login')}
      >
        Войти / Зарегистрироваться
      </button>
    </div>
  )
}
