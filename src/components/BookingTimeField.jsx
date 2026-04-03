import { useEffect, useId, useRef, useState } from 'react'

function IconClock() {
  return (
    <svg className="booking-picker__trigger-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

const TIME_SLOTS = (() => {
  const out = []
  for (let h = 12; h <= 23; h += 1) {
    for (const m of [0, 30]) {
      out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return out
})()

export default function BookingTimeField({
  id,
  name,
  value,
  onChange,
  placeholder,
  ariaLabel,
  disabled,
}) {
  const uid = useId()
  const triggerId = id || `booking-time-${uid}`
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

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

  const pick = (t) => {
    onChange(t)
    setOpen(false)
  }

  const display = value || ''

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
        aria-haspopup="listbox"
        aria-label={ariaLabel}
      >
        <span className="booking-picker__trigger-text">{display || placeholder}</span>
        <span className="booking-picker__trigger-icon">
          <IconClock />
        </span>
      </button>
      {open && (
        <div
          className="booking-picker__popover booking-picker__popover--time"
          role="listbox"
          aria-label={ariaLabel}
        >
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              type="button"
              role="option"
              aria-selected={value === t}
              className={`booking-picker__time-option ${value === t ? 'booking-picker__time-option--selected' : ''}`}
              onClick={() => pick(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
