import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Login} from '@pages'
import {describe, it, expect, vi, afterEach} from 'vitest'

// Константы
const TEST_IDS = {
  USER_NAME_INPUT: 'userNameInput',
  PASSWORD_INPUT: 'passwordInput'
} as const

const BUTTON_TEXTS = {
  LOGIN: 'Войти',
  REGISTER_LINK: 'зарегистрируйтесь'
} as const

const PAGE_TEXTS = {
  TITLE: 'Вход в аккаунт',
  ERROR_MESSAGE: 'Неверный логин или пароль. Проверьте введенные данные и попробуйте снова.',
  REGISTER_PROMPT: 'Если у вас нет аккаунта,'
} as const

const TEST_DATA = {
  USERNAME: 'testuser',
  PASSWORD: 'testpass',
  WRONG_USERNAME: 'wronguser',
  WRONG_PASSWORD: 'wrongpass'
} as const

// Мокаем хуки
vi.mock('@hooks', () => ({
  useAuthForm: vi.fn(() => ({
    formData: { username: '', password: '' },
    loading: false,
    error: '',
    handleChange: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn()
  })),
  useAuthActions: vi.fn(() => ({
    handleLogin: vi.fn()
  }))
}))

// Мокаем навигацию
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn())
}))

describe('Login', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    render(<Login />)

    expect(screen.getByText(PAGE_TEXTS.TITLE)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.USER_NAME_INPUT)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.PASSWORD_INPUT)).toBeInTheDocument()
    expect(screen.getByText(BUTTON_TEXTS.LOGIN)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(BUTTON_TEXTS.REGISTER_LINK, 'i'))).toBeInTheDocument()
    expect(screen.getByText(PAGE_TEXTS.REGISTER_PROMPT)).toBeInTheDocument()
  })

  it('should call handleLogin on form submit', async () => {
    const user = userEvent.setup()
    const { useAuthForm, useAuthActions } = await import('@hooks')

    const mockHandleLogin = vi.fn()
    const mockSetLoading = vi.fn()

    vi.mocked(useAuthActions).mockReturnValue({
      handleLogin: mockHandleLogin
    })

    vi.mocked(useAuthForm).mockReturnValue({
      formData: { username: TEST_DATA.USERNAME, password: TEST_DATA.PASSWORD },
      loading: false,
      error: '',
      handleChange: vi.fn(),
      setLoading: mockSetLoading,
      setError: vi.fn()
    })

    render(<Login />)

    await user.click(screen.getByText(BUTTON_TEXTS.LOGIN))

    expect(mockSetLoading).toHaveBeenCalledWith(true)
    expect(mockHandleLogin).toHaveBeenCalledWith({
      username: TEST_DATA.USERNAME,
      password: TEST_DATA.PASSWORD
    })
    expect(mockSetLoading).toHaveBeenCalledWith(false)
  })

  it('should show error message when handleLogin fails', async () => {
    const user = userEvent.setup()
    const { useAuthForm, useAuthActions } = await import('@hooks')

    const mockHandleLogin = vi.fn().mockRejectedValue(new Error('Login failed'))
    const mockSetError = vi.fn()

    vi.mocked(useAuthActions).mockReturnValue({
      handleLogin: mockHandleLogin
    })

    vi.mocked(useAuthForm).mockReturnValue({
      formData: { username: TEST_DATA.WRONG_USERNAME, password: TEST_DATA.WRONG_PASSWORD },
      loading: false,
      error: '',
      handleChange: vi.fn(),
      setLoading: vi.fn(),
      setError: mockSetError
    })

    render(<Login />)

    await user.click(screen.getByText(BUTTON_TEXTS.LOGIN))

    expect(mockSetError).toHaveBeenCalledWith(PAGE_TEXTS.ERROR_MESSAGE)
  })

  it('should navigate to register when link is clicked', async () => {
    const user = userEvent.setup()
    const mockNavigate = vi.fn()
    const { useNavigate } = await import('react-router-dom')

    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    render(<Login />)

    await user.click(screen.getByText(BUTTON_TEXTS.REGISTER_LINK))

    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })
})
