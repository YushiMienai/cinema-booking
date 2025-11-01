import {ReactNode} from 'react'
import {Menu} from './menu'
import {Page} from '@types'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
  currentPage: string
  onPageChange: (page: Page) => void
}

export const Layout = ({children, currentPage, onPageChange}: LayoutProps) => {
  return (
    <div className='layout'>
      <div className='page-title'>{currentPage}</div>
      <div className='content-wrapper'>
        <Menu
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        <div className='main-content'>
          {children}
        </div>
      </div>
    </div>
  )
}
