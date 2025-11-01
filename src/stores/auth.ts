import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  username: string
  token: string
  loginTime: number | null
  login: (token: string, username: string) => void
  logout: () => void
  checkAuthTimeout: () => boolean
}

const SESSION_TIMEOUT = 60 * 60 * 1000

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      username: '',
      token: '',
      loginTime: null,

      login: (token: string, username: string) => {
        set({
          isAuthenticated: true,
          username,
          token,
          loginTime: Date.now()
        })
      },

      logout: () => {
        set({
          isAuthenticated: false,
          username: '',
          token: '',
          loginTime: null
        })
      },

      checkAuthTimeout: (): boolean => {
        const state = get()
        if (!state.loginTime) return false

        const currentTime = Date.now()
        const timeElapsed = currentTime - state.loginTime

        if (timeElapsed >= SESSION_TIMEOUT) {
          get().logout()
          return true
        }

        return false
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        username: state.username,
        token: state.token,
        loginTime: state.loginTime
      })
    }
  )
)
