export const LANG_STORAGE_KEY = 'grut-menu-lang'

export const SUPPORTED_LANGS = ['ru', 'en']

export const DEFAULT_MENU = { sections: [], dishes: [] }

/** Sections without dishes yet — show a placeholder instead of the dish grid. */
export const COMING_SOON_SECTION_IDS = []

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
  banket: 'banquet',
}

export const BANKET_SECTION_ID = 'banket'

export function isBanketMenuDish(dish) {
  return dish?.sectionId === BANKET_SECTION_ID
}

export function isBanketSoonPlaceholder(dish) {
  return isBanketMenuDish(dish) && !dish?.image
}

export function getDishImageSrc(dish) {
  if (isBanketMenuDish(dish)) {
    return dish.image ? getAssetUrl(dish.image) : null
  }
  return getAssetUrl(dish.image)
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

/** Яндекс.Метрика (тот же счётчик, что в index.html). */
export const YANDEX_METRIKA_COUNTER_ID = 108696022

const BASE_URL = import.meta.env.BASE_URL

export const MENU_JSON_PATH = `${BASE_URL}menu.json`

/** Пути к PDF меню для страницы скачивания */
export const PDF_MENU_MAIN_RU = `${BASE_URL}grut-menu-main-ru.pdf`
export const PDF_MENU_MAIN_EN = `${BASE_URL}grut-menu-main-en.pdf`
export const PDF_MENU_COCKTAIL = `${BASE_URL}grut-menu-cocktails.pdf`
export const PDF_MENU_KIDS = `${BASE_URL}grut-menu-kids.pdf`

export const PLACEHOLDER_IMAGE = import.meta.env.DEV ? '/images/placeholder.svg' : `${BASE_URL}images/placeholder.svg`

/** Restoplace — онлайн-бронирование */
export const RESTOPLACE_WIDGET_HASH = 'b06dc447b3f5f237e3fd'
export const RESTOPLACE_WIDGET_SCRIPT_URL = `https://app.restoplace.cc/widget.js?h=${RESTOPLACE_WIDGET_HASH}`

export function getRestoplaceIframeSrc({ banquet = false } = {}) {
  const params = new URLSearchParams({
    address: RESTOPLACE_WIDGET_HASH,
    iframe: '1',
    source: typeof window !== 'undefined' ? window.location.hostname : 'grut.moscow',
  })
  if (banquet) params.set('banquet', '1')
  return `https://www.restoplace.ws/?${params.toString()}`
}

export function loadRestoplaceWidgetScript() {
  if (typeof document === 'undefined') return
  if (document.querySelector('script[data-restoplace-widget]')) return
  const script = document.createElement('script')
  script.src = RESTOPLACE_WIDGET_SCRIPT_URL
  script.async = true
  script.dataset.restoplaceWidget = 'true'
  document.body.appendChild(script)
}

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
export const ABOUT_HALL_IMAGES = ['/about/halls/hall-main.webp', '/about/halls/hall-veranda.webp']

/** Те же залы — макеты для узкой ширины (< 640px), порядок как у ABOUT_HALL_IMAGES. */
export const ABOUT_HALL_IMAGES_MOBILE = [
  '/about/halls/hall-main.webp',
  '/about/halls/hall-veranda.webp',
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

/** Банкетные зоны на странице «Банкеты» — до 3 фото на зону. */
export const BANQUET_ZONES = [
  {
    id: '60',
    images: [
      '/banquets/zones/zone-60/65.webp',
      '/banquets/zones/zone-60/68.webp',
      '/banquets/zones/zone-60/69.webp',
    ],
  },
  {
    id: '70',
    images: [
      '/banquets/zones/zone-70/57.webp',
      '/banquets/zones/zone-70/58.webp',
      '/banquets/zones/zone-70/71.webp',
    ],
  },
  {
    id: '5',
    images: [
      '/banquets/zones/zone-5/48.webp',
      '/banquets/zones/zone-5/53.webp',
      '/banquets/zones/zone-5/54.webp',
    ],
  },
]

export function getBanquetZonePhotoSlots(images) {
  const slots = (images ?? []).slice(0, 3)
  while (slots.length < 3) slots.push(null)
  return slots
}

/** For paths that already start with / (e.g. from menu.json). In dev, public is served at root; in prod, we need base. Encodes path so URLs with spaces/Cyrillic work. */
export function getAssetUrl(path) {
  if (!path) return path
  const full = import.meta.env.DEV ? path : (path.startsWith('/') ? BASE_URL.slice(0, -1) + path : BASE_URL + path)
  return encodeURI(full)
}
