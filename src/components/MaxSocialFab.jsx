import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { MAX_SOCIAL_URL } from '../constants'
import {
  getMaxMessengerAndroidIntent,
  isAndroidUserAgent,
  isIosUserAgent,
  isMaxMessengerHttpsUrl,
} from '../utils/maxOpen'

const maxIconSrc = `${import.meta.env.BASE_URL}assets/images/max.svg`

export default function MaxSocialFab() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const href = MAX_SOCIAL_URL
  const isMaxLink = isMaxMessengerHttpsUrl(href)
  const androidIntent = isAndroidUserAgent() ? getMaxMessengerAndroidIntent(href) : null
  const target = isIosUserAgent() && isMaxLink ? '_self' : '_blank'

  function handleClick(e) {
    if (!androidIntent) return
    e.preventDefault()
    window.location.assign(androidIntent)
  }

  return (
    <a
      href={href}
      className="max-social-fab"
      target={target}
      rel="noopener noreferrer"
      aria-label={t.maxSocialAria}
      onClick={handleClick}
    >
      <img className="max-social-fab__img" src={maxIconSrc} alt="" width="72" height="72" decoding="async" />
    </a>
  )
}
