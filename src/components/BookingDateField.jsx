import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, isValid, startOfToday } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'

function IconCalendar() {
  return (
    <svg className="booking-picker__trigger-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

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

export default function BookingDateField({
  id,
  name,
  value,
  onChange,
  placeholder,
  ariaLabel,
  disabled,
  lang,
}) {
  const uid = useId()
  const triggerId = id || `booking-date-${uid}`
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const locale = lang === 'ru' ? ru : enUS
  const selected = parseLocalDateString(value)

  const display =
    selected != null
      ? format(selected, lang === 'ru' ? 'd MMMM yyyy' : 'MMMM d, yyyy', { locale })
      : ''

  const handleSelect = useCallback(
    (date) => {
      if (!date) {
        onChange('')
        return
      }
      onChange(format(date, 'yyyy-MM-dd'))
      setOpen(false)
    },
    [onChange]
  )

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="booking-picker" ref={rootRef}>
      <input type="hidden" name={name} value={value} readOnly aria-hidden />
      <button
        id={triggerId}
        type="button"
        className={`booking-page__input booking-picker__trigger ${!display ? 'booking-picker__trigger--empty' : ''}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
      >
        <span className="booking-picker__trigger-text">{display || placeholder}</span>
        <span className="booking-picker__trigger-icon">
          <IconCalendar />
        </span>
      </button>
      {open && (
        <div className="booking-picker__popover" role="dialog" aria-label={ariaLabel}>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            locale={locale}
            disabled={{ before: startOfToday() }}
            defaultMonth={selected ?? startOfToday()}
            className="booking-picker__rdp"
          />
        </div>
      )}
    </div>
  )
}
