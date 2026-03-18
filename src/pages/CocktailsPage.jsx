import { useState } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { COCKTAILS } from '../data/cocktails'
import { PLACEHOLDER_IMAGE } from '../constants'
import CocktailsCompositionModal from '../components/CocktailsCompositionModal'

const baseUrl = typeof import.meta.env?.BASE_URL === 'string' ? import.meta.env.BASE_URL : '/'

export default function CocktailsPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const [compositionModal, setCompositionModal] = useState(null)

  const getName = (cocktail) => (lang === 'ru' ? cocktail.nameRu : cocktail.nameEn)

  return (
    <main className="main cocktails-page">
      <div className="content-column cocktails-page__content">
        <div className="cocktails-page__banner">
          <span className="cocktails-page__banner-title cocktails-page__banner-title--desktop">{t.cocktailsOnePrice}</span>
          <span className="cocktails-page__banner-title cocktails-page__banner-title--mobile">{t.cocktailsTitleLine1}</span>
          <span className="cocktails-page__banner-price cocktails-page__banner-price--desktop">{t.cocktailsPriceLabel}{t.cocktailsPrice}</span>
          <span className="cocktails-page__banner-price cocktails-page__banner-price--mobile">{t.cocktailsMobileLine2}</span>
        </div>
        <ul className="cocktails-grid" aria-label={t.cocktailsOnePrice}>
          {COCKTAILS.map((cocktail) => (
            <li key={cocktail.id} className="cocktails-grid__card">
              <button
                type="button"
                className="cocktails-grid__image-wrap"
                onClick={() => setCompositionModal(cocktail)}
                aria-label={`${getName(cocktail)} — ${t.composition}`}
              >
                <img
                  src={`${baseUrl}cocktail-images/${cocktail.id}.jpg`}
                  alt={getName(cocktail)}
                  className="cocktails-grid__image"
                  loading="lazy"
                  onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE }}
                />
              </button>
            </li>
          ))}
        </ul>
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
