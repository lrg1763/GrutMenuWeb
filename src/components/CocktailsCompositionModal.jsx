function parseComposition(composition) {
  if (!composition) return { ingredients: [], garnish: '', totalMl: 0 }
  const garnishMatch = composition.match(/Украшение:\s*([^.]+)/i)
  const beforeGarnish = garnishMatch ? composition.split(/Украшение:/i)[0] : composition
  const garnish = garnishMatch ? garnishMatch[1].trim().replace(/\.$/, '') : ''
  const ingredientParts = beforeGarnish.split(/,\s*/).map((s) => s.trim().replace(/\.$/, '')).filter(Boolean)
  const ingredients = ingredientParts.map((s) => {
    const cleaned = s.replace(/^\s*[•\-]\s*/, '').trim()
    return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : ''
  }).filter(Boolean)
  const mlMatches = composition.matchAll(/(\d+)\s*мл/gi)
  const totalMl = [...mlMatches].reduce((sum, m) => sum + parseInt(m[1], 10), 0)
  return { ingredients, garnish, totalMl }
}

export default function CocktailsCompositionModal({ cocktailName, composition, onClose, t }) {
  const { ingredients, garnish, totalMl } = parseComposition(composition)

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
        {totalMl > 0 && (
          <p className="cocktails-composition-modal__volume">
            {t.volumeLabel}: {totalMl} мл
          </p>
        )}
      </div>
    </div>
  )
}
