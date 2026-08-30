import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { SUPPORTED_LANGS } from '../constants'
import { NAV_ROUTES } from '../routeDefinitions'
import { langLabels, translations } from '../i18n'
import { normalizePathname } from '../utils/path'
import { IconBurger, IconClose, IconChevronDown } from './HeaderIcons'

export default function Header() {
  const { lang, setLang } = useLangContext()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false)
  const [menuDropdownPosition, setMenuDropdownPosition] = useState({ top: 0, left: 0 })
  const [langModalOpen, setLangModalOpen] = useState(false)
  const [langModalPosition, setLangModalPosition] = useState({ top: 0, left: 0 })
  const [mobileMenuPickerOpen, setMobileMenuPickerOpen] = useState(false)
  const desktopMenuTriggerRef = useRef(null)
  const mobileMenuPickerTriggerRef = useRef(null)
  const desktopLangTriggerRef = useRef(null)
  const mobileLangTriggerRef = useRef(null)
  const t = translations[lang]
  const base = import.meta.env.BASE_URL
  const headerLogoSrc = `${base}images/logo.svg`
  const normalizedPath = normalizePathname(location.pathname)
  const isMenuGroupActive =
    normalizedPath === '/menu' ||
    normalizedPath === '/menu/download' ||
    normalizedPath === '/cocktails'
  const desktopNavRoutes = NAV_ROUTES.filter(({ path }) => path !== '/menu' && path !== '/cocktails')

  const menuPickerOpen = menuDropdownOpen || mobileMenuPickerOpen

  const closeMenuPicker = () => {
    setMenuDropdownOpen(false)
    setMobileMenuPickerOpen(false)
  }

  const openMenuDropdown = () => {
    setLangModalOpen(false)
    setMobileMenuPickerOpen(false)
    setMenuDropdownOpen(true)
  }
  const openLangModal = () => {
    setMenuDropdownOpen(false)
    setMobileMenuPickerOpen(false)
    setLangModalOpen(true)
  }

  const toggleMobileMenuPicker = () => {
    setLangModalOpen(false)
    setMenuDropdownOpen(false)
    setMobileMenuPickerOpen((open) => !open)
  }
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
    const panelWidth = 120
    const panelHeightEstimate = 90
    const margin = 8
    let left
    if (menuOpen) {
      left = rect.left + rect.width / 2 - panelWidth / 2
      left = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin))
    } else {
      const panelMinLeft = margin
      const panelMaxLeft = window.innerWidth - panelWidth - margin
      left = rect.left
      if (left < panelMinLeft) left = panelMinLeft
      if (left > panelMaxLeft) left = panelMaxLeft
    }
    const spaceBelow = window.innerHeight - rect.bottom - gap
    const openAbove = spaceBelow < panelHeightEstimate && rect.top > panelHeightEstimate + gap
    const top = openAbove ? rect.top - panelHeightEstimate - gap : rect.bottom + gap
    setLangModalPosition({ top, left })
  }, [langModalOpen, menuOpen])

  useEffect(() => {
    setMenuOpen(false)
    setMenuDropdownOpen(false)
    setLangModalOpen(false)
    setMobileMenuPickerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) setMobileMenuPickerOpen(false)
  }, [menuOpen])

  useEffect(() => {
    const open = menuOpen || langModalOpen || menuPickerOpen
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, langModalOpen, menuPickerOpen])

  useLayoutEffect(() => {
    if (!menuPickerOpen) return
    const trigger = mobileMenuPickerOpen
      ? mobileMenuPickerTriggerRef.current
      : desktopMenuTriggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const gap = 6
    const margin = 8
    let left
    let panelWidth
    let panelHeightEstimate
    if (mobileMenuPickerOpen) {
      panelWidth = Math.min(260, Math.round(window.innerWidth * 0.88))
      panelHeightEstimate = 132
      left = rect.left + rect.width / 2 - panelWidth / 2
      left = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin))
    } else {
      panelWidth = 170
      panelHeightEstimate = 140
      const panelMinLeft = margin
      const panelMaxLeft = window.innerWidth - panelWidth - margin
      left = rect.left
      if (left < panelMinLeft) left = panelMinLeft
      if (left > panelMaxLeft) left = panelMaxLeft
    }
    const spaceBelow = window.innerHeight - rect.bottom - gap
    const openAbove = spaceBelow < panelHeightEstimate && rect.top > panelHeightEstimate + gap
    const top = openAbove ? rect.top - panelHeightEstimate - gap : rect.bottom + gap
    setMenuDropdownPosition({ top, left })
  }, [menuPickerOpen, mobileMenuPickerOpen, menuOpen])

  const desktopNavContent = (
    <>
      {desktopNavRoutes.map(({ path, navKey }) => (
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
      <button
        ref={desktopMenuTriggerRef}
        type="button"
        className={`header__nav-link header__menu-dropdown-trigger ${isMenuGroupActive ? 'header__nav-link--active' : ''}`}
        onClick={() => (menuDropdownOpen ? closeMenuPicker() : openMenuDropdown())}
        aria-label={t.navMenuGroup}
        aria-expanded={menuDropdownOpen}
      >
        <span>{t.navMenuGroup}</span>
        <span className={`lang-switcher__arrow ${menuDropdownOpen ? 'lang-switcher__arrow--open' : ''}`}>
          <IconChevronDown />
        </span>
      </button>
    </>
  )

  const mobileNavContent = (
    <>
      {desktopNavRoutes.map(({ path, navKey }) => (
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
      <button
        ref={mobileMenuPickerTriggerRef}
        type="button"
        className={`header__nav-link header__menu-dropdown-trigger header__menu-mobile-picker-trigger ${isMenuGroupActive ? 'header__nav-link--active' : ''}`}
        onClick={() => (mobileMenuPickerOpen ? closeMenuPicker() : toggleMobileMenuPicker())}
        aria-label={t.navMenuGroup}
        aria-haspopup="dialog"
        aria-expanded={mobileMenuPickerOpen}
      >
        <span>{t.navMenuGroup}</span>
        <span className={`lang-switcher__arrow ${mobileMenuPickerOpen ? 'lang-switcher__arrow--open' : ''}`}>
          <IconChevronDown />
        </span>
      </button>
    </>
  )

  return (
    <header className="header">
      <div className="header__inner content-column">
        <div className="header__logo-wrap">
          <NavLink
            to="/"
            end
            className="header__logo"
            onClick={() => setMenuOpen(false)}
            aria-label={t.navHome}
          >
            <img src={headerLogoSrc} alt="" className="header__logo-img" width={171} height={87} decoding="async" />
          </NavLink>
        </div>
        <div className="header__nav-wrap">
          <nav className="header__nav" aria-label="Основная навигация">
            {desktopNavContent}
          </nav>
          <nav className="lang-switcher header__nav-lang" aria-label="Выбор языка">
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
        </div>
        <div className="header__controls">
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
          <div className="header__menu-brand">
            <NavLink
              to="/"
              end
              className="header__logo"
              onClick={() => setMenuOpen(false)}
              aria-label={t.navHome}
            >
              <img src={headerLogoSrc} alt="" className="header__logo-img" width={171} height={87} decoding="async" />
            </NavLink>
          </div>
          <div className="header__menu-links">
            {mobileNavContent}
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

      <div
        className={`header-menu-modal-overlay ${menuPickerOpen ? 'header-menu-modal-overlay--open' : ''}`}
        aria-hidden={!menuPickerOpen}
        onClick={closeMenuPicker}
      >
        <div
          className={`header-menu-modal ${mobileMenuPickerOpen ? 'header-menu-modal--mobile' : ''}`}
          role="dialog"
          aria-label={t.navMenuGroup}
          aria-modal="true"
          style={{
            top: menuDropdownPosition.top,
            left: menuDropdownPosition.left,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="header-menu-modal__options">
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `header-menu-modal__option header-menu-modal__option--nav-main-menu ${isActive ? 'header-menu-modal__option--active' : ''}`
              }
              onClick={() => {
                closeMenuPicker()
                setMenuOpen(false)
              }}
            >
              {t.navMenu}
            </NavLink>
            <NavLink
              to="/cocktails"
              className={({ isActive }) => `header-menu-modal__option ${isActive ? 'header-menu-modal__option--active' : ''}`}
              onClick={() => {
                closeMenuPicker()
                setMenuOpen(false)
              }}
            >
              {t.navCocktails}
            </NavLink>
            <NavLink
              to="/menu/download"
              className={({ isActive }) => `header-menu-modal__option ${isActive ? 'header-menu-modal__option--active' : ''}`}
              onClick={() => {
                closeMenuPicker()
                setMenuOpen(false)
              }}
            >
              {t.downloadMenu}
            </NavLink>
          </div>
        </div>
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
