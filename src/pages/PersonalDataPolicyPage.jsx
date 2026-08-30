import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'

export default function PersonalDataPolicyPage() {
  const { lang } = useLangContext()
  const t = translations[lang]

  return (
    <main className="main legal-page">
      <div className="content-column">
        <h1 className="legal-page__title legal-page__title--caps legal-page__title--qwertu">{t.footerPersonalData}</h1>
        <div className="legal-page__body">
          {t.personalDataPageContent.split('\n\n').map((block, i) => (
            <p key={i} className="legal-page__para">
              {block}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}
