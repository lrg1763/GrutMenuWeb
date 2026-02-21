import { useLangContext } from '../context/LangContext'
import { getDishName } from '../i18n'

export default function DishGrid({ dishes, onSelectDish }) {
  const { lang } = useLangContext()

  return (
    <div className="dish-grid">
      {dishes.map((dish) => {
        const name = getDishName(dish, lang)
        return (
          <button
            key={`${dish.sectionId}-${dish.name}`}
            type="button"
            className="dish-card"
            onClick={() => onSelectDish(dish)}
          >
            <div className="dish-card__image-wrap">
              <img
                src={dish.image}
                alt={name}
                className="dish-card__image"
                loading="lazy"
              />
            </div>
            <span className="dish-card__name">{name}</span>
            {dish.price && <span className="dish-card__price">{dish.price}</span>}
          </button>
        )
      })}
    </div>
  )
}
