import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'

export default function PrivacyPolicyPage() {
  const { lang } = useLangContext()
  const t = translations[lang]

  return (
    <main className="main legal-page">
      <div className="content-column">
        <h1 className="legal-page__title">{t.footerPrivacy}</h1>
        <div className="legal-page__body">
          {t.privacyPageContent.split('\n\n').map((block, i) => (
            <p key={i} className="legal-page__para">
              {block}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}
