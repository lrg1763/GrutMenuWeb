import { Component } from 'react'

const FALLBACK = {
  ru: { title: 'Что-то пошло не так', retry: 'Обновить страницу' },
  en: { title: 'Something went wrong', retry: 'Refresh page' },
}

function getLang() {
  const docLang = document.documentElement.lang
  if (docLang && (docLang.startsWith('ru') || docLang.startsWith('en'))) return docLang.startsWith('en') ? 'en' : 'ru'
  const nav = typeof navigator !== 'undefined' && navigator.language ? navigator.language : ''
  return nav.startsWith('en') ? 'en' : 'ru'
}

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      const lang = getLang()
      const t = FALLBACK[lang] || FALLBACK.ru
      return (
        <div className="error-boundary" role="alert">
          <p className="error-boundary__text">{t.title}</p>
          <button
            type="button"
            className="error-boundary__retry"
            onClick={() => window.location.reload()}
          >
            {t.retry}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
