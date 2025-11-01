import {ChangeEvent, FormEvent, useState} from 'react'
import {authApi} from '@services'
import {useAuthStore} from '@stores'
import {Form} from '@components'
import type {AuthRequest} from '@types'

interface LoginProps {
  onSwitchToRegister: () => void
}

export const Login = ({onSwitchToRegister}: LoginProps) => {
  const [formData, setFormData] = useState<AuthRequest>({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const login = useAuthStore((state) => state.login)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authApi.login(formData)
      login(response.token, response.username)
    } catch (err) {
      console.log(err)
      setError('Неверный логин или пароль. Проверьте введенные данные и попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      title='Вход в аккаунт'
      error={error}
      onSubmit={handleSubmit}
    >
      <Form.Group>
        <Form.Input
          required
          name='username'
          value={formData.username}
          onChange={handleChange}
          loading={loading}
          dataTestId='userNameInput'
        />
      </Form.Group>
      <Form.Group>
        <Form.Password
          required
          value={formData.password}
          onChange={handleChange}
          loading={loading}
          dataTestId='passwordInput'
        />
      </Form.Group>
      <Form.Submit
        title='Войти'
        loading={loading}
      />
      <p className='auth-switch'>
        Если у вас нет аккаунта,{' '}
        <span className='auth-link' onClick={onSwitchToRegister}>
          зарегистрируйтесь
        </span>
      </p>
    </Form>
  )
}
