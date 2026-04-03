import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import PageSection from '../components/PageSection'
import { IconLocation, IconClock, IconPhone, IconMail } from '../components/ContactsIcons'
import { YandexMapBlock, OSM_EMBED_URL, isYandexMapsConfigured } from '../components/YandexMapContact'

export default function ContactsPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const yandexMapLang = lang === 'en' ? 'en_US' : 'ru_RU'

  return (
    <main className="main contacts-page">
      <div className="content-column contacts-page__content">
        <PageSection
          className="contacts-page__hero-section"
          title={t.contactPageTitle}
          intro={t.pageDescriptionContacts}
        />

        <PageSection className="contacts-page__details-section" ariaLabel={t.contactSectionLabel}>
          <div className="contacts-page__info">
            <div className="contacts-page__row">
              <div className="contacts-page__icon" aria-hidden="true">
                <IconLocation />
              </div>
              <div className="contacts-page__item-body">
                <p className="contacts-page__item-title">{t.contactAddressLabel}</p>
                <p className="contacts-page__item-text contacts-page__address">{t.contactAddress}</p>
              </div>
            </div>
            <div className="contacts-page__row">
              <div className="contacts-page__icon" aria-hidden="true">
                <IconClock />
              </div>
              <div className="contacts-page__item-body">
                <p className="contacts-page__item-title">{t.contactHoursLabel}</p>
                <p className="contacts-page__item-text">{t.contactHours}</p>
              </div>
            </div>
            <div className="contacts-page__row">
              <div className="contacts-page__icon" aria-hidden="true">
                <IconPhone />
              </div>
              <div className="contacts-page__item-body">
                <p className="contacts-page__item-title">{t.contactPhoneLabel}</p>
                <a href="tel:+79167070210" className="contacts-page__phone">{t.footerPhone}</a>
              </div>
            </div>
            <div className="contacts-page__row">
              <div className="contacts-page__icon" aria-hidden="true">
                <IconMail />
              </div>
              <div className="contacts-page__item-body">
                <p className="contacts-page__item-title">{t.contactEmailLabel}</p>
                <a href={`mailto:${t.contactEmail}`} className="contacts-page__phone">{t.contactEmail}</a>
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection className="contacts-page__map-section">
          <div className="contacts-page__map-wrap">
            {isYandexMapsConfigured ? (
              <YandexMapBlock mapLang={yandexMapLang} />
            ) : (
              <iframe
                className="contacts-page__map"
                src={OSM_EMBED_URL}
                title={t.contactAddress}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        </PageSection>
      </div>
    </main>
  )
}
