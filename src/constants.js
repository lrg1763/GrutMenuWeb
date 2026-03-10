export const LANG_STORAGE_KEY = 'grut-menu-lang'
export const THEME_STORAGE_KEY = 'grut-menu-theme'

export const SUPPORTED_LANGS = ['ru', 'en', 'zh']
export const THEMES = { LIGHT: 'light', DARK: 'dark' }

export const DEFAULT_MENU = { sections: [], dishes: [] }

/** Site nav: path (relative to base) and translation key for label. Home (/) is not in nav — open via logo. */
export const NAV_ROUTES = [
  { path: '/menu', navKey: 'navMenu' },
  { path: '/cocktails', navKey: 'navCocktails' },
]

/** Paths that have a dedicated page component. */
export const ROUTES_WITH_PAGES = new Set([
  '/menu', '/cocktails',
])

const BASE_URL = import.meta.env.BASE_URL

export const MENU_JSON_PATH = `${BASE_URL}menu.json`

export const PDF_MENU_PATH = `${BASE_URL}1%20rus.pdf`

export const PLACEHOLDER_IMAGE = import.meta.env.DEV ? '/images/placeholder.svg' : `${BASE_URL}images/placeholder.svg`

/** For paths that already start with / (e.g. from menu.json). In dev, public is served at root; in prod, we need base. Encodes path so URLs with spaces/Cyrillic work. */
export function getAssetUrl(path) {
  if (!path) return path
  const full = import.meta.env.DEV ? path : (path.startsWith('/') ? BASE_URL.slice(0, -1) + path : BASE_URL + path)
  return encodeURI(full)
}
