import { Link } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { MENU_DOWNLOAD_OPTIONS } from '../data/menuDownloads'
import PageSection from '../components/PageSection'

function DownloadArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v11m0 0 4-4m-4 4-4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export default function DownloadMenuPage() {
  const { lang } = useLangContext()
  const t = translations[lang]

  return (
    <main className="main download-menu-page">
      <div className="content-column download-menu-page__content">
        <PageSection
          className="download-menu-page__hero"
          title={t.downloadMenuTitle}
          intro={t.downloadMenuPageIntro}
        />

        <PageSection className="download-menu-page__catalog" ariaLabel={t.downloadMenuOptionsAria}>
          <ul className="download-menu-page__grid">
            {MENU_DOWNLOAD_OPTIONS.map(({ key, descKey, path }, index) => (
              <li key={key} className="download-menu-page__card">
                <a
                  href={path}
                  className="download-menu-page__card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="download-menu-page__index" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="download-menu-page__card-body">
                    <span className="download-menu-page__card-badge">PDF</span>
                    <span className="download-menu-page__card-title">{t[key]}</span>
                    <span className="download-menu-page__card-desc">{t[descKey]}</span>
                  </span>
                  <span className="download-menu-page__card-action">
                    <span className="download-menu-page__card-action-label">{t.downloadMenuAction}</span>
                    <span className="download-menu-page__card-action-icon">
                      <DownloadArrowIcon />
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="download-menu-page__footer">
            <Link to="/menu" className="download-menu-page__back">
              {t.downloadMenuBackToMenu}
            </Link>
          </div>
        </PageSection>
      </div>
    </main>
  )
}
