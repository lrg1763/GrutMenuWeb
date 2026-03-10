import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'

const YANDEX_MAP_SRC = 'https://yandex.ru/map-widget/v1/?mode=search&text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%A8%D0%B8%D0%BF%D0%B8%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%2C%2028%D0%90'

function IconLocation() {
  return (
    <svg className="contact-block__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.5 7 13 7 13s7-7.5 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" strokeWidth="1.5" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg className="contact-block__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg className="contact-block__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

export default function ContactBlock({ className = '' }) {
  const { lang } = useLangContext()
  const t = translations[lang]

  return (
    <section className={`contact-block ${className}`.trim()} aria-label={t.contactSectionLabel}>
      <div className="contact-block__map-wrap">
        <iframe
          title="Yandex Map — GRUT"
          src={YANDEX_MAP_SRC}
          width="100%"
          height="400"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer"
          className="contact-block__map"
        />
      </div>
      <div className="contact-block__text-col">
        <div className="contact-block__row">
          <span className="contact-block__icon" aria-hidden="true">
            <IconLocation />
          </span>
          <div className="contact-block__item">
            <h2 className="contact-block__title">{t.contactAddressLabel}</h2>
            <p className="contact-block__text">{t.contactAddress}</p>
          </div>
        </div>
        <div className="contact-block__row">
          <span className="contact-block__icon" aria-hidden="true">
            <IconClock />
          </span>
          <div className="contact-block__item">
            <h2 className="contact-block__title">{t.contactHoursLabel}</h2>
            <p className="contact-block__text">{t.contactHours}</p>
          </div>
        </div>
        <div className="contact-block__row">
          <span className="contact-block__icon" aria-hidden="true">
            <IconPhone />
          </span>
          <div className="contact-block__item">
            <h2 className="contact-block__title">{t.contactPhoneLabel}</h2>
            <a href="tel:+79167070210" className="contact-block__phone">{t.footerPhone}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
