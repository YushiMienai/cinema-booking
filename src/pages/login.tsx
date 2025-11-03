import {FormEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import {Form} from '@components'
import {AuthRequest} from '@types'
import {useAuthActions, useAuthForm} from '@hooks'

export const Login = () => {
  const navigate = useNavigate()
  const { handleLogin } = useAuthActions()

  const {formData, loading, error, handleChange, setLoading, setError} =
    useAuthForm<AuthRequest>({
      username: '',
      password: ''
    })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await handleLogin(formData)
    } catch (err) {
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
        <span className='auth-link' onClick={() => navigate('/register')}>
          зарегистрируйтесь
        </span>
      </p>
    </Form>
  )
}
