import { useLangContext } from '../context/LangContext'
import { SUPPORTED_LANGS } from '../constants'
import { langLabels, translations } from '../i18n'

export default function Header() {
  const { lang, setLang } = useLangContext()
  const t = translations[lang]

  return (
    <header className="header">
      <nav className="lang-switcher" aria-label="Выбор языка">
        {SUPPORTED_LANGS.map((l) => (
          <button
            key={l}
            type="button"
            className={`lang-switcher__btn ${l === lang ? 'lang-switcher__btn--active' : ''}`}
            onClick={() => setLang(l)}
          >
            {langLabels[l]}
          </button>
        ))}
      </nav>
      <h1 className="header__title">{t.pageTitle}</h1>
    </header>
  )
}
