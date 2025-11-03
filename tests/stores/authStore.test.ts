import {describe, it, expect, beforeEach} from 'vitest'
import {useAuthStore} from '@stores'

// Константы
const TEST_DATA = {
  TOKEN: 'token123',
  USERNAME: 'testuser',
  EMPTY_STRING: ''
} as const

const EXPECTED_VALUES = {
  AUTHENTICATED: true,
  NOT_AUTHENTICATED: false
} as const

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('should login user', () => {
    const {login} = useAuthStore.getState()

    login(TEST_DATA.TOKEN, TEST_DATA.USERNAME)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(EXPECTED_VALUES.AUTHENTICATED)
    expect(state.username).toBe(TEST_DATA.USERNAME)
    expect(state.token).toBe(TEST_DATA.TOKEN)
  })

  it('should logout user', () => {
    const {login, logout} = useAuthStore.getState()

    login(TEST_DATA.TOKEN, TEST_DATA.USERNAME)
    logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(EXPECTED_VALUES.NOT_AUTHENTICATED)
    expect(state.username).toBe(TEST_DATA.EMPTY_STRING)
    expect(state.token).toBe(TEST_DATA.EMPTY_STRING)
  })
})
