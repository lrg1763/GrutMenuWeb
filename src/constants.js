export const LANG_STORAGE_KEY = 'grut-menu-lang'

export const SUPPORTED_LANGS = ['ru', 'en']

export const DEFAULT_MENU = { sections: [], dishes: [] }

/** Section id (from menu.json) → English URL hash slug. Used so browser URL shows English, e.g. #fish-seafood */
export const SECTION_ID_TO_SLUG = {
  zacuski: 'appetizers',
  zacuski_kompaniya: 'appetizers-party',
  salaty: 'salads',
  supy: 'soups',
  grill: 'grill',
  pasta: 'pasta',
  myaso_ptica: 'meat-poultry',
  ryba_moreprodukty: 'fish-seafood',
  garniry: 'sides',
  sousy: 'sauces',
  deserty: 'desserts',
  k_pivu: 'beer-snacks',
  hleb: 'bread',
  detskoe: 'kids',
}

/** English slug → section id (for reading hash). */
export const SECTION_SLUG_TO_ID = Object.fromEntries(
  Object.entries(SECTION_ID_TO_SLUG).map(([id, slug]) => [slug, id])
)

/** Веб-чат / профиль MAX по умолчанию, если в `.env` не задана своя ссылка. */
const MAX_SOCIAL_URL_FALLBACK = 'https://web.max.ru/227198815'

/** Ссылка для плавающей кнопки MAX: `VITE_MAX_SOCIAL_URL` из `.env` или веб-версия чата. */
export const MAX_SOCIAL_URL =
  String(import.meta.env.VITE_MAX_SOCIAL_URL ?? '').trim() || MAX_SOCIAL_URL_FALLBACK

/**
 * Публичный URL сайта без завершающего слэша (например https://грют.москва).
 * `VITE_SITE_URL` в `.env` — для canonical и og:url в продакшене; локально можно не задавать.
 */
export const SITE_PUBLIC_ORIGIN = String(import.meta.env.VITE_SITE_URL ?? '')
  .trim()
  .replace(/\/$/, '')

const BASE_URL = import.meta.env.BASE_URL

export const MENU_JSON_PATH = `${BASE_URL}menu.json`

/** Пути к PDF меню для модалки выбора / просмотра */
export const PDF_MENU_MAIN_RU = `${BASE_URL}grut-menu-main-ru.pdf`
export const PDF_MENU_MAIN_EN = `${BASE_URL}grut-menu-main-en.pdf`
export const PDF_MENU_COCKTAIL = `${BASE_URL}grut-menu-cocktails.pdf`
export const PDF_MENU_KIDS = `${BASE_URL}grut-menu-kids.pdf`

/** Имена файлов при скачивании (атрибут download) */
export const PDF_MENU_DOWNLOAD_NAME_MAIN_RU = 'GRUT-menu-main-RU.pdf'
export const PDF_MENU_DOWNLOAD_NAME_MAIN_EN = 'GRUT-menu-main-EN.pdf'
export const PDF_MENU_DOWNLOAD_NAME_COCKTAIL = 'GRUT-menu-cocktails.pdf'
export const PDF_MENU_DOWNLOAD_NAME_KIDS = 'GRUT-menu-kids.pdf'

export const PLACEHOLDER_IMAGE = import.meta.env.DEV ? '/images/placeholder.svg' : `${BASE_URL}images/placeholder.svg`

/** Верх страницы «О нас»: фото интерьера справа от вводного текста (десктоп). */
export const ABOUT_INTRO_SIDE_IMAGE = '/about/about-intro-interior.png'

/** «Место, куда хочется вернуться» on About — только фото, порядок по имени файла. */
export const ABOUT_WHY_IMAGES = [
  '/about/why/why-1.png',
  '/about/why/why-2.png',
  '/about/why/why-3.png',
  '/about/why/why-4.png',
  '/about/why/why-5.png',
  '/about/why/why-6.png',
]

/** «Наши залы» on About (order matches aboutHallPhotos). */
export const ABOUT_HALL_IMAGES = ['/about/halls/hall-main.png', '/about/halls/hall-veranda.png']

/** Те же залы — макеты для узкой ширины (< 640px), порядок как у ABOUT_HALL_IMAGES. */
export const ABOUT_HALL_IMAGES_MOBILE = [
  '/about/halls/hall-main-mobile.png',
  '/about/halls/hall-veranda-mobile.png',
]

/** Страница «События» — фото для ширины > 768px. */
export const EVENTS_PAGE_IMAGES = ['/events/event-1.png', '/events/event-2.png', '/events/event-3.png']

/** Страница «События» — три карточки-макета только для мобилки (≤768px). Порядок: 1/3, 2/3, 3/3. */
export const EVENTS_PAGE_IMAGES_MOBILE = [
  '/events/event-mobile-1.png',
  '/events/event-mobile-2.png',
  '/events/event-mobile-3.png',
]

/** «Банкет в GRUT — это удобно» (sorted filenames from Desktop/Банкеты). */
export const BANQUETS_CONVENIENCE_IMAGES = [
  '/banquets/convenience/convenience-1.png',
  '/banquets/convenience/convenience-2.png',
  '/banquets/convenience/convenience-3.png',
  '/banquets/convenience/convenience-4.png',
  '/banquets/convenience/convenience-5.png',
  '/banquets/convenience/convenience-6.png',
]

/** For paths that already start with / (e.g. from menu.json). In dev, public is served at root; in prod, we need base. Encodes path so URLs with spaces/Cyrillic work. */
export function getAssetUrl(path) {
  if (!path) return path
  const full = import.meta.env.DEV ? path : (path.startsWith('/') ? BASE_URL.slice(0, -1) + path : BASE_URL + path)
  return encodeURI(full)
}
