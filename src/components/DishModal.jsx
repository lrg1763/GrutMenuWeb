import { useEffect } from 'react'
import { useLangContext } from '../context/LangContext'
import { getAssetUrl, PLACEHOLDER_IMAGE } from '../constants'
import { translations, getDishName, getDishDescription } from '../i18n'

export default function DishModal({ dish, onClose }) {
  const { lang } = useLangContext()
  const t = translations[lang]
  const name = getDishName(dish, lang)
  const description = getDishDescription(dish, lang)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.composition}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label={t.close}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="modal__image-wrap">
          <img src={getAssetUrl(dish.image)} alt={name} className="modal__image" onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE }} />
        </div>
        <h2 className="modal__title">{name}</h2>
        {description && (
          <>
            <p className="modal__label">{t.composition}</p>
            <p className="modal__description">{description}</p>
          </>
        )}
        {dish.price && (
          <p className="modal__price">{dish.price}</p>
        )}
      </div>
    </div>
  )
}
