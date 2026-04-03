/** Пакет MAX в Google Play — для Intent, по смыслу как переход t.me → приложение Telegram. */
const MAX_MESSENGER_PACKAGE = 'ru.oneme.app'

/** Ссылки max.ru / web.max.ru — для Intent и target _self на iOS. */
export function isMaxMessengerHttpsUrl(httpsUrl) {
  if (typeof httpsUrl !== 'string' || !httpsUrl.startsWith('https://')) return false
  try {
    const { hostname } = new URL(httpsUrl)
    return hostname === 'max.ru' || hostname === 'web.max.ru'
  } catch {
    return false
  }
}

/**
 * intent:// для Android: открыть ссылку MAX в приложении ru.oneme.app, иначе браузер (S.browser_fallback_url).
 * @param {string} httpsUrl
 * @returns {string|null}
 */
export function getMaxMessengerAndroidIntent(httpsUrl) {
  if (!isMaxMessengerHttpsUrl(httpsUrl)) {
    return null
  }
  try {
    const parsed = new URL(httpsUrl)
    const hostPathQuery = `${parsed.host}${parsed.pathname}${parsed.search}`
    const fallback = encodeURIComponent(httpsUrl)
    return `intent://${hostPathQuery}#Intent;scheme=https;package=${MAX_MESSENGER_PACKAGE};S.browser_fallback_url=${fallback};end`
  } catch {
    return null
  }
}

export function isAndroidUserAgent() {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
}

export function isIosUserAgent() {
  return typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
}
