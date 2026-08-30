import { useEffect, useMemo } from 'react'
import { getRestoplaceIframeSrc } from '../constants'

export default function RestoplaceBookingWidget({ banquet = false, title, fallbackLabel = title }) {
  const iframeSrc = useMemo(() => getRestoplaceIframeSrc({ banquet }), [banquet])

  useEffect(() => {
    const cleanupInjectedRestoplace = () => {
      document.querySelectorAll('#restoplace-wrapper-btn, #restoplace-bg, #restoplace-modal').forEach((node) => {
        node.remove()
      })
      document.body.classList.remove('rp-init')
      document.documentElement.classList.remove('restoplace-modal-open')
      document.body.style.overflow = ''
    }

    cleanupInjectedRestoplace()

    const observer = new MutationObserver(cleanupInjectedRestoplace)
    observer.observe(document.body, { childList: true })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="booking-page__widget">
      <iframe
        className="booking-page__widget-frame"
        src={iframeSrc}
        title={title}
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <a
        className="booking-page__widget-mobile-link"
        href={iframeSrc}
        target="_blank"
        rel="noopener noreferrer"
      >
        {fallbackLabel}
      </a>
    </div>
  )
}
