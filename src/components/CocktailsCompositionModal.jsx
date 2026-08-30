import { formatCocktailVolume, parseComposition } from '../utils/cocktailComposition'

export default function CocktailsCompositionModal({ cocktailName, composition, volumeMl, onClose, t, lang = 'ru' }) {
  const { ingredients, garnish, totalMl } = parseComposition(composition)
  const displayMl = volumeMl ?? totalMl

  return (
    <div
      className="cocktails-composition-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="cocktails-composition-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cocktails-composition-title"
      >
        <button
          type="button"
          className="cocktails-composition-modal__close"
          onClick={onClose}
          aria-label={t.close}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h2 id="cocktails-composition-title" className="cocktails-composition-modal__title">
          {cocktailName}
        </h2>
        {(ingredients.length > 0 || garnish) ? (
          <ul className="cocktails-composition-modal__list">
            {ingredients.map((item, i) => (
              <li key={i} className="cocktails-composition-modal__item">{item}</li>
            ))}
            {garnish && (
              <li className="cocktails-composition-modal__item">
                {t.garnishLabel}: {garnish}
              </li>
            )}
          </ul>
        ) : (
          <p className="cocktails-composition-modal__text">{composition}</p>
        )}
        {displayMl > 0 && (
          <p className="cocktails-composition-modal__volume">
            {t.volumeLabel}: {formatCocktailVolume(displayMl, lang)}
          </p>
        )}
      </div>
    </div>
  )
}
