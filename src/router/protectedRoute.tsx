import {ReactNode} from 'react'
import {Navigate, useLocation} from 'react-router-dom'
import {useAuthStore} from '@stores'
import {getRoute} from '@services'
import {Page} from '@types'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const location = useLocation()
  const {isAuthenticated} = useAuthStore()

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to={getRoute(Page.LOGIN)}
        state={{from: location}}
      />
    )
  }

  return <>{children}</>
}
