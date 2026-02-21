import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { PDF_MENU_PATH } from '../constants'

export default function DownloadButton() {
  const { lang } = useLangContext()
  const t = translations[lang]

  return (
    <footer className="download-footer">
      <a href={PDF_MENU_PATH} download className="download-btn">
        {t.downloadMenu}
      </a>
    </footer>
  )
}
