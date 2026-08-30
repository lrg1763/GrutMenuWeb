import { getDishImageSrc, isBanketSoonPlaceholder, PLACEHOLDER_IMAGE } from '../constants'

export default function DishPhoto({
  dish,
  name,
  soonLabel,
  imageWrapClassName = '',
  imageClassName = 'dish-card__image',
  soonLabelClassName = 'dish-card__soon-label',
}) {
  const showSoonPlaceholder = isBanketSoonPlaceholder(dish)
  const imageSrc = getDishImageSrc(dish)

  return (
    <div className={`${imageWrapClassName}${showSoonPlaceholder ? ' dish-photo__wrap--soon' : ''}`.trim()}>
      {showSoonPlaceholder ? (
        <span className={soonLabelClassName}>{soonLabel}</span>
      ) : (
        <img
          src={imageSrc}
          alt={name}
          className={imageClassName}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = PLACEHOLDER_IMAGE
          }}
        />
      )}
    </div>
  )
}
