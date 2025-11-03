import {ChangeEvent, useState} from 'react'

export const useAuthForm = <T extends object>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData(prev => ({...prev, [name]: value}))
    setError('')
  }

  const resetForm = () => {
    setFormData(initialState)
    setError('')
  }

  return {
    formData,
    loading,
    error,
    handleChange,
    setLoading,
    setError,
    resetForm
  }
}
