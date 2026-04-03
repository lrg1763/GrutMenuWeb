import { useEffect } from 'react'
import { translations } from '../i18n'
import { DOCUMENT_META_BY_PATH } from '../config/documentMeta'
import { normalizePathname } from '../utils/path'
import { SITE_PUBLIC_ORIGIN } from '../constants'

function setOrCreateLinkCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

function setOrCreateOgUrl(content) {
  let meta = document.querySelector('meta[property="og:url"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', 'og:url')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

export function useDocumentMeta(pathname, lang) {
  useEffect(() => {
    const t = translations[lang]
    const path = normalizePathname(pathname)
    const keys = DOCUMENT_META_BY_PATH[path] ?? DOCUMENT_META_BY_PATH['/']

    document.title = t[keys.titleKey]

    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.setAttribute('content', t[keys.descriptionKey])

    if (SITE_PUBLIC_ORIGIN) {
      const canonicalPath = path === '/' ? '' : path
      const absoluteUrl = `${SITE_PUBLIC_ORIGIN}${canonicalPath}`
      setOrCreateLinkCanonical(absoluteUrl)
      setOrCreateOgUrl(absoluteUrl)
    }
  }, [pathname, lang])
}
