import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'

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
          </div>
        </div>
      </div>
    </footer>
  )
}
