import { useState, useEffect } from 'react'
import { LANG_STORAGE_KEY, SUPPORTED_LANGS } from '../constants'

export function useLang() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    return SUPPORTED_LANGS.includes(saved) ? saved : 'ru'
  })

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  }, [lang])

  return [lang, setLang]
}
