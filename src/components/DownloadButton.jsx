import { useState } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import {
  PDF_MENU_MAIN_RU,
  PDF_MENU_MAIN_EN,
  PDF_MENU_COCKTAIL,
  PDF_MENU_KIDS,
  PDF_MENU_DOWNLOAD_NAME_MAIN_RU,
  PDF_MENU_DOWNLOAD_NAME_MAIN_EN,
  PDF_MENU_DOWNLOAD_NAME_COCKTAIL,
  PDF_MENU_DOWNLOAD_NAME_KIDS,
} from '../constants'

const MENU_OPTIONS = [
  { key: 'downloadMenuMainRu', path: PDF_MENU_MAIN_RU, fileName: PDF_MENU_DOWNLOAD_NAME_MAIN_RU },
  { key: 'downloadMenuMainEn', path: PDF_MENU_MAIN_EN, fileName: PDF_MENU_DOWNLOAD_NAME_MAIN_EN },
  { key: 'downloadMenuCocktail', path: PDF_MENU_COCKTAIL, fileName: PDF_MENU_DOWNLOAD_NAME_COCKTAIL },
  { key: 'downloadMenuKids', path: PDF_MENU_KIDS, fileName: PDF_MENU_DOWNLOAD_NAME_KIDS },
]

export default function DownloadButton({ inline = false }) {
  const { lang } = useLangContext()
  const t = translations[lang]
  const [modalMode, setModalMode] = useState(null)
  const modalOpen = modalMode !== null
  const isDownloadMode = modalMode === 'download'

  return (
    <>
      <footer className={`download-footer ${inline ? 'download-footer--inline' : ''}`}>
        <div className={`download-footer__inner ${inline ? '' : 'content-column'}`.trim()}>
          <div className="download-footer__actions">
            <button
              type="button"
              className="download-btn"
              onClick={() => setModalMode('download')}
              aria-haspopup="dialog"
              aria-expanded={modalOpen}
              aria-label={t.downloadMenu}
            >
              {t.downloadMenu}
            </button>
            <button
              type="button"
              className="download-btn"
              onClick={() => setModalMode('view')}
              aria-haspopup="dialog"
              aria-expanded={modalOpen}
              aria-label={t.viewMenu}
            >
              {t.viewMenu}
            </button>
          </div>
        </div>
      </footer>

      <div
        className={`download-modal-overlay ${modalOpen ? 'download-modal-overlay--open' : ''}`}
        aria-hidden={!modalOpen}
        onClick={() => setModalMode(null)}
      >
        <div
          className="download-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="download-modal__close"
            onClick={() => setModalMode(null)}
            aria-label={t.close}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 id="download-modal-title" className="download-modal__title">
            {isDownloadMode ? t.downloadMenuTitle : t.viewMenuTitle}
          </h2>
          <div className="download-modal__options">
            {MENU_OPTIONS.map(({ key, path, fileName }) => (
              <a
                key={key}
                href={path}
                className="download-modal__option"
                download={isDownloadMode ? fileName : undefined}
                target={isDownloadMode ? undefined : '_blank'}
                rel={isDownloadMode ? undefined : 'noopener noreferrer'}
                onClick={() => setModalMode(null)}
              >
                {t[key]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
