import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const PAGE_TITLES = {
  home: 'Ресторан ГРЮТ на Домодедовской',
  menu: 'Основное меню ресторана ГРЮТ',
  cocktails: 'Коктейльная карта ресторана ГРЮТ',
}

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === ''
  const pageWrapClass = isHome ? 'app__page' : 'app__page app__page--with-bg'

  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '') || '/'
    if (path === '/' || path === '') document.title = PAGE_TITLES.home
    else if (path.endsWith('menu')) document.title = PAGE_TITLES.menu
    else if (path.endsWith('cocktails')) document.title = PAGE_TITLES.cocktails
    else document.title = PAGE_TITLES.home
  }, [location.pathname])

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
