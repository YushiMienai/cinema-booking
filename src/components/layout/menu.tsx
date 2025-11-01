import {useMemo} from 'react'
import {Page} from '@types'
import {useAuthStore} from '@stores'
import './Menu.css'

interface MenuProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export const Menu = ({currentPage, onPageChange}: MenuProps) => {
  const {isAuthenticated} = useAuthStore()

  const menuItems = useMemo(() =>
    [Page.MOVIES, Page.CINEMAS, Page.MY_TICKETS, isAuthenticated ? Page.LOGOUT : Page.LOGIN],
  [isAuthenticated])

  return (
    <div className='menu'>
      {menuItems.map((item) => (
        <button
          key={item}
          className={`menu-item ${currentPage === item ? 'active' : ''}`}
          onClick={() => onPageChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
