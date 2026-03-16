import { useState } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import {
  PDF_MENU_MAIN_RU,
  PDF_MENU_MAIN_EN,
  PDF_MENU_COCKTAIL,
  PDF_MENU_KIDS,
} from '../constants'

const DOWNLOAD_OPTIONS = [
  { key: 'downloadMenuMainRu', path: PDF_MENU_MAIN_RU },
  { key: 'downloadMenuMainEn', path: PDF_MENU_MAIN_EN },
  { key: 'downloadMenuCocktail', path: PDF_MENU_COCKTAIL },
  { key: 'downloadMenuKids', path: PDF_MENU_KIDS },
]

export default function DownloadButton() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <footer className="download-footer">
        <div className="download-footer__inner content-column">
          <button
            type="button"
            className="download-btn"
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            aria-label={t.downloadMenu}
          >
            {t.downloadMenu}
          </button>
        </div>
      </footer>

      <div
        className={`download-modal-overlay ${modalOpen ? 'download-modal-overlay--open' : ''}`}
        aria-hidden={!modalOpen}
        onClick={() => setModalOpen(false)}
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
            onClick={() => setModalOpen(false)}
            aria-label={t.close}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 id="download-modal-title" className="download-modal__title">
            {t.downloadMenuTitle}
          </h2>
          <div className="download-modal__options">
            {DOWNLOAD_OPTIONS.map(({ key, path }) => (
              <a
                key={key}
                href={path}
                download
                className="download-modal__option"
                onClick={() => setModalOpen(false)}
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
