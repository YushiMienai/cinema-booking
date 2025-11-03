import {useNavigate} from 'react-router-dom'
import {authApi, getRoute} from '@services'
import {useAuthStore} from '@stores'
import {AuthRequest, Page, RegisterRequest} from '@types'

export const useAuthActions = () => {
  const navigate = useNavigate()
  const {login, logout} = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate(getRoute(Page.MOVIES))
  }

  const handleLogin = async (formData: AuthRequest) => {
    const response = await authApi.login(formData)
    login(response.token, response.username)
    navigate(getRoute(Page.MY_TICKETS))
  }

  const handleRegister = async (formData: RegisterRequest) => {
    const response = await authApi.register(formData)
    login(response.token, response.username)
    navigate(getRoute(Page.MY_TICKETS)) // ← переход после регистрации
  }

  return {handleLogin, handleLogout, handleRegister}
}
