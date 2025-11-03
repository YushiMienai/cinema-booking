import {useEffect, useRef} from 'react'
import {useAuthStore} from '@stores'
import {useAuthActions} from './useAuthActions'

export const useAuthTimeout = () => {
  const {isAuthenticated, logout, loginTime} = useAuthStore()
  const {handleLogout} = useAuthActions()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !loginTime) return

    const handleAutoLogout = () => {
      handleLogout()
    }

    const timePassed = Date.now() - loginTime
    const timeLeft = 60 * 60 * 1000 - timePassed

    if (timeLeft <= 0) {
      handleAutoLogout()
      return
    }

    timeoutRef.current = setTimeout(handleAutoLogout, timeLeft)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isAuthenticated, loginTime, logout])

  return {isAuthenticated}
}
