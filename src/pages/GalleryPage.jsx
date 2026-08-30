import { useCallback, useEffect, useRef, useState } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import PageSection from '../components/PageSection'
import { getAssetUrl } from '../constants'

const GALLERY_COUNT = 62

const GALLERY_ITEMS = Array.from({ length: GALLERY_COUNT }, (_, index) => ({
  src: `/gallery/${index + 1}.webp`,
  index,
}))

export default function GalleryPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [isGalleryLoading, setIsGalleryLoading] = useState(true)
  const loadedIndicesRef = useRef(new Set())

  const markImageLoaded = useCallback((index) => {
    if (loadedIndicesRef.current.has(index)) return
    loadedIndicesRef.current.add(index)
    if (loadedIndicesRef.current.size >= GALLERY_COUNT) {
      setIsGalleryLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!lightboxSrc) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxSrc(null)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxSrc])

  const bindGalleryImage = useCallback((index) => (node) => {
    if (!node) return
    if (node.complete) {
      markImageLoaded(index)
    }
  }, [markImageLoaded])

  return (
    <main className="main gallery-page">
      <div className="content-column gallery-page__content">
        <PageSection title={t.galleryHeroTitle} intro={t.galleryHeroText} />

        <div className="gallery-page__grid-wrap">
          {isGalleryLoading && (
            <div
              className="gallery-page__loading"
              role="status"
              aria-live="polite"
              aria-busy="true"
              aria-label={t.galleryLoading}
            >
              <span className="gallery-page__spinner" aria-hidden="true" />
            </div>
          )}

          <section
            className={`gallery-page__grid${isGalleryLoading ? ' gallery-page__grid--loading' : ''}`}
            aria-label={t.galleryHeroTitle}
            aria-busy={isGalleryLoading}
          >
            {GALLERY_ITEMS.map((item) => (
              <div key={item.src} className="gallery-page__item">
                <button
                  type="button"
                  className="gallery-page__item-btn"
                  onClick={() => setLightboxSrc(item.src)}
                  aria-haspopup="dialog"
                  tabIndex={isGalleryLoading ? -1 : 0}
                >
                  <span className="gallery-page__thumb">
                    <img
                      ref={bindGalleryImage(item.index)}
                      src={getAssetUrl(item.src)}
                      alt={t.galleryImageAlt}
                      loading="eager"
                      decoding="async"
                      className="gallery-page__image"
                      onLoad={() => markImageLoaded(item.index)}
                      onError={() => markImageLoaded(item.index)}
                    />
                  </span>
                </button>
              </div>
            ))}
          </section>
        </div>
      </div>

      {lightboxSrc && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t.galleryImageAlt}
          onClick={() => setLightboxSrc(null)}
        >
          <div
            className="gallery-lightbox__inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={() => setLightboxSrc(null)}
              aria-label={t.close}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img
              src={getAssetUrl(lightboxSrc)}
              alt={t.galleryImageAlt}
              className="gallery-lightbox__img"
              decoding="async"
            />
          </div>
        </div>
      )}
    </main>
  )
}
