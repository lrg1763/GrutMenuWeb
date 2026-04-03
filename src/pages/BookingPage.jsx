import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import PageSection from '../components/PageSection'

const RESERVATION_API_URL = import.meta.env.VITE_RESERVATION_API_URL

const BOOKING_COMMENT_MAX = 500

const PHONE_RU_E164 = /^\+7\d{10}$/

function formatPhoneRuInput(raw) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 0) return ''
  let tail = digits
  if (tail.startsWith('8')) tail = '7' + tail.slice(1)
  if (tail.startsWith('7')) tail = tail.slice(1)
  tail = tail.slice(0, 10)
  return `+7${tail}`
}

function makeEmptyForm(bookingType = '') {
  return {
    bookingType,
    name: '',
    phone: '',
    dateTime: '',
    guests: '',
    comment: '',
  }
}

const emptyForm = makeEmptyForm()

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const typeParam = searchParams.get('type')
  const initialBookingType =
    typeParam === 'banquet' ? 'banquet' : typeParam === 'table' ? 'table' : ''
  const baseEmptyForm = makeEmptyForm(initialBookingType)

  const { lang } = useLangContext()
  const t = translations[lang]
  const hasApi = Boolean(RESERVATION_API_URL && String(RESERVATION_API_URL).trim())

  const [form, setForm] = useState(baseEmptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [validationKind, setValidationKind] = useState('idle')

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setValidationKind('idle')
    if (submitStatus !== 'idle') setSubmitStatus('idle')
  }

  const updatePhone = (e) => {
    setForm((prev) => ({ ...prev, phone: formatPhoneRuInput(e.target.value) }))
    setValidationKind('idle')
    if (submitStatus !== 'idle') setSubmitStatus('idle')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const guestsNum = parseInt(form.guests, 10)
    const missing =
      !form.bookingType ||
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.dateTime ||
      !form.guests.trim() ||
      Number.isNaN(guestsNum) ||
      guestsNum < 1

    if (missing) {
      setValidationKind('fields')
      setSubmitStatus('idle')
      return
    }

    if (!PHONE_RU_E164.test(form.phone.trim())) {
      setValidationKind('phone')
      setSubmitStatus('idle')
      return
    }

    setValidationKind('idle')

    if (!hasApi) {
      setSubmitStatus('noApi')
      return
    }

    setSubmitting(true)
    setSubmitStatus('idle')

    const [date = '', time = ''] = form.dateTime.split('T')
    const payload = {
      bookingType: form.bookingType,
      name: form.name.trim(),
      phone: form.phone.trim(),
      date,
      time,
      guests: guestsNum,
      comment: form.comment.trim(),
      source: 'web',
    }

    try {
      const res = await fetch(RESERVATION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const raw = await res.text()
      const ct = (res.headers.get('content-type') || '').toLowerCase()
      if (!ct.includes('application/json')) {
        setSubmitStatus('error')
        return
      }
      let data
      try {
        data = JSON.parse(raw)
      } catch {
        setSubmitStatus('error')
        return
      }
      if (res.ok && data && data.ok === true) {
        setSubmitStatus('success')
        setForm(baseEmptyForm)
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="main booking-page">
      <div className="content-column booking-page__content">
        <PageSection className="booking-page__section--hero" title={t.bookingHeroTitle} intro={t.bookingHeroText} />

        <PageSection className="booking-page__section--form" title={t.bookingFormTitle}>
          <form className="booking-page__form" onSubmit={handleSubmit} noValidate>
              <div className="booking-page__fields">
                <label className="booking-page__field">
                  <span className="booking-page__label">{t.bookingFieldType}</span>
                  <select
                    className="booking-page__input booking-page__select"
                    name="bookingType"
                    value={form.bookingType}
                    onChange={update('bookingType')}
                    required
                  >
                    <option value="">{t.bookingPlaceholderType}</option>
                    <option value="table">{t.bookingTypeTable}</option>
                    <option value="banquet">{t.bookingTypeBanquet}</option>
                  </select>
                </label>
                <label className="booking-page__field">
                  <span className="booking-page__label">{t.bookingFieldName}</span>
                  <input
                    className="booking-page__input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={update('name')}
                    autoComplete="name"
                    placeholder={t.bookingPlaceholderName}
                    required
                  />
                </label>
                <label className="booking-page__field">
                  <span className="booking-page__label">{t.bookingFieldPhone}</span>
                  <input
                    className="booking-page__input"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={updatePhone}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder={t.bookingPlaceholderPhone}
                    maxLength={12}
                    required
                  />
                </label>
                <label className="booking-page__field">
                  <span className="booking-page__label">{t.bookingFieldDateTime}</span>
                  <input
                    className="booking-page__input booking-page__datetime"
                    type="datetime-local"
                    name="dateTime"
                    value={form.dateTime}
                    onChange={update('dateTime')}
                    aria-label={t.bookingFieldDateTime}
                    required
                  />
                </label>
                <label className="booking-page__field">
                  <span className="booking-page__label">{t.bookingFieldGuests}</span>
                  <input
                    className="booking-page__input"
                    type="number"
                    name="guests"
                    min={1}
                    max={90}
                    inputMode="numeric"
                    value={form.guests}
                    onChange={update('guests')}
                    placeholder={t.bookingPlaceholderGuests}
                    required
                  />
                </label>
                <label className="booking-page__field booking-page__field--full">
                  <span className="booking-page__label">{t.bookingFieldComment}</span>
                  <textarea
                    className="booking-page__textarea"
                    name="comment"
                    rows={4}
                    value={form.comment}
                    onChange={update('comment')}
                    maxLength={BOOKING_COMMENT_MAX}
                    placeholder={t.bookingPlaceholderComment}
                  />
                </label>
              </div>

              {validationKind === 'fields' && (
                <p className="booking-page__message booking-page__message--error" role="alert">
                  {t.bookingValidationError}
                </p>
              )}
              {validationKind === 'phone' && (
                <p className="booking-page__message booking-page__message--error" role="alert">
                  {t.bookingPhoneError}
                </p>
              )}
              {submitStatus === 'success' && (
                <p className="booking-page__message booking-page__message--success" role="status">
                  {t.bookingSuccess}
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="booking-page__message booking-page__message--error" role="alert">
                  {t.bookingError}
                </p>
              )}
              {submitStatus === 'noApi' && (
                <div className="booking-page__message booking-page__message--info" role="status">
                  <p>{t.bookingNoApiAfterSubmit}</p>
                  <div className="booking-page__fallback-actions booking-page__fallback-actions--inline">
                    <a href="tel:+79167070210" className="booking-page__cta-btn">
                      {t.footerPhone}
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="booking-page__cta-btn booking-page__cta-btn--submit"
                disabled={submitting}
              >
                {submitting ? t.bookingSubmitting : t.bookingSubmit}
              </button>
            </form>
        </PageSection>
      </div>
    </main>
  )
}
