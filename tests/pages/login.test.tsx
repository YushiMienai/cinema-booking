import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Login} from '@pages'
import {describe, it, expect, vi, afterEach} from 'vitest'


vi.mock('@stores', () => {
  const mockStoreLogin = vi.fn()
  const mockUseAuthStore = vi.fn((selector) => {
    const state = {
      login: mockStoreLogin,
    }
    return selector ? selector(state) : state
  })

  return {
    useAuthStore: mockUseAuthStore
  }
})

vi.mock('@services', () => ({
  authApi: {
    login: vi.fn()
  }
}))

describe('Login', () => {
  const userNameInput = 'userNameInput'
  const passwordInput = 'passwordInput'

  const mockOnSwitchToRegister = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should call login successfully with correct credentials', async () => {
    const user = userEvent.setup()
    const {authApi} = await import('@services')
    const {useAuthStore} = await import('@stores')

    const token = 'fake-token'
    const username = 'TestUser'
    const password = 'password123'

    const storeInstance = useAuthStore((state) => state)
    vi.mocked(authApi.login).mockResolvedValueOnce({token, username})

    render(<Login onSwitchToRegister={mockOnSwitchToRegister} />)

    // Заполняем форму по атрибуту name
    await user.type(screen.getByTestId(userNameInput), username)
    await user.type(screen.getByTestId(passwordInput), password)
    await user.click(screen.getByText('Войти'))

    // Проверяем успешный вызов
    expect(authApi.login).toHaveBeenLastCalledWith({username, password})
    expect(storeInstance.login).toHaveBeenCalledWith(token, username)
  })

  it('should show error message on 401 failure', async () => {
    const user = userEvent.setup()
    const {authApi} = await import('@services')

    vi.mocked(authApi.login).mockRejectedValueOnce({
      message: 'Неверное имя пользователя или пароль'
    })

    render(<Login onSwitchToRegister={mockOnSwitchToRegister} />)

    // Заполняем и отправляем форму по атрибуту name
    await user.type(screen.getByTestId(userNameInput), 'wronguser')
    await user.type(screen.getByTestId(passwordInput), 'wrongpass')
    await user.click(screen.getByText('Войти'))

    // Проверяем сообщение об ошибке
    expect(await screen.findByText(/неверный логин или пароль/i)).toBeInTheDocument()
  })
})
