import {RegisterRequest} from '@types'

interface ValidationErrors {
  username?: string
  password?: string
  confirmPassword?: string
}

export const useRegisterValidation = () => {
  const validateForm = (formData: RegisterRequest): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (formData.username.length < 8) {
      errors.username = 'Имя пользователя должно содержать минимум 8 символов'
    }

    if (formData.password.length < 8) {
      errors.password = 'Пароль должен содержать минимум 8 символов'
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Пароль должен содержать минимум 1 заглавную букву'
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = 'Пароль должен содержать минимум 1 цифру'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают'
    }

    return errors
  }

  return {validateForm}
}
