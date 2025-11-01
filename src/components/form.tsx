import {ChangeEvent, FormEvent, ReactNode} from 'react'

interface FormProps {
  title: string
  error: string
  onSubmit: (e: FormEvent) => void
  children: ReactNode
}

interface FormGroupProps {
  children: ReactNode
}

interface FormInputProps {
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  required: boolean
  error: string
  placeholder: string
  type?: string
  dataTestId?: string
}

interface FormSubmitProps {
  loading: boolean
  title: string
}

export const Form = ({title, error, onSubmit, children}: FormProps) => {

  return (
    <div
      className='auth-form'
      role='form'
    >
      <h2>{title}</h2>
      {error && <div className='error-message'>{error}</div>}
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  )
}

const FormGroup = ({children}: FormGroupProps) => {

  return (
    <div className='form-group'>{children}</div>
  )
}

const FormInput = ({value, onChange, loading, required, error, placeholder, name, type = 'text', dataTestId = ''}: FormInputProps) => {

  return (
    <>
      <input
        data-testid={dataTestId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={loading}
        className={error ? 'error' : ''}
      />
      {error && <div className='field-error'>{error}</div>}
    </>
  )
}

const FormPassword = ({value, onChange, required, loading, placeholder, error, name = 'password', dataTestId = ''}) => {

  return (
    <FormInput
      type='password'
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      loading={loading}
      error={error}
      dataTestId={dataTestId}
    />
  )
}

const FormSubmit = ({loading, title}: FormSubmitProps) => {

  return (
    <button
      type='submit'
      className='auth-button'
      disabled={loading}
    >
      {title}
    </button>
  )
}

Form.Group = FormGroup
Form.Input = FormInput
Form.Password = FormPassword
Form.Submit = FormSubmit
