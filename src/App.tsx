import {Outlet} from 'react-router-dom'
import {Layout, Toast} from '@components'
import {useAuthTimeout, useCurrentPage} from '@hooks'
import './index.css'

function App() {
  const currentPage = useCurrentPage()

  useAuthTimeout()

  return (
    <div className='app'>
      <Layout currentPage={currentPage}>
        <Outlet />
      </Layout>
      <Toast />
    </div>
  )
}

export default App
