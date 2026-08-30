import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import PageSection from '../components/PageSection'

const UDS_JOIN_URL = 'https://grut.uds.app/c/join?ref=xwpa5934'

export default function LoyaltyPage() {
  const { lang } = useLangContext()
  const t = translations[lang]

  return (
    <main className="main loyalty-page">
      <div className="content-column loyalty-page__content">
        <PageSection title={t.loyaltyHeroTitle} intro={t.loyaltyHeroIntro} />

        <PageSection className="loyalty-page__details" ariaLabel={t.loyaltyContentAria}>
          <div className="loyalty-page__body">
            <p>{t.loyaltyBody}</p>
            <a
              className="loyalty-page__btn"
              href={UDS_JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.loyaltyUdsLinkLabel}
            </a>
          </div>
        </PageSection>

        <PageSection
          className="loyalty-page__levels"
          title={t.loyaltyLevelsTitle}
          intro={t.loyaltyLevelsIntro}
          ariaLabel={t.loyaltyLevelsAria}
        >
          <ol className="loyalty-page__levels-list">
            {t.loyaltyLevels.map((level, index) => (
                <li key={level.name} className="loyalty-page__level-card">
                  <div className="loyalty-page__level-head">
                    <span className="loyalty-page__level-index">{index + 1}</span>
                    <h3 className="loyalty-page__level-name">{level.name}</h3>
                    <span className="loyalty-page__level-cashback">{level.cashback}</span>
                  </div>
                  <p className="loyalty-page__level-benefit">{t.loyaltyPointsRedemption}</p>
                  {level.requirement ? (
                    <p className="loyalty-page__level-requirement">{level.requirement}</p>
                  ) : null}
                </li>
            ))}
          </ol>
        </PageSection>

        <PageSection
          className="loyalty-page__birthday"
          title={t.loyaltyBirthdayTitle}
          ariaLabel={t.loyaltyBirthdayAria}
        >
          <p className="loyalty-page__birthday-text">{t.loyaltyBirthdayBody}</p>
        </PageSection>
      </div>
    </main>
  )
}
