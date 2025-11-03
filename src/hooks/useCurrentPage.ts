import {useLocation} from 'react-router-dom'
import {Page} from '@types'
import {getPageFromPath} from '@services'

export const useCurrentPage = (): Page => {
  const location = useLocation()
  return getPageFromPath(location.pathname)
}
