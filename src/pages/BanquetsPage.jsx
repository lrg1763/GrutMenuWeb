import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import PageSection from '../components/PageSection'
import BanquetZoneModal from '../components/BanquetZoneModal'
import { BANQUETS_CONVENIENCE_IMAGES, BANQUET_ZONES, getAssetUrl } from '../constants'

export default function BanquetsPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const [selectedZone, setSelectedZone] = useState(null)

  return (
    <main className="main banquets-page">
      <div className="content-column banquets-page__content">
        <PageSection title={t.banquetsHeroTitle} intro={t.banquetsHeroText} />

        <PageSection className="banquets-page__hero-wordmark-section">
          <div className="banquets-page__hero-wordmark" aria-hidden="true">
            <img
              className="banquets-page__hero-wordmark-img banquets-page__hero-wordmark-img--mobile"
              src={getAssetUrl('/banquets/frame-4-1.svg')}
              alt=""
              decoding="async"
            />
            <img
              className="banquets-page__hero-wordmark-img banquets-page__hero-wordmark-img--desktop"
              src={getAssetUrl('/banquets/frame-9.svg')}
              alt=""
              decoding="async"
            />
          </div>
        </PageSection>

        <PageSection className="banquets-page__convenience" title={t.banquetsConvenienceTitle}>
          <div className="banquets-page__convenience-grid">
            {BANQUETS_CONVENIENCE_IMAGES.map((path) => (
              <article
                key={path}
                className="banquets-page__convenience-card banquets-page__convenience-card--media-only"
              >
                <div className="banquets-page__convenience-media">
                  <img
                    className="banquets-page__convenience-photo"
                    src={getAssetUrl(path)}
                    alt={t.banquetsConveniencePhotosAlt}
                    decoding="async"
                  />
                </div>
              </article>
            ))}
          </div>
        </PageSection>

        <PageSection className="banquets-page__zones" title={t.banquetsZonesTitle} ariaLabel={t.banquetsZonesAria}>
          <ul className="banquets-page__zones-grid">
            {BANQUET_ZONES.map((zone) => (
              <li key={zone.id}>
                <button
                  type="button"
                  className="banquets-page__zone-card"
                  onClick={() => setSelectedZone(zone)}
                  aria-label={t.banquetsZoneTitle.replace('{n}', zone.id)}
                >
                  <span className="banquets-page__zone-number">{zone.id}</span>
                </button>
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection title={t.banquetsOrderTitle} intro={t.banquetsOrderIntro}>
          <Link to="/booking?type=banquet" className="banquets-page__cta-btn">
            {t.banquetsOrderCta}
          </Link>
        </PageSection>
      </div>
      <BanquetZoneModal zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </main>
  )
}
