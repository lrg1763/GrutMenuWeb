export const LANG_STORAGE_KEY = 'grut-menu-lang'

export const SUPPORTED_LANGS = ['ru', 'en', 'zh']

export const DEFAULT_MENU = { sections: [], dishes: [] }

const BASE_URL = import.meta.env.BASE_URL

export const MENU_JSON_PATH = `${BASE_URL}menu.json`

export const PDF_MENU_PATH = `${BASE_URL}1%20rus.pdf`

/** For paths that already start with / (e.g. from menu.json) */
export function getAssetUrl(path) {
  if (!path) return path
  if (path.startsWith('/')) return BASE_URL.slice(0, -1) + path
  return BASE_URL + path
}
