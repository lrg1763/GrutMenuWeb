import 'dotenv/config'
import express from 'express'
import nodemailer from 'nodemailer'

const PORT = Number(process.env.PORT) || 8787
const DEFAULT_SUBJECT = 'Бронь с сайта ГРЮТ'

const PHONE_RU_E164 = /^\+7\d{10}$/
const COMMENT_MAX = 500

/** Если в .env не задано — иначе fetch с Vite (другой порт) блокируется CORS. */
const DEFAULT_LOCAL_ORIGINS = ['http://localhost:5177', 'http://127.0.0.1:5177']

const isProduction = process.env.NODE_ENV === 'production'

function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function getAllowedOrigins() {
  const parsed = parseAllowedOrigins()
  if (parsed.length > 0) return parsed
  return DEFAULT_LOCAL_ORIGINS
}

function corsMiddleware(allowedOrigins) {
  return (req, res, next) => {
    const origin = req.headers.origin
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204)
    }
    next()
  }
}

function loadMailConfig() {
  const host = process.env.SMTP_HOST?.trim()
  const port = Number(process.env.SMTP_PORT) || 587
  const secureRaw = process.env.SMTP_SECURE?.trim().toLowerCase()
  const secure = secureRaw === 'true' || secureRaw === '1'
  const user = process.env.SMTP_USER?.trim() ?? ''
  const pass = process.env.SMTP_PASS ?? ''
  const mailTo = process.env.MAIL_TO?.trim()
  const mailFrom = process.env.MAIL_FROM?.trim()
  const subject = process.env.MAIL_SUBJECT?.trim() || DEFAULT_SUBJECT

  const missing = []
  if (!host) missing.push('SMTP_HOST')
  if (!mailTo) missing.push('MAIL_TO')
  if (!mailFrom) missing.push('MAIL_FROM')

  return {
    ok: missing.length === 0,
    missing,
    transport: {
      host,
      port,
      secure,
      auth: user ? { user, pass } : undefined,
    },
    mailTo: mailTo
      ? mailTo.split(',').map((a) => a.trim()).filter(Boolean)
      : [],
    mailFrom,
    subject,
  }
}

function validateBody(body) {
  if (!body || typeof body !== 'object') {
    return { error: 'Некорректное тело запроса' }
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const date = typeof body.date === 'string' ? body.date.trim() : ''
  const time = typeof body.time === 'string' ? body.time.trim() : ''
  const bookingTypeRaw = typeof body.bookingType === 'string' ? body.bookingType.trim() : ''
  const bookingType = bookingTypeRaw === 'banquet' ? 'banquet' : bookingTypeRaw === 'table' ? 'table' : ''
  const guestsRaw = body.guests
  const guests =
    typeof guestsRaw === 'number'
      ? guestsRaw
      : typeof guestsRaw === 'string'
        ? parseInt(guestsRaw, 10)
        : NaN
  const comment =
    typeof body.comment === 'string' ? body.comment.trim().slice(0, COMMENT_MAX) : ''

  const missing =
    !name ||
    !phone ||
    !date ||
    !time ||
    !Number.isFinite(guests) ||
    guests < 1 ||
    String(guestsRaw ?? '').trim() === ''

  if (missing) {
    return { error: 'Заполните все обязательные поля' }
  }

  if (!PHONE_RU_E164.test(phone)) {
    return { error: 'Неверный формат телефона' }
  }

  if (!bookingType) {
    return { error: 'Некорректный тип бронирования' }
  }

  return {
    data: { bookingType, name, phone, date, time, guests, comment, source: body.source },
  }
}

function buildMessageBody(data) {
  const bookingTypeLabel = data.bookingType === 'banquet' ? 'Забронировать банкет' : 'Забронировать стол'
  const lines = [
    'Новая бронь с сайта ГРЮТ',
    '',
    `Тип: ${bookingTypeLabel}`,
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    `Дата: ${data.date}`,
    `Время: ${data.time}`,
    `Гостей: ${data.guests}`,
  ]
  if (data.comment) {
    lines.push('', `Комментарий: ${data.comment}`)
  }
  if (data.source) {
    lines.push('', `Источник: ${data.source}`)
  }
  return lines.join('\n')
}

const mailConfig = loadMailConfig()
let transporter = null
let consoleOnlyMode = false

if (!mailConfig.ok) {
  if (isProduction) {
    console.error(
      '[reservation-server] В production нужны SMTP и MAIL_*. Не задано:',
      mailConfig.missing.join(', '),
    )
    console.error('Скопируйте server/.env.example в server/.env и заполните переменные.')
    process.exit(1)
  }
  consoleOnlyMode = true
  console.warn(
    '[reservation-server] SMTP не настроен — заявки принимаются, письма не отправляются (только лог в консоль). Для почты заполните server/.env',
  )
} else {
  transporter = nodemailer.createTransport(mailConfig.transport)
}

const allowedOrigins = getAllowedOrigins()
const app = express()
app.use(express.json({ limit: '32kb' }))
app.use(corsMiddleware(allowedOrigins))

app.post('/reservation', async (req, res) => {
  const parsed = validateBody(req.body)
  if (parsed.error) {
    return res.status(400).json({ ok: false, error: parsed.error })
  }

  let text
  try {
    text = buildMessageBody(parsed.data)
  } catch {
    return res.status(400).json({ ok: false, error: 'Ошибка формирования сообщения' })
  }

  if (consoleOnlyMode) {
    console.log('[reservation] (без SMTP)\n' + text + '\n')
    return res.status(200).json({ ok: true })
  }

  try {
    await transporter.sendMail({
      from: mailConfig.mailFrom,
      to: mailConfig.mailTo,
      subject: mailConfig.subject,
      text,
    })
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('[reservation] SMTP error:', e.message)
    return res.status(502).json({ ok: false, error: 'Не удалось отправить письмо' })
  }
})

app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' })
})

const server = app.listen(PORT, () => {
  const mode = consoleOnlyMode ? 'консоль (без писем)' : 'email'
  console.log(`Reservation server http://localhost:${PORT}  POST /reservation (${mode})`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `[reservation-server] Порт ${PORT} уже занят (запущен другой экземпляр?). Остановите процесс: lsof -nP -iTCP:${PORT} -sTCP:LISTEN`,
    )
    process.exit(1)
  }
  throw err
})
