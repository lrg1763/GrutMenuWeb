import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === ''
  const pageWrapClass = isHome ? 'app__page' : 'app__page app__page--with-bg'

  return (
    <div className="app">
      <Header />
      <div className={pageWrapClass}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
