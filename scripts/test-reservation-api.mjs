#!/usr/bin/env node
/**
 * Проверка POST /reservation локально или против любого URL.
 * Запуск: сначала npm run server (или npm run dev:all), затем из корня:
 *   npm run test:booking-api
 *
 * Переменные окружения (опционально):
 *   RESERVATION_TEST_URL   — по умолчанию http://localhost:8787/reservation
 *   RESERVATION_TEST_ORIGIN — Origin для CORS, по умолчанию http://localhost:5177
 */

const url = process.env.RESERVATION_TEST_URL || 'http://localhost:8787/reservation'
const origin = process.env.RESERVATION_TEST_ORIGIN || 'http://localhost:5177'

const payload = {
  name: 'Тест API',
  phone: '+79991234567',
  date: '2026-04-15',
  time: '19:00',
  guests: 2,
  bookingType: 'table',
  source: 'test-reservation-api-script',
}

async function main() {
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
      },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    console.error(
      'Запрос не выполнен. Запустите сервер брони: npm run server (или npm run dev:all).',
      '\n',
      e.message,
    )
    process.exit(1)
  }

  const raw = await res.text()
  const ct = (res.headers.get('content-type') || '').toLowerCase()
  if (!ct.includes('application/json')) {
    console.error('Ожидался Content-Type с application/json, получено:', ct)
    console.error('Тело (начало):', raw.slice(0, 400))
    process.exit(1)
  }

  let data
  try {
    data = JSON.parse(raw)
  } catch {
    console.error('Ответ не JSON. Тело (начало):', raw.slice(0, 400))
    process.exit(1)
  }

  if (res.ok && data && data.ok === true) {
    console.log('Проверка пройдена:', res.status, JSON.stringify(data))
    process.exit(0)
  }

  console.error('Проверка не пройдена:', res.status, JSON.stringify(data))
  process.exit(1)
}

main()
