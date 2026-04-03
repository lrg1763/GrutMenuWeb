const RUBLE = '\u20BD'

/**
 * Рендер цены из строки вида «1300 ₽»: число остаётся в основном шрифте,
 * знак ₽ — в Noto Sans (см. .currency-ruble), чтобы глиф был корректным.
 */
export default function PriceWithRuble({ value, as: Comp = 'span', className, ...rest }) {
  const str = value == null ? '' : String(value)
  const i = str.lastIndexOf(RUBLE)
  if (i === -1) {
    return (
      <Comp className={className} {...rest}>
        {str}
      </Comp>
    )
  }
  return (
    <Comp className={className} {...rest}>
      {str.slice(0, i)}
      <span className="currency-ruble">{RUBLE}</span>
      {str.slice(i + 1)}
    </Comp>
  )
}
