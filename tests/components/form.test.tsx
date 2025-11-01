import {render, screen, fireEvent} from '@testing-library/react'
import {Form} from '@components'
import {describe, it, expect, vi} from 'vitest'

describe('Form', () => {
  const mockOnSubmit = vi.fn()
  const mockOnChange = vi.fn()

  const formProps = {
    title: 'Тест форма',
    error: '',
    onSubmit: mockOnSubmit
  }

  const inputProps = {
    name: 'username',
    value: '',
    onChange: mockOnChange,
    loading: false,
    required: true,
    error: '',
    placeholder: 'Имя пользователя'
  }

  const submitProps = {
    loading: false,
    title: 'Отправить'
  }

  it('should render form with title and inputs', () => {
    render(
      <Form {...formProps}>
        <Form.Group>
          <Form.Input {...inputProps} />
        </Form.Group>
        <Form.Submit {...submitProps} />
      </Form>
    )

    expect(screen.getByRole('heading', {name: formProps.title})).toBeInTheDocument()
    expect(screen.getByPlaceholderText(inputProps.placeholder)).toBeInTheDocument()
    expect(screen.getByRole('button', {name: submitProps.title})).toBeInTheDocument()
  })

  it('should show error message when provided', () => {
    const propsWithError = {
      ...formProps,
      error: 'Ошибка валидации'
    }

    render(
      <Form {...propsWithError}>
        <Form.Submit {...submitProps} />
      </Form>
    )

    expect(screen.getByText(propsWithError.error)).toBeInTheDocument()
  })

  it('should disable inputs and button when loading', () => {
    const loadingInputProps = {...inputProps, loading: true}

    const loadingSubmitProps = {...submitProps, loading: true}

    render(
      <Form {...formProps}>
        <Form.Group>
          <Form.Input {...loadingInputProps} />
        </Form.Group>
        <Form.Submit {...loadingSubmitProps} />
      </Form>
    )

    expect(screen.getByPlaceholderText(loadingInputProps.placeholder)).toBeDisabled()
    expect(screen.getByRole('button', {name: loadingSubmitProps.title})).toBeDisabled()
  })

  it('should show field error when input has error', () => {
    const inputWithErrorProps = {
      ...inputProps,
      error: 'Обязательное поле'
    }

    render(
      <Form {...formProps}>
        <Form.Group>
          <Form.Input {...inputWithErrorProps} />
        </Form.Group>
      </Form>
    )

    expect(screen.getByText(inputWithErrorProps.error)).toBeInTheDocument()
    const input = screen.getByPlaceholderText(inputWithErrorProps.placeholder)
    expect(input).toHaveClass('error')
  })

  it('should call onSubmit when form is submitted', async () => {
    render(
      <Form {...formProps}>
        <Form.Submit {...submitProps} />
      </Form>
    )

    fireEvent.click(screen.getByRole('button', {name: submitProps.title}))
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
  })

  it('should render password input correctly', () => {
    const passwordProps = {
      value: '',
      onChange: mockOnChange,
      required: true,
      loading: false,
      placeholder: 'Пароль',
      error: ''
    }

    render(
      <Form {...formProps}>
        <Form.Group>
          <Form.Password {...passwordProps} />
        </Form.Group>
      </Form>
    )

    const passwordInput = screen.getByPlaceholderText(passwordProps.placeholder)
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('name', 'password')
  })
})
