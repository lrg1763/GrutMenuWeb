import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { format, isValid, startOfToday } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import { BOOKING_TIME_SLOTS } from '../booking/timeSlots'

function parseLocalDateString(value) {
  if (!value || typeof value !== 'string') return undefined
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!m) return undefined
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  const date = new Date(y, mo, d)
  return isValid(date) &&
    date.getFullYear() === y &&
    date.getMonth() === mo &&
    date.getDate() === d
    ? date
    : undefined
}

function parseDateTimeValue(value) {
  if (!value || typeof value !== 'string') return { date: '', time: '' }
  const [d, rest = ''] = value.trim().split('T')
  const date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : ''
  const timeMatch = /^(\d{2}:\d{2})/.exec(rest)
  const time = timeMatch ? timeMatch[1] : ''
  return { date, time }
}

export default function BookingDateTimeModal({ open, onClose, value, onApply, disabled }) {
  const { lang } = useLangContext()
  const t = translations[lang]
  const titleId = useId()
  const locale = lang === 'ru' ? ru : enUS

  const [draftDate, setDraftDate] = useState('')
  const [draftTime, setDraftTime] = useState('')
  const [mobileTab, setMobileTab] = useState('date')

  useEffect(() => {
    if (!open) return
    const { date, time } = parseDateTimeValue(value)
    setDraftDate(date)
    setDraftTime(time)
    setMobileTab('date')
  }, [open, value])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const scrollY = window.scrollY
    const { style } = document.body
    const prev = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
    }
    style.overflow = 'hidden'
    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.left = '0'
    style.right = '0'
    style.width = '100%'

    return () => {
      document.removeEventListener('keydown', onKey)
      style.overflow = prev.overflow
      style.position = prev.position
      style.top = prev.top
      style.left = prev.left
      style.right = prev.right
      style.width = prev.width
      window.scrollTo(0, scrollY)
    }
  }, [open, onClose])

  const selected = parseLocalDateString(draftDate)

  const handleSelectDate = useCallback((date) => {
    if (!date) {
      setDraftDate('')
      return
    }
    setDraftDate(format(date, 'yyyy-MM-dd'))
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 539px)').matches) {
      setMobileTab('time')
    }
  }, [])

  const handleApply = () => {
    if (!draftDate || !draftTime) return
    onApply(`${draftDate}T${draftTime}`)
    onClose()
  }

  const canApply = Boolean(draftDate && draftTime)

  const selectionSummary = useMemo(() => {
    if (!draftDate || !draftTime) return null
    const d = parseLocalDateString(draftDate)
    if (!d) return null
    return `${format(d, lang === 'ru' ? 'd MMMM yyyy' : 'MMMM d, yyyy', { locale })} · ${draftTime}`
  }, [draftDate, draftTime, lang, locale])

  if (!open) return null

  const modal = (
    <div
      className="booking-dt-modal__backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="booking-dt-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="booking-dt-modal__handle" aria-hidden="true" />
        <button
          type="button"
          className="booking-dt-modal__close"
          onClick={onClose}
          aria-label={t.close}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="booking-dt-modal__head">
          <h2 id={titleId} className="booking-dt-modal__title">
            {t.bookingDateTimeModalTitle}
          </h2>
          {selectionSummary ? (
            <p className="booking-dt-modal__selection" aria-live="polite">
              {selectionSummary}
            </p>
          ) : (
            <p className="booking-dt-modal__selection booking-dt-modal__selection--hint">
              {t.bookingDateTimeModalHint}
            </p>
          )}
        </div>

        <div className="booking-dt-modal__tabs" role="tablist" aria-label={t.bookingDateTimeModalTitle}>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'date'}
            className={`booking-dt-modal__tab ${mobileTab === 'date' ? 'booking-dt-modal__tab--active' : ''}`}
            onClick={() => setMobileTab('date')}
          >
            {t.bookingFieldDate}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'time'}
            className={`booking-dt-modal__tab ${mobileTab === 'time' ? 'booking-dt-modal__tab--active' : ''}`}
            onClick={() => setMobileTab('time')}
          >
            {t.bookingFieldTime}
          </button>
        </div>

        <div className="booking-dt-modal__body" data-mobile-tab={mobileTab}>
          <div className="booking-dt-modal__panel booking-dt-modal__panel--date">
            <h3 className="booking-dt-modal__section-label">{t.bookingFieldDate}</h3>
            <div className="booking-dt-modal__panel-inner">
              <div className="booking-picker booking-dt-modal__calendar">
                <DayPicker
                  mode="single"
                  selected={selected}
                  onSelect={handleSelectDate}
                  locale={locale}
                  disabled={disabled ? true : { before: startOfToday() }}
                  defaultMonth={selected ?? startOfToday()}
                  className="booking-picker__rdp"
                />
              </div>
            </div>
          </div>

          <div className="booking-dt-modal__panel booking-dt-modal__panel--time">
            <h3 className="booking-dt-modal__section-label">{t.bookingFieldTime}</h3>
            <div className="booking-dt-modal__panel-inner">
              <div className="booking-dt-modal__time-grid" role="listbox" aria-label={t.bookingPickerTimeAria}>
                {BOOKING_TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    role="option"
                    aria-selected={draftTime === slot}
                    disabled={disabled}
                    className={`booking-dt-modal__time-btn ${draftTime === slot ? 'booking-dt-modal__time-btn--selected' : ''}`}
                    onClick={() => setDraftTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="booking-dt-modal__footer">
          <button
            type="button"
            className="booking-dt-modal__btn booking-dt-modal__btn--secondary"
            onClick={onClose}
          >
            {t.bookingDateTimeModalCancel}
          </button>
          <button
            type="button"
            className="booking-dt-modal__btn booking-dt-modal__btn--primary"
            disabled={disabled || !canApply}
            onClick={handleApply}
          >
            {t.bookingDateTimeModalApply}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
