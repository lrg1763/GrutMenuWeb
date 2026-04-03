import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { normalizePathname } from '../utils/path'
import Header from './Header'
import Footer from './Footer'
import MaxSocialFab from './MaxSocialFab'

export default function Layout() {
  const location = useLocation()
  const { lang } = useLangContext()
  const t = translations[lang]
  const isHome = normalizePathname(location.pathname) === '/'
  const pageWrapClass = isHome ? 'app__page' : 'app__page app__page--with-bg'

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useDocumentMeta(location.pathname, lang)

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
      <MaxSocialFab />
    </div>
  )
}
