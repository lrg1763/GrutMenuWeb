import { useSearchParams } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import PageSection from '../components/PageSection'
import RestoplaceBookingWidget from '../components/RestoplaceBookingWidget'

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const isBanquet = searchParams.get('type') === 'banquet'
  const { lang } = useLangContext()
  const t = translations[lang]

  return (
    <main className="main booking-page">
      <div className="content-column booking-page__content">
        <PageSection className="booking-page__section--hero" title={t.bookingHeroTitle} intro={t.bookingHeroText} />

        <PageSection className="booking-page__section--form" title={t.bookingFormTitle}>
          <RestoplaceBookingWidget banquet={isBanquet} title={t.bookingFormTitle} fallbackLabel={t.bookingSubmit} />
        </PageSection>
      </div>
    </main>
  )
}
