import {FormEvent, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Form} from '@components'
import {useAuthActions, useAuthForm, useRegisterValidation} from '@hooks'
import {RegisterRequest} from '@types'

interface ValidationErrors {
  username?: string
  password?: string
  confirmPassword?: string
}

export const Register = () => {
  const navigate = useNavigate()
  const {handleRegister} = useAuthActions()

  const {formData, loading, error, handleChange, setLoading, setError} =
    useAuthForm<RegisterRequest>({
      username: '',
      password: '',
      confirmPassword: ''
    })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const {validateForm} = useRegisterValidation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await handleRegister(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      title='Регистрация'
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
        <span className='auth-link' onClick={() => navigate('/login')}>
          войдите
        </span>
      </p>
    </Form>
  )
}
