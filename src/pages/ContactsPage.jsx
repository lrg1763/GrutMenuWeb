import { useEffect, useRef } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'

const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY

/* Отель Милан, Шипиловская 28А, Москва */
const HOTEL_MILAN_LNG = 37.71515
const HOTEL_MILAN_LAT = 55.61875

/* Fallback: OpenStreetMap, если API-ключ Яндекса не задан */
const OSM_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=37.706%2C55.612%2C37.724%2C55.626&layer=mapnik&marker=55.61875%2C37.71515'

function IconLocation() {
  return (
    <svg className="contact-block__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg className="contact-block__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg className="contact-block__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

const MARKER_LABEL = 'г. Москва, ул. Шипиловская, 28A'

function showOsmFallback(container) {
  if (!container) return
  container.innerHTML = ''
  const iframe = document.createElement('iframe')
  iframe.className = 'contact-block__map'
  iframe.src = OSM_EMBED_URL
  iframe.title = MARKER_LABEL
  iframe.setAttribute('loading', 'lazy')
  container.appendChild(iframe)
}

function YandexMapBlock() {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const retryRef = useRef(false)

  useEffect(() => {
    if (!YANDEX_MAPS_API_KEY) return

    const container = containerRef.current
    if (!container) return

    const scriptId = 'yandex-maps-api-v3'

    function initMap(target) {
      const el = target ?? containerRef.current
      if (!el) {
        if (!retryRef.current) {
          retryRef.current = true
          setTimeout(() => initMap(containerRef.current), 100)
        }
        return
      }
      if (!window.ymaps3) return
      window.ymaps3.ready.then(() => {
        try {
          const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = window.ymaps3
          const map = new YMap(
            el,
            {
              location: { center: [HOTEL_MILAN_LNG, HOTEL_MILAN_LAT], zoom: 17 },
              showScaleInCopyrights: true,
            },
            [
              new YMapDefaultSchemeLayer({}),
              new YMapDefaultFeaturesLayer({}),
            ]
          )
          mapRef.current = map

          const markerEl = document.createElement('div')
          markerEl.textContent = MARKER_LABEL
          markerEl.style.cssText = 'padding: 6px 10px; background: #1a1a1a; color: #fff; font-size: 12px; line-height: 1.3; border-radius: 4px; white-space: nowrap; max-width: 220px; overflow: hidden; text-overflow: ellipsis;'
          const marker = new YMapMarker({ coordinates: [HOTEL_MILAN_LNG, HOTEL_MILAN_LAT] }, markerEl)
          map.addChild(marker)
        } catch (err) {
          console.error('Yandex Map init error:', err)
          showOsmFallback(el)
        }
      }).catch((err) => {
        console.error('Yandex Map ready error:', err)
        showOsmFallback(el)
      })
    }

    function scheduleInit() {
      setTimeout(() => initMap(containerRef.current), 0)
    }

    if (document.getElementById(scriptId)) {
      scheduleInit()
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(YANDEX_MAPS_API_KEY)}&lang=ru_RU`
    script.async = true
    script.onload = scheduleInit
    script.onerror = () => {
      showOsmFallback(containerRef.current)
    }
    document.head.appendChild(script)

    return () => {
      if (mapRef.current?.destroy) mapRef.current.destroy()
      mapRef.current = null
    }
  }, [])

  return <div ref={containerRef} id="yandex-map-contact" className="contact-block__map" aria-label={`Карта: ${MARKER_LABEL}`} />
}

export default function ContactsPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const useYandexMap = Boolean(YANDEX_MAPS_API_KEY)

  return (
    <main className="main contacts-page">
      <div className="content-column contacts-page__content">
        <div className="contacts-page__contact contact-block">
          <h1 className="contacts-page__title">{t.contactPageTitle}</h1>
          <div className="contacts-page__info">
            <div className="contact-block__row">
              <div className="contact-block__icon" aria-hidden="true">
                <IconLocation />
              </div>
              <div className="contact-block__item">
                <p className="contact-block__title">{t.contactAddressLabel}</p>
                <p className="contact-block__text">{t.contactAddress}</p>
              </div>
            </div>
            <div className="contact-block__row">
              <div className="contact-block__icon" aria-hidden="true">
                <IconClock />
              </div>
              <div className="contact-block__item">
                <p className="contact-block__title">{t.contactHoursLabel}</p>
                <p className="contact-block__text">{t.contactHours}</p>
              </div>
            </div>
            <div className="contact-block__row">
              <div className="contact-block__icon" aria-hidden="true">
                <IconPhone />
              </div>
              <div className="contact-block__item">
                <p className="contact-block__title">{t.contactPhoneLabel}</p>
                <a href="tel:+79167070210" className="contact-block__phone">{t.footerPhone}</a>
              </div>
            </div>
          </div>
          <div className="contact-block__map-wrap">
            {useYandexMap ? (
              <YandexMapBlock />
            ) : (
              <iframe
                className="contact-block__map"
                src={OSM_EMBED_URL}
                title={t.contactAddress}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
