import { useState } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { COCKTAILS } from '../data/cocktails'
import { PLACEHOLDER_IMAGE } from '../constants'
import CocktailsCompositionModal from '../components/CocktailsCompositionModal'
import PageSection from '../components/PageSection'
import PriceWithRuble from '../components/PriceWithRuble'
import { formatCocktailVolume, parseComposition } from '../utils/cocktailComposition'

const baseUrl = typeof import.meta.env?.BASE_URL === 'string' ? import.meta.env.BASE_URL : '/'

export default function CocktailsPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const [compositionModal, setCompositionModal] = useState(null)

  const getName = (cocktail) => (lang === 'ru' ? cocktail.nameRu : cocktail.nameEn)
  const getComposition = (cocktail) => (lang === 'ru' ? cocktail.compositionRu : cocktail.compositionEn)

  return (
    <main className="main cocktails-page">
      <div className="content-column cocktails-page__content">
        <PageSection className="cocktails-page__hero">
          <div className="cocktails-page__hero-box" aria-label={t.cocktailsHeroAria}>
            <p className="cocktails-page__hero-title">{t.cocktailsHeroTitle}</p>
            <PriceWithRuble as="p" className="cocktails-page__hero-price" value={t.cocktailsHeroPriceIntro} />
          </div>
          <div className="cocktails-page__photos-box">
            <ul className="cocktails-grid" aria-label={t.cocktailsOnePrice}>
              {COCKTAILS.map((cocktail) => {
                const composition = getComposition(cocktail)
                const { totalMl } = parseComposition(composition)
                const volumeMl = cocktail.volumeMl ?? totalMl
                const volumeLabel = formatCocktailVolume(volumeMl, lang)
                const name = getName(cocktail)

                return (
                  <li key={cocktail.id} className="cocktails-grid__card">
                    <button
                      type="button"
                      className="cocktails-grid__image-wrap"
                      onClick={() => setCompositionModal(cocktail)}
                      aria-label={`${name} — ${t.composition}`}
                    >
                      <img
                        src={`${baseUrl}cocktail-images/${cocktail.id}.webp`}
                        alt=""
                        className="cocktails-grid__image"
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE }}
                      />
                    </button>
                    <div className="cocktails-grid__caption">
                      <span className="cocktails-grid__caption-name">{name}</span>
                      {volumeLabel && (
                        <span className="cocktails-grid__caption-volume">{volumeLabel}</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </PageSection>
      </div>

      {compositionModal && (
        <CocktailsCompositionModal
          cocktailName={getName(compositionModal)}
          composition={getComposition(compositionModal)}
          volumeMl={compositionModal.volumeMl}
          onClose={() => setCompositionModal(null)}
          t={t}
          lang={lang}
        />
      )}
    </main>
  )
}
