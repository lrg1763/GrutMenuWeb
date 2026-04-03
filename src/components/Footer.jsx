import { Link } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { LEGAL_ROUTE_ENTRIES } from '../routeDefinitions'

export default function Footer() {
  const { lang } = useLangContext()
  const t = translations[lang]

  return (
    <footer className="footer">
      <div className="footer__inner content-column">
        <div className="footer__center">
          <div className="footer__contact-block">
            <p className="footer__contact">{t.footerContact}</p>
            <a href="tel:+79167070210" className="footer__phone">{t.footerPhone}</a>
            <nav className="footer__legal-nav" aria-label={t.footerLegalNavAria}>
              <div className="footer__links">
                {LEGAL_ROUTE_ENTRIES.map(({ path, footerLabelKey }) => (
                  <Link key={path} to={path} className="footer__link">
                    {t[footerLabelKey]}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
