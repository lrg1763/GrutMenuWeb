import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'

const HOME_BG_ROTATE_MS = 10_000

export default function HomePage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const base = import.meta.env.BASE_URL

  const bgSlides = useMemo(
    () => ['bg-1.png', 'bg-2.png', 'bg-3.png'].map((file) => `${base}images/home-slideshow/${file}`),
    [base]
  )

  const [activeBgIndex, setActiveBgIndex] = useState(0)

  useEffect(() => {
    if (bgSlides.length <= 1) return undefined
    const id = window.setInterval(() => {
      setActiveBgIndex((i) => (i + 1) % bgSlides.length)
    }, HOME_BG_ROTATE_MS)
    return () => window.clearInterval(id)
  }, [bgSlides.length])

  return (
    <main className="home-page">
      {bgSlides.map((src, i) => (
        <div
          key={src}
          className="home-page__bg home-page__bg--slide"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === activeBgIndex ? 1 : 0,
          }}
          aria-hidden="true"
        />
      ))}
      <div className="home-page__overlay" aria-hidden="true" />
      <div className="home-page__inner content-column">
        <div className="home-page__content">
          <div className="home-page__hero-stack">
            <h1 className="home-page__logo" aria-label={t.homeLogo}>{t.homeLogo}</h1>
            <div className="home-page__tagline-wrap">
              <p className="home-page__tagline">{t.homeTagline}</p>
              {t.homeSubline && <p className="home-page__subline">{t.homeSubline}</p>}
            </div>
          </div>
          <div className="home-page__actions">
            <Link to="/booking" className="home-page__btn home-page__btn--primary">
              {t.btnBookTable}
            </Link>
            <Link to="/menu" className="home-page__btn home-page__btn--secondary">
              {t.btnViewMenu}
            </Link>
            <Link to="/booking?type=banquet" className="home-page__btn home-page__btn--secondary">
              {t.btnOrderBanquet}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
