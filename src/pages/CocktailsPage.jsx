import { useState, useRef, useCallback, useEffect } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { COCKTAILS } from '../data/cocktails'
import { PLACEHOLDER_IMAGE, PDF_MENU_PATH } from '../constants'
import IconArrow from '../components/IconArrow'
import CocktailsCompositionModal from '../components/CocktailsCompositionModal'

const COCKTAILS_COUNT = COCKTAILS.length
/* Клоны для бесконечной прокрутки: [последний, ...все, первый] */
const CAROUSEL_SLIDES = [
  COCKTAILS[COCKTAILS_COUNT - 1],
  ...COCKTAILS,
  COCKTAILS[0],
]
const TRACK_LEN = CAROUSEL_SLIDES.length
const FIRST_REAL_INDEX = 1
const LAST_REAL_INDEX = COCKTAILS_COUNT

const baseUrl = typeof import.meta.env?.BASE_URL === 'string' ? import.meta.env.BASE_URL : '/'

export default function CocktailsPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const [trackIndex, setTrackIndex] = useState(FIRST_REAL_INDEX)
  const [transitionDisabled, setTransitionDisabled] = useState(false)
  const [compositionModal, setCompositionModal] = useState(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const realIndex = trackIndex === 0 ? COCKTAILS_COUNT - 1 : trackIndex === TRACK_LEN - 1 ? 0 : trackIndex - 1

  const goPrev = useCallback(() => {
    setTrackIndex((i) => (i <= FIRST_REAL_INDEX ? 0 : i - 1))
  }, [])
  const goNext = useCallback(() => {
    setTrackIndex((i) => (i >= LAST_REAL_INDEX ? TRACK_LEN - 1 : i + 1))
  }, [])

  const handleTrackTransitionEnd = useCallback(() => {
    if (trackIndex === 0) {
      setTransitionDisabled(true)
      setTrackIndex(LAST_REAL_INDEX)
    } else if (trackIndex === TRACK_LEN - 1) {
      setTransitionDisabled(true)
      setTrackIndex(FIRST_REAL_INDEX)
    }
  }, [trackIndex])

  useEffect(() => {
    if (!transitionDisabled) return
    const id = requestAnimationFrame(() => setTransitionDisabled(false))
    return () => cancelAnimationFrame(id)
  }, [transitionDisabled])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
    const endX = e.changedTouches?.[0]?.clientX ?? touchEndX.current
    const diff = touchStartX.current - endX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  const getName = (cocktail) => {
    if (lang === 'ru') return cocktail.nameRu
    return cocktail.nameEn
  }

  return (
    <main className="main cocktails-page">
      <div className="content-column">
        <div className="cocktails-page__banner">
          <span className="cocktails-page__banner-title cocktails-page__banner-title--desktop">{t.cocktailsOnePrice}</span>
          <span className="cocktails-page__banner-title cocktails-page__banner-title--mobile">{t.cocktailsTitleLine1}</span>
          <span className="cocktails-page__banner-price cocktails-page__banner-price--desktop">{t.cocktailsPriceLabel}{t.cocktailsPrice}</span>
          <span className="cocktails-page__banner-price cocktails-page__banner-price--mobile">{t.cocktailsMobileLine2}</span>
        </div>
        <div
          className="cocktails-carousel"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="cocktails-carousel__arrow-zone">
            <button
              type="button"
              className="cocktails-carousel__arrow cocktails-carousel__arrow--prev"
              onClick={goPrev}
              aria-label={lang === 'ru' ? 'Предыдущий' : 'Previous'}
            >
              <IconArrow dir="left" />
            </button>
            <button
              type="button"
              className="cocktails-carousel__arrow cocktails-carousel__arrow--next"
              onClick={goNext}
              aria-label={lang === 'ru' ? 'Следующий' : 'Next'}
            >
              <IconArrow dir="right" />
            </button>
          </div>
          <div
            className={`cocktails-carousel__track${transitionDisabled ? ' cocktails-carousel__track--no-transition' : ''}`}
            style={{ transform: `translateX(-${trackIndex * 100}%)` }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {CAROUSEL_SLIDES.map((cocktail, i) => (
              <div key={`${cocktail.id}-${i}`} className="cocktails-carousel__slide">
                <div className="cocktails-carousel__image-area">
                  <div className="cocktails-carousel__image-wrap">
                    <img
                      src={`${baseUrl}cocktails/${cocktail.id}.jpg`}
                      alt={getName(cocktail)}
                      className="cocktails-carousel__image"
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cocktails-carousel__footer">
            <button type="button" className="cocktails-carousel__btn cocktails-carousel__btn--counter" aria-live="polite" disabled>
              {realIndex + 1} / {COCKTAILS_COUNT}
            </button>
            <button
                type="button"
                className="cocktails-carousel__btn cocktails-carousel__btn--composition"
                onClick={() => setCompositionModal(COCKTAILS[realIndex])}
              >
                <span className="cocktails-carousel__btn-icon cocktails-carousel__btn-icon--composition" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                </span>
                {t.composition}
              </button>
              <a
                href={PDF_MENU_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="cocktails-carousel__btn cocktails-carousel__btn--download"
              >
                <span className="cocktails-carousel__btn-icon cocktails-carousel__btn-icon--download" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </span>
                {t.cocktailDownload}
              </a>
          </div>
        </div>
      </div>

      {compositionModal && (
        <CocktailsCompositionModal
          cocktailName={getName(compositionModal)}
          composition={compositionModal.composition}
          onClose={() => setCompositionModal(null)}
          t={t}
        />
      )}
    </main>
  )
}
