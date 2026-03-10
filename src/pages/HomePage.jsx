import { Link } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'

export default function HomePage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const base = import.meta.env.BASE_URL

  const bgImage = `${base}images/home-bg.png`

  return (
    <main className="home-page">
      <div
        className="home-page__bg"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
        aria-hidden="true"
      />
      <div className="home-page__overlay" aria-hidden="true" />
      <div className="home-page__inner content-column">
        <div className="home-page__content">
          <img
            src={`${base}images/logo-1.svg`}
            alt="GRUT"
            className="home-page__logo"
          />
          <div className="home-page__tagline-wrap">
            <p className="home-page__tagline">{t.homeTagline}</p>
            {t.homeSubline && <p className="home-page__subline">{t.homeSubline}</p>}
          </div>
          <div className="home-page__actions">
            <Link to="/menu" className="home-page__btn home-page__btn--primary">
              {t.navMenu}
            </Link>
            <Link to="/cocktails" className="home-page__btn home-page__btn--secondary">
              {t.navCocktails}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
