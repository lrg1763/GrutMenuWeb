/**
 * Converts menu.json to English names/descriptions and inverts dishTranslations
 * to be keyed by English name with ru/zh inside.
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { dishTranslations } from '../src/i18n/dishTranslations.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const menuPath = join(root, 'public/menu.json')
const translationsPath = join(root, 'src/i18n/dishTranslations.js')

const menu = JSON.parse(readFileSync(menuPath, 'utf8'))

// Map (sectionId, ruName) -> description from current menu
const descByRu = {}
for (const d of menu.dishes) {
  if (!descByRu[d.sectionId]) descByRu[d.sectionId] = {}
  descByRu[d.sectionId][d.name] = d.description || ''
}

// New menu: each dish gets English name and description from translations
const newDishes = []
for (const d of menu.dishes) {
  const section = dishTranslations[d.sectionId]
  const tr = section?.[d.name]
  const enName = tr?.name?.en ?? d.name
  const enDesc = tr?.description?.en ?? (d.description || '')
  newDishes.push({ ...d, name: enName, description: enDesc })
}

// New translations: keyed by English name, value = { name: { ru, zh }, description: { ru, zh } }
const newTranslations = {}
for (const [sectionId, section] of Object.entries(dishTranslations)) {
  newTranslations[sectionId] = {}
  for (const [ruName, tr] of Object.entries(section)) {
    const enName = tr.name.en
    const ruDesc = (descByRu[sectionId] && descByRu[sectionId][ruName]) || ''
    newTranslations[sectionId][enName] = {
      name: { ru: ruName, zh: tr.name.zh },
      description: { ru: ruDesc, zh: tr.description?.zh ?? '' }
    }
  }
}

// Write new menu.json
writeFileSync(menuPath, JSON.stringify({ ...menu, dishes: newDishes }, null, 2) + '\n', 'utf8')

// Build new dishTranslations.js content
const header = `/**
 * Dish name and description translations by sectionId and English name.
 * Keys: sectionId -> dish name (en) -> { name: { ru, zh }, description: { ru, zh } }
 */
export const dishTranslations = `
function stringifyObj(obj, indent = 2) {
  const pad = ' '.repeat(indent)
  const lines = []
  for (const [k, v] of Object.entries(obj)) {
    const key = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : JSON.stringify(k)
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      if (v.ru !== undefined || v.zh !== undefined) {
        const ru = (v.ru ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
        const zh = (v.zh ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
        lines.push(`${pad}${key}: { ru: '${ru}', zh: '${zh}' },`)
      } else {
        lines.push(`${pad}${key}: {`)
        for (const [k2, v2] of Object.entries(v)) {
          const key2 = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k2) ? k2 : JSON.stringify(k2)
          const inner = stringifyEntry(v2)
          lines.push(`${pad}  ${key2}: ${inner},`)
        }
        lines.push(`${pad}},`)
      }
    }
  }
  return lines.join('\n')
}

function stringifyEntry(entry) {
  if (typeof entry !== 'object' || entry === null) return JSON.stringify(entry)
  const parts = []
  for (const [k, v] of Object.entries(entry)) {
    const s = typeof v === 'string' ? v.replace(/\\/g, '\\\\').replace(/'/g, "\\'") : JSON.stringify(v)
    parts.push(`${k}: '${s}'`)
  }
  return `{ ${parts.join(', ')} }`
}

const sectionsOut = []
for (const [sectionId, section] of Object.entries(newTranslations)) {
  const entries = []
  for (const [enName, tr] of Object.entries(section)) {
    const nameRu = (tr.name.ru ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    const nameZh = (tr.name.zh ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    const descRu = (tr.description.ru ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    const descZh = (tr.description.zh ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    entries.push(`    '${enName.replace(/'/g, "\\'")}': { name: { ru: '${nameRu}', zh: '${nameZh}' }, description: { ru: '${descRu}', zh: '${descZh}' } },`)
  }
  sectionsOut.push(`  ${sectionId}: {\n${entries.join('\n')}\n  }`)
}

const body = sectionsOut.join(',\n')
const footerNoBrace = `

export function getDishName(dish, lang) {
  if (lang === 'en') return dish.name
  const section = dishTranslations[dish.sectionId]
  if (!section) return dish.name
  const tr = section[dish.name]
  if (!tr?.name) return dish.name
  return tr.name[lang] || dish.name
}

export function getDishDescription(dish, lang) {
  const desc = dish.description || ''
  if (lang === 'en') return desc
  const section = dishTranslations[dish.sectionId]
  if (!section) return desc
  const tr = section[dish.name]
  if (!tr?.description) return desc
  return tr.description[lang] || desc
}
`
writeFileSync(translationsPath, header + '{\n' + body + '\n}' + footerNoBrace, 'utf8')

console.log('Done: menu.json and dishTranslations.js updated for English as primary.')
