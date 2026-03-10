import { useState, useRef, useCallback, useEffect } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { COCKTAILS } from '../data/cocktails'
import { PLACEHOLDER_IMAGE, PDF_MENU_PATH } from '../constants'

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
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  const getName = (cocktail) => {
    if (lang === 'ru') return cocktail.nameRu
    if (lang === 'zh') return cocktail.nameZh
    return cocktail.nameEn
  }

  return (
    <main className="main cocktails-page">
      <div className="content-column">
        <p className="cocktails-page__banner">{t.cocktailsOnePrice}</p>
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
              aria-label={lang === 'ru' ? 'Предыдущий' : lang === 'zh' ? '上一个' : 'Previous'}
            >
              <ArrowIcon dir="left" />
            </button>
            <button
              type="button"
              className="cocktails-carousel__arrow cocktails-carousel__arrow--next"
              onClick={goNext}
              aria-label={lang === 'ru' ? 'Следующий' : lang === 'zh' ? '下一个' : 'Next'}
            >
              <ArrowIcon dir="right" />
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
                      src={`${baseUrl}images/cocktails/${cocktail.id}.jpg`}
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
            <button
              type="button"
              className="cocktails-carousel__btn cocktails-carousel__btn--composition"
              onClick={() => setCompositionModal(COCKTAILS[realIndex])}
            >
              {t.composition}
            </button>
            <div className="cocktails-carousel__counter-wrap">
              <div className="cocktails-carousel__counter" aria-live="polite">
                {realIndex + 1} / {COCKTAILS_COUNT}
              </div>
            </div>
            <a
              href={PDF_MENU_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="cocktails-carousel__btn cocktails-carousel__btn--download"
            >
              {t.cocktailDownload}
            </a>
          </div>
        </div>
      </div>

      {compositionModal && (
        <div
          className="cocktails-composition-backdrop"
          onClick={() => setCompositionModal(null)}
          role="presentation"
        >
          <div
            className="cocktails-composition-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cocktails-composition-title"
          >
            <h2 id="cocktails-composition-title" className="cocktails-composition-modal__title">
              {getName(compositionModal)}
            </h2>
            <p className="cocktails-composition-modal__text">{compositionModal.composition}</p>
            <button
              type="button"
              className="cocktails-composition-modal__close"
              onClick={() => setCompositionModal(null)}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function ArrowIcon({ dir }) {
  const isLeft = dir === 'left'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="butt" strokeLinejoin="miter">
      {isLeft ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  )
}
