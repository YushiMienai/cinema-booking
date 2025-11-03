import {useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {Page} from '@types'
import {useAuthStore} from '@stores'
import {useAuthActions} from '@hooks'
import {getRoute} from '@services'
import './Menu.css'

interface MenuProps {
  currentPage: Page
}

export const Menu = ({currentPage}: MenuProps) => {
  const navigate = useNavigate()
  const {isAuthenticated} = useAuthStore()
  const {handleLogout} = useAuthActions()

  const handlePageChange = async (page: Page) => {
    if (page === Page.LOGOUT) {
      handleLogout()
    } else {
      navigate(getRoute(page))
    }
  }

  const menuItems = useMemo(() =>
    [Page.MOVIES, Page.CINEMAS, Page.MY_TICKETS, isAuthenticated ? Page.LOGOUT : Page.LOGIN],
  [isAuthenticated])

  return (
    <div className='menu'>
      {menuItems.map((item) => (
        <button
          key={item}
          className={`menu-item ${currentPage === item ? 'active' : ''}`}
          onClick={() => handlePageChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
