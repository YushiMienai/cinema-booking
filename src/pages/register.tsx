import {ChangeEvent, FormEvent, useState} from 'react'
import {authApi} from '@services'
import {useAuthStore} from '@stores'
import {Form} from '@components'
import {RegisterRequest} from '@types'

interface RegisterProps {
  onSwitchToLogin: () => void
}

interface ValidationErrors {
  username?: string
  password?: string
  confirmPassword?: string
}

export const Register = ({onSwitchToLogin}: RegisterProps) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [apiError, setApiError] = useState<string>('')
  const login = useAuthStore((state) => state.login)

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Валидация username
    if (formData.username.length < 8) {
      newErrors.username = 'Имя пользователя должно содержать минимум 8 символов'
    }

    // Валидация password
    if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов'
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать минимум 1 заглавную букву'
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать минимум 1 цифру'
    }

    // Валидация confirmPassword
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Очищаем ошибку при вводе
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
    // Очищаем API ошибку при изменении username
    if (name === 'username' && apiError) {
      setApiError('')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await authApi.register(formData)
      login(response.token, response.username)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации'
      setApiError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      title='Регистрация'
      error={apiError}
      onSubmit={handleSubmit}
    >
      <Form.Group>
        <Form.Input
          required
          name='username'
          value={formData.username}
          onChange={handleChange}
          loading={loading}
          error={errors.username}
        />
      </Form.Group>
      <Form.Group>
        <Form.Password
          required
          value={formData.password}
          onChange={handleChange}
          loading={loading}
          error={errors.password}
        />
      </Form.Group>
      <Form.Group>
        <Form.Password
          required
          name='confirmPassword'
          value={formData.confirmPassword}
          onChange={handleChange}
          loading={loading}
          error={errors.confirmPassword}
        />
      </Form.Group>
      <Form.Submit
        title='Зарегистрироваться'
        loading={loading}
      />
      <p className='auth-switch'>
        Если у вас есть аккаунт,{' '}
        <span className='auth-link' onClick={onSwitchToLogin}>
          войдите
        </span>
      </p>
    </Form>
  )
}
