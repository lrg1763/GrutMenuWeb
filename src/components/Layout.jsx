import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { YANDEX_METRIKA_COUNTER_ID } from '../constants'
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
  const metrikaSkipFirstHit = useRef(true)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useDocumentMeta(location.pathname, lang)

  useEffect(() => {
    if (metrikaSkipFirstHit.current) {
      metrikaSkipFirstHit.current = false
      return
    }
    if (typeof window.ym !== 'function') return
    const path = `${window.location.pathname}${window.location.search}`
    window.ym(YANDEX_METRIKA_COUNTER_ID, 'hit', path, { title: document.title })
  }, [location.pathname, location.search])

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
