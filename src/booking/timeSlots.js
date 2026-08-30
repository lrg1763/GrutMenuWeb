/** Слоты времени для брони: 12:00–23:30 с шагом 30 минут. */
export const BOOKING_TIME_SLOTS = (() => {
  const out = []
  for (let h = 12; h <= 23; h += 1) {
    for (const m of [0, 30]) {
      out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return out
})()
