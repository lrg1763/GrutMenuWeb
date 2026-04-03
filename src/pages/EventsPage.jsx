import { useEffect, useState } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import PageSection from '../components/PageSection'
import { EVENTS_PAGE_IMAGES, EVENTS_PAGE_IMAGES_MOBILE, getAssetUrl } from '../constants'

const EVENTS_MOBILE_MQ = '(max-width: 768px)'

export default function EventsPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(EVENTS_MOBILE_MQ).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(EVENTS_MOBILE_MQ)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const paths = isMobile ? EVENTS_PAGE_IMAGES_MOBILE : EVENTS_PAGE_IMAGES

  return (
    <main className="main events-page">
      <div className="content-column events-page__content">
        <PageSection title={t.eventsHeroTitle} intro={t.eventsHeroIntro} />

        <PageSection className="events-page__photos" ariaLabel={t.eventsPagePhotosAria}>
          <div className="events-page__photo-grid">
            {paths.map((path, i) => (
              <div key={path} className="events-page__photo-cell">
                <img
                  className="events-page__photo"
                  src={getAssetUrl(path)}
                  alt={t.eventsPhotosAlt}
                  decoding="async"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </main>
  )
}
