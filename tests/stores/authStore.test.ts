import {describe, it, expect, beforeEach} from 'vitest'
import {useAuthStore} from '@stores'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('should login user', () => {
    const {login} = useAuthStore.getState()

    login('token123', 'testuser')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.username).toBe('testuser')
    expect(state.token).toBe('token123')
  })

  it('should logout user', () => {
    const {login, logout} = useAuthStore.getState()

    login('token123', 'testuser')
    logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.username).toBe('')
  })
})
