import { useEffect } from 'react'
import { useLangContext } from '../context/LangContext'
import { getAssetUrl, getBanquetZonePhotoSlots } from '../constants'
import { translations } from '../i18n'

export default function BanquetZoneModal({ zone, onClose }) {
  const { lang } = useLangContext()
  const t = translations[lang]
  const photos = getBanquetZonePhotoSlots(zone?.images)

  useEffect(() => {
    if (!zone) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [zone, onClose])

  if (!zone) return null

  const zoneTitle = t.banquetsZoneTitle.replace('{n}', zone.id)

  return (
    <div
      className="banquet-zone-modal"
      role="dialog"
      aria-modal="true"
      aria-label={zoneTitle}
      onClick={onClose}
    >
      <div className="banquet-zone-modal__panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="banquet-zone-modal__close"
          onClick={onClose}
          aria-label={t.close}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="banquet-zone-modal__mosaic">
          {photos.map((src, index) => (
            <div
              key={`${zone.id}-${index}`}
              className={`banquet-zone-modal__tile banquet-zone-modal__tile--${index + 1}`}
            >
              {src ? (
                <img
                  className="banquet-zone-modal__photo"
                  src={getAssetUrl(src)}
                  alt={`${zoneTitle} — ${index + 1}`}
                  decoding="async"
                />
              ) : (
                <div className="banquet-zone-modal__soon">
                  <span className="banquet-zone-modal__soon-label">{t.comingSoon}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
