import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import PageSection from '../components/PageSection'
import {
  ABOUT_HALL_IMAGES,
  ABOUT_HALL_IMAGES_MOBILE,
  ABOUT_INTRO_SIDE_IMAGE,
  ABOUT_WHY_IMAGES,
  getAssetUrl,
} from '../constants'

export default function AboutPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const introBlocks = t.aboutIntroLead.split('\n\n').filter(Boolean)
  const [introFirst, ...introRest] = introBlocks

  return (
    <main className="main about-page">
      <div className="content-column about-page__content">
        <PageSection
          className="about-page__intro-head"
          title={t.aboutPageTitle}
          intro={t.aboutPageSubtitle}
        />

        <PageSection className="about-page__top" ariaLabel={t.aboutPageIntroAria}>
          <div className="about-page__top-grid">
            <div className="about-page__text about-page__text--hero about-page__top-lead-first">
              {introFirst ? <p>{introFirst}</p> : null}
            </div>
            <figure className="about-page__top-figure">
              <img
                className="about-page__top-photo"
                src={getAssetUrl(ABOUT_INTRO_SIDE_IMAGE)}
                alt={t.aboutIntroSidePhotoAlt}
                width="800"
                height="800"
                decoding="async"
              />
            </figure>
            <div className="about-page__text about-page__text--hero about-page__top-lead-rest">
              {introRest.map((block, i) => (
                <p key={i}>{block}</p>
              ))}
              <p>{t.aboutGrutText}</p>
            </div>
          </div>
        </PageSection>

        <PageSection className="about-page__why" title={t.aboutWhyReturnTitle}>
          <div className="about-page__why-grid">
            {ABOUT_WHY_IMAGES.map((path) => (
              <article key={path} className="about-page__why-card about-page__why-card--media-only">
                <div className="about-page__why-media">
                  <img
                    className="about-page__why-photo"
                    src={getAssetUrl(path)}
                    alt={t.aboutWhyPhotosAlt}
                    decoding="async"
                  />
                </div>
              </article>
            ))}
          </div>
        </PageSection>

        <PageSection className="about-page__halls" title={t.aboutHallsTitle}>
          <div className="about-page__halls-grid">
            {t.aboutHallPhotos.map((photo, i) => (
              <div key={photo.imageAlt} className="about-page__halls-frame">
                <picture>
                  <source media="(min-width: 640px)" srcSet={getAssetUrl(ABOUT_HALL_IMAGES[i])} />
                  <img
                    className="about-page__halls-photo"
                    src={getAssetUrl(ABOUT_HALL_IMAGES_MOBILE[i])}
                    alt={photo.imageAlt}
                    decoding="async"
                  />
                </picture>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </main>
  )
}
