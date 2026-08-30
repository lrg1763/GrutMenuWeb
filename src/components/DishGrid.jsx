import { useLangContext } from '../context/LangContext'
import { isBanketMenuDish } from '../constants'
import { translations, getDishName, formatDishWeight } from '../i18n'
import PriceWithRuble from './PriceWithRuble'
import DishPhoto from './DishPhoto'

export default function DishGrid({ dishes, onSelectDish }) {
  const { lang } = useLangContext()
  const t = translations[lang]

  return (
    <div className="dish-grid">
      {dishes.map((dish) => {
        const name = getDishName(dish, lang)
        const weightLine = formatDishWeight(dish, lang)
        const isBanket = isBanketMenuDish(dish)
        return (
          <button
            key={`${dish.sectionId}-${dish.name}`}
            type="button"
            className="dish-card"
            onClick={() => onSelectDish(dish)}
          >
            <DishPhoto
              dish={dish}
              name={name}
              soonLabel={t.comingSoon}
              imageWrapClassName="dish-card__image-wrap"
            />
            <span className="dish-card__name">{name}</span>
            {(isBanket || weightLine || dish.price) && (
              <span
                className={`dish-card__meta-row${isBanket ? ' dish-card__meta-row--invisible' : ''}`}
                aria-hidden={isBanket || undefined}
              >
                {isBanket ? (
                  <>
                    <span className="dish-card__weight-part">000 г</span>
                    <span className="dish-card__meta-sep" aria-hidden="true">·</span>
                    <PriceWithRuble className="dish-card__price" value="0000 ₽" />
                  </>
                ) : (
                  <>
                    {weightLine && <span className="dish-card__weight-part">{weightLine}</span>}
                    {weightLine && dish.price && (
                      <span className="dish-card__meta-sep" aria-hidden="true">·</span>
                    )}
                    {dish.price && (
                      <PriceWithRuble className="dish-card__price" value={dish.price} />
                    )}
                  </>
                )}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
