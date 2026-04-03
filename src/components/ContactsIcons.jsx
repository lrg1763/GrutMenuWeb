/** Иконки блока контактов (адрес, часы, телефон, почта) */

export function IconLocation() {
  return (
    <svg className="contacts-page__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  )
}

export function IconClock() {
  return (
    <svg className="contacts-page__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.25L15.5 15" />
    </svg>
  )
}

export function IconPhone() {
  return (
    <svg className="contacts-page__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconMail() {
  return (
    <svg className="contacts-page__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <path d="m3 8 7.89 5.26a2 2 0 0 0 2.22 0L21 8" />
    </svg>
  )
}
