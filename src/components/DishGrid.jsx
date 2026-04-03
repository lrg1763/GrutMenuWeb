import { useLangContext } from '../context/LangContext'
import { getAssetUrl, PLACEHOLDER_IMAGE } from '../constants'
import { getDishName, formatDishWeight } from '../i18n'
import PriceWithRuble from './PriceWithRuble'

export default function DishGrid({ dishes, onSelectDish }) {
  const { lang } = useLangContext()

  return (
    <div className="dish-grid">
      {dishes.map((dish) => {
        const name = getDishName(dish, lang)
        const weightLine = formatDishWeight(dish, lang)
        return (
          <button
            key={`${dish.sectionId}-${dish.name}`}
            type="button"
            className="dish-card"
            onClick={() => onSelectDish(dish)}
          >
            <div className="dish-card__image-wrap">
              <img
                src={getAssetUrl(dish.image)}
                alt={name}
                className="dish-card__image"
                loading="lazy"
                onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE }}
              />
            </div>
            <span className="dish-card__name">{name}</span>
            {(weightLine || dish.price) && (
              <span className="dish-card__meta-row">
                {weightLine && <span className="dish-card__weight-part">{weightLine}</span>}
                {weightLine && dish.price && (
                  <span className="dish-card__meta-sep" aria-hidden="true">·</span>
                )}
                {dish.price && (
                  <PriceWithRuble className="dish-card__price" value={dish.price} />
                )}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
