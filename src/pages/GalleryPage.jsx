import { useEffect, useState } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import PageSection from '../components/PageSection'
import { getAssetUrl } from '../constants'

const GALLERY_FILES = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '6.jpg',
  '7.jpg',
  '8.jpg',
  '9.jpeg',
  '10.jpg',
  '11.webp',
  '12.webp',
  '13.webp',
  '15.webp',
  '16.jpg',
  '17.jpg',
  '18.webp',
  '19.jpg',
  '20.jpg',
  '21.webp',
  '22.webp',
  '23.jpg',
  '24.jpg',
  '24.webp',
  '25.jpg',
  '26.jpg',
  '27.jpg',
  '28.webp',
  '29.webp',
  '30.webp',
  '31.webp',
  '32.webp',
  '33.webp',
  '34.webp',
  '35.webp',
  '36.webp',
  '37.webp',
  '38.webp',
  '39.webp',
  '40.webp',
]

const GALLERY_ITEMS = GALLERY_FILES.map((file) => ({
  src: `/gallery/${file}`,
}))

export default function GalleryPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const [lightboxSrc, setLightboxSrc] = useState(null)

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

  return (
    <main className="main gallery-page">
      <div className="content-column gallery-page__content">
        <PageSection title={t.galleryHeroTitle} intro={t.galleryHeroText} />

        <section className="gallery-page__grid" aria-label={t.galleryHeroTitle}>
          {GALLERY_ITEMS.map((item) => (
            <div key={item.src} className="gallery-page__item">
              <button
                type="button"
                className="gallery-page__item-btn"
                onClick={() => setLightboxSrc(item.src)}
                aria-haspopup="dialog"
              >
                <span className="gallery-page__thumb">
                  <img
                    src={getAssetUrl(item.src)}
                    alt={t.galleryImageAlt}
                    loading="lazy"
                    decoding="async"
                    className="gallery-page__image"
                  />
                </span>
              </button>
            </div>
          ))}
        </section>
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
