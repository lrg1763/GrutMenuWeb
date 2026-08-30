const DECIMAL_COMMA_PLACEHOLDER = '\uE000'

export function parseComposition(composition) {
  if (!composition) return { ingredients: [], garnish: '', totalMl: 0 }
  const garnishMatch = composition.match(/(?:Украшение|Garnish):\s*([^.]+)/i)
  const beforeGarnish = garnishMatch ? composition.split(/(?:Украшение|Garnish):/i)[0] : composition
  const garnish = garnishMatch ? garnishMatch[1].trim().replace(/\.$/, '') : ''
  const beforeSplit = beforeGarnish.replace(/(\d),(\d)/g, `$1${DECIMAL_COMMA_PLACEHOLDER}$2`)
  const ingredientParts = beforeSplit
    .split(/,\s*/)
    .map((s) => s.trim().replace(/\.$/, '').replaceAll(DECIMAL_COMMA_PLACEHOLDER, ','))
    .filter(Boolean)
  const ingredients = ingredientParts.map((s) => {
    const cleaned = s.replace(/^\s*[•\-]\s*/, '').trim()
    return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : ''
  }).filter(Boolean)
  const mlMatches = composition.matchAll(/(\d+)\s*(?:мл|ml)/gi)
  const totalMl = [...mlMatches].reduce((sum, m) => sum + parseInt(m[1], 10), 0)
  return { ingredients, garnish, totalMl }
}

export function formatCocktailVolume(totalMl, lang) {
  if (!totalMl) return null
  return lang === 'en' ? `${totalMl} ml` : `${totalMl} мл`
}
