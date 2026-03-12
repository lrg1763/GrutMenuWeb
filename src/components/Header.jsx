import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { SUPPORTED_LANGS, NAV_ROUTES } from '../constants'
import { langLabels, translations } from '../i18n'

const IconBurger = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="8" x2="21" y2="8" />
    <line x1="3" y1="16" x2="21" y2="16" />
  </svg>
)

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export default function Header() {
  const { lang, setLang } = useLangContext()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langModalOpen, setLangModalOpen] = useState(false)
  const [langModalPosition, setLangModalPosition] = useState({ top: 0, left: 0 })
  const desktopLangTriggerRef = useRef(null)
  const mobileLangTriggerRef = useRef(null)
  const t = translations[lang]

  const openLangModal = () => setLangModalOpen(true)
  const closeLangModal = () => setLangModalOpen(false)
  const chooseLang = (l) => {
    setLang(l)
    setLangModalOpen(false)
  }

  useLayoutEffect(() => {
    if (!langModalOpen) return
    const trigger = menuOpen ? mobileLangTriggerRef.current : desktopLangTriggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const gap = 6
    const panelWidth = 140
    const panelHeightEstimate = 140
    const margin = 8
    const panelMinLeft = margin
    const panelMaxLeft = window.innerWidth - panelWidth - margin
    let left = rect.left
    if (left < panelMinLeft) left = panelMinLeft
    if (left > panelMaxLeft) left = panelMaxLeft
    const spaceBelow = window.innerHeight - rect.bottom - gap
    const openAbove = spaceBelow < panelHeightEstimate && rect.top > panelHeightEstimate + gap
    const top = openAbove ? rect.top - panelHeightEstimate - gap : rect.bottom + gap
    setLangModalPosition({ top, left })
  }, [langModalOpen, menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const open = menuOpen || langModalOpen
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, langModalOpen])

  const navContent = (
    <>
      {NAV_ROUTES.map(({ path, navKey }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) => `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          {t[navKey]}
        </NavLink>
      ))}
    </>
  )

  return (
    <header className="header">
      <div className="header__inner content-column">
        <div className="header__nav-spacer" aria-hidden="true" />
        <div className="header__nav-wrap">
          <nav className="header__nav" aria-label="Основная навигация">
            {navContent}
          </nav>
        </div>
        <div className="header__controls">
          <nav className="lang-switcher" aria-label="Выбор языка">
            <button
              ref={desktopLangTriggerRef}
              type="button"
              className="lang-switcher__trigger"
              onClick={openLangModal}
              aria-label={t.langSectionTitle}
              aria-expanded={langModalOpen}
            >
              <span className="lang-switcher__trigger-label">{langLabels[lang]}</span>
              <span className={`lang-switcher__arrow ${langModalOpen ? 'lang-switcher__arrow--open' : ''}`}>
                <IconChevronDown />
              </span>
            </button>
          </nav>
          <button
            type="button"
            className="header__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
          >
            <span className="header__burger-icon">
              {menuOpen ? <IconClose /> : <IconBurger />}
            </span>
          </button>
        </div>
      </div>
      <div
        className={`header__menu-overlay ${menuOpen ? 'header__menu-overlay--open' : ''}`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      >
        <nav
          className="header__menu"
          aria-label="Основная навигация"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="header__menu-links">
            {navContent}
          </div>
          <div className="header__menu-controls">
            <button
              ref={mobileLangTriggerRef}
              type="button"
              className="lang-switcher__trigger header__menu-lang-trigger"
              onClick={openLangModal}
              aria-label={t.langSectionTitle}
              aria-expanded={langModalOpen}
            >
              <span className="lang-switcher__trigger-label">{langLabels[lang]}</span>
              <span className={`lang-switcher__arrow ${langModalOpen ? 'lang-switcher__arrow--open' : ''}`}>
                <IconChevronDown />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Модальное окно выбора языка */}
      <div
        className={`lang-modal-overlay ${langModalOpen ? 'lang-modal-overlay--open' : ''}`}
        aria-hidden={!langModalOpen}
        onClick={closeLangModal}
      >
        <div
          className="lang-modal"
          role="dialog"
          aria-label={t.langSectionTitle}
          aria-modal="true"
          style={{
            top: langModalPosition.top,
            left: langModalPosition.left,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lang-modal__options">
            {SUPPORTED_LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={`lang-modal__option ${lang === l ? 'lang-modal__option--active' : ''}`}
                onClick={() => chooseLang(l)}
                aria-label={langLabels[l]}
                aria-current={lang === l ? 'true' : undefined}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
