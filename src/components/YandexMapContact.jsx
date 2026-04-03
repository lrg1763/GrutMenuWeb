import { useEffect, useRef } from 'react'

const YANDEX_MAPS_API_KEY_RAW = import.meta.env.VITE_YANDEX_MAPS_API_KEY
const YANDEX_MAPS_API_KEY =
  typeof YANDEX_MAPS_API_KEY_RAW === 'string' ? YANDEX_MAPS_API_KEY_RAW.trim() : ''

export const isYandexMapsConfigured = Boolean(YANDEX_MAPS_API_KEY)

/* Отель Милан, Шипиловская 28А, Москва */
const HOTEL_MILAN_LNG = 37.71515
const HOTEL_MILAN_LAT = 55.61875

/** Fallback: OpenStreetMap, если API-ключ Яндекса не задан */
export const OSM_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=37.706%2C55.612%2C37.724%2C55.626&layer=mapnik&marker=55.61875%2C37.71515'

const MARKER_LABEL = 'ул. Шипиловская, 28A'

function showOsmFallback(container) {
  if (!container) return
  container.innerHTML = ''
  const iframe = document.createElement('iframe')
  iframe.className = 'contacts-page__map'
  iframe.src = OSM_EMBED_URL
  iframe.title = MARKER_LABEL
  iframe.setAttribute('loading', 'lazy')
  container.appendChild(iframe)
}

export function YandexMapBlock({ mapLang }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!YANDEX_MAPS_API_KEY) return undefined

    let cancelled = false
    let containerRafId = 0
    let ymapsPollRafId = 0
    let containerAttempts = 0
    const scriptId = 'yandex-maps-api-v3'
    const maxContainerRaf = 48
    const ymapsWaitMs = 12000

    const buildSrc = (lang) =>
      `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(YANDEX_MAPS_API_KEY)}&lang=${encodeURIComponent(lang)}`

    function destroyMap() {
      if (mapRef.current?.destroy) mapRef.current.destroy()
      mapRef.current = null
    }

    function initMap() {
      const el = containerRef.current
      if (!el || cancelled) return
      if (!window.ymaps3) return

      destroyMap()

      window.ymaps3.ready
        .then(() => {
          if (cancelled || !containerRef.current) return
          const container = containerRef.current
          try {
            const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = window.ymaps3
            const map = new YMap(
              container,
              {
                location: { center: [HOTEL_MILAN_LNG, HOTEL_MILAN_LAT], zoom: 17 },
                showScaleInCopyrights: true,
              },
              [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})],
            )
            mapRef.current = map

            const markerEl = document.createElement('div')
            markerEl.textContent = MARKER_LABEL
            markerEl.style.cssText =
              'padding: 6px 10px; background: #1a1a1a; color: #fff; font-size: 12px; line-height: 1.3; border-radius: 4px; white-space: nowrap; max-width: 220px; overflow: hidden; text-overflow: ellipsis;'
            const marker = new YMapMarker({ coordinates: [HOTEL_MILAN_LNG, HOTEL_MILAN_LAT] }, markerEl)
            map.addChild(marker)
          } catch (err) {
            console.error('Yandex Map init error:', err)
            showOsmFallback(container)
          }
        })
        .catch((err) => {
          console.error('Yandex Map ready error:', err)
          if (!cancelled && containerRef.current) showOsmFallback(containerRef.current)
        })
    }

    function scheduleInit() {
      queueMicrotask(() => initMap())
    }

    /** Событие load у script срабатывает раньше, чем в window появляется ymaps3 — ждём через rAF. */
    function waitForYmaps3ThenSchedule() {
      const started = performance.now()
      function tick() {
        if (cancelled) return
        if (window.ymaps3) {
          scheduleInit()
          return
        }
        if (performance.now() - started > ymapsWaitMs) {
          if (containerRef.current) showOsmFallback(containerRef.current)
          return
        }
        ymapsPollRafId = requestAnimationFrame(tick)
      }
      tick()
    }

    function ensureScriptAndInit() {
      if (cancelled) return

      const container = containerRef.current
      if (!container) {
        containerAttempts += 1
        if (containerAttempts <= maxContainerRaf) {
          containerRafId = requestAnimationFrame(ensureScriptAndInit)
        }
        return
      }

      let scriptEl = document.getElementById(scriptId)

      const scriptLangAttr = scriptEl?.dataset?.mapLang
      const effectiveScriptLang = scriptLangAttr || 'ru_RU'
      if (scriptEl && effectiveScriptLang !== mapLang) {
        scriptEl.remove()
        try {
          delete window.ymaps3
        } catch {
          window.ymaps3 = undefined
        }
        scriptEl = null
      } else if (scriptEl && !scriptLangAttr) {
        scriptEl.dataset.mapLang = effectiveScriptLang
      }

      if (!scriptEl) {
        const script = document.createElement('script')
        script.id = scriptId
        script.dataset.mapLang = mapLang
        script.src = buildSrc(mapLang)
        script.async = true
        script.onload = () => {
          if (!cancelled) waitForYmaps3ThenSchedule()
        }
        script.onerror = () => {
          if (!cancelled) showOsmFallback(containerRef.current)
        }
        document.head.appendChild(script)
        return
      }

      if (window.ymaps3) {
        scheduleInit()
      } else {
        waitForYmaps3ThenSchedule()
      }
    }

    ensureScriptAndInit()

    return () => {
      cancelled = true
      cancelAnimationFrame(containerRafId)
      cancelAnimationFrame(ymapsPollRafId)
      destroyMap()
    }
  }, [mapLang])

  return <div ref={containerRef} id="yandex-map-contact" className="contacts-page__map" aria-label={`Карта: ${MARKER_LABEL}`} />
}
