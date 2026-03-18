import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const { lang } = useLangContext()
  const t = translations[lang]
  const isHome = location.pathname === '/' || location.pathname === ''
  const pageWrapClass = isHome ? 'app__page' : 'app__page app__page--with-bg'

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '') || '/'
    if (path === '/' || path === '') document.title = t.pageTitleHome
    else if (path.endsWith('menu')) document.title = t.pageTitleMenu
    else if (path.endsWith('cocktails')) document.title = t.pageTitleCocktails
    else document.title = t.pageTitleHome
  }, [location.pathname, t.pageTitleHome, t.pageTitleMenu, t.pageTitleCocktails])

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        {t.skipToContent}
      </a>
      <Header />
      <div className={pageWrapClass} id="main-content" tabIndex={-1}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
