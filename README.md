# GRUT Menu Web

Сайт ресторана ГРЮТ (**https://грют.москва**): главная, разделы меню с карточками блюд (фото, цена), «О нас», «Банкеты», «Галерея», страница коктейлей, контакты и переключатель языков (RU / EN).

## Стек

- **Vite**, **React 18**, **React Router**
- Данные: `public/menu.json` (разделы и блюда)
- Стили: CSS в `src/styles/` (global, header, footer, menu, modal, cocktails, responsive)
- Шрифты: Manrope, Martian Mono, Opinion Pro Condensed

## Запуск

```bash
npm install
npm run dev
```

Откроется по адресу: **http://localhost:5177/** (порт и `base` заданы в `vite.config.js`: `base: '/'`).

## Сборка

Перед сборкой для продакшена в `.env` задайте **`VITE_SITE_URL=https://грют.москва`** (без слэша в конце) — так на страницах появятся корректные `canonical` и `og:url`. Локально переменную можно не указывать.

URL приёма брони в прод-сборке задаётся в **`.env.production`** (`VITE_RESERVATION_API_URL=/reservation.php`), чтобы в билд не попадал `localhost`. Локально при `npm run dev` используется `.env` с Node на порту 8787.

```bash
npm run build
```

Результат сборки попадает в папку **`dist/`**. Эту папку в репозиторий не коммитят (она в `.gitignore`); её создаёт команда `build` при деплое.

Превью продакшен-сборки:

```bash
npm run preview
```

## Деплой

Содержимое папки **`dist/`** после `npm run build` заливают в корень сайта на хостинг (например, в `public_html`). В корне должен лежать файл **`.htaccess`** для SPA (редирект несуществующих путей на `index.html`). Папки `menu` и `cocktails` переименованы в **`menu-assets`** и **`cocktail-images`**, чтобы не конфликтовать с маршрутами `/menu` и `/cocktails`.

**SprintHost и другой PHP-хостинг (без Node):** в `dist/` уже есть **`reservation.php`**. Скопируйте **`public/reservation-config.example.php`** в **`reservation-config.php`** в **тот же каталог на сервере**, что и `index.html`, укажите SMTP и почту. Перед `npm run build` в `.env` задайте **`VITE_RESERVATION_API_URL=/reservation.php`** (или полный URL `https://грют.москва/reservation.php`), пересоберите и залейте `dist`. Подробнее — в разделе «Бронирование».

## Структура проекта

| Путь | Назначение |
|------|------------|
| `public/` | Статика: `menu.json`, `menu-assets/`, `cocktail-images/`, `images/`, `fonts/`, `favicons/`, `.htaccess`, PDF; **`reservation.php`** + пример **`reservation-config.example.php`** — приём брони на PHP-хостинге |
| `public/menu-assets/` | Фото блюд; внутри — подпапки по разделам: `grill/`, `garniry/`, `zacuski/`, `sousy/`, `supy/`, `pasta/`, `myaso_ptica/`, `ryba_moreprodukty/`, `deserty/`, `k_pivu/`, `hleb/`, `detskoe/`, `zacuski_kompaniya/`, `salaty/` |
| `public/cocktail-images/` | Фото коктейлей (например, `1.jpg`, `2.jpg`) |
| `src/components/` | Header, Footer, Layout, SectionTabs, DishGrid, DishModal, DownloadButton, CocktailsCompositionModal, PageSection, ErrorBoundary |
| `src/context/` | LangContext (язык) |
| `src/hooks/` | useLang, useMenuData, useActiveSection |
| `src/i18n/` | Переводы интерфейса и названий/описаний блюд (RU, EN) |
| `src/pages/` | HomePage, AboutPage, MenuPage, BanquetsPage, GalleryPage, CocktailsPage, ContactsPage |
| `src/styles/` | Разбитые CSS-файлы |
| `src/constants.js` | Пути к PDF и menu.json, ключи localStorage, `getAssetUrl()` |
| `src/routes.jsx` | Маршруты приложения |
| `server/` | Node.js: приём POST брони, отправка заявки на почту по SMTP (см. «Бронирование») |
| `scripts/` | В т.ч. `test-reservation-api.mjs` — смок-тест `POST /reservation` (`npm run test:booking-api`) |

Папка **`dist/`** не хранится в репозитории: она создаётся при `npm run build` и используется при деплое.

## Фото блюд

- Все фото блюд лежат в **`public/menu-assets/`**.
- Внутри — подпапки по разделам меню (id из `menu.json`: `grill`, `garniry`, `zacuski` и т.д.).
- В `menu.json` у каждого блюда поле `image`, например: `"/menu-assets/grill/porterhouse.webp"`.
- Рекомендуемое соотношение сторон фото: 4:3.
- Для блюд без фото в JSON указывают `"/images/placeholder.svg"`.

## Карта на странице контактов

На странице «Контакты» отображается карта с адресом (г. Москва, ул. Шипиловская, 28A). Если в `.env` задан ключ `VITE_YANDEX_MAPS_API_KEY`, подгружается карта Яндекса; при ошибке или без ключа показывается OpenStreetMap. В настройках ключа Яндекса в «Ограничение по HTTP Referer» укажите: `грют.москва`, `localhost`, `127.0.0.1` (каждый с новой строки).

## Бронирование

Форма на странице «Бронь» отправляет заявку **POST** на URL из переменной окружения **`VITE_RESERVATION_API_URL`**.

**Тело запроса (JSON):** `name`, `phone`, `date`, `time`, `guests`, `comment`, а также **`source`: `"web"`** — чтобы бэкенд отличал заявки с сайта от других каналов.

### Сервер в этом репозитории (`server/`)

Приёмник заявок отправляет **письмо на почту** через SMTP ([nodemailer](https://nodemailer.com/)). При запуске из папки `server/` подхватывается файл **`server/.env`** (через `dotenv`). Пароль почты и остальные секреты не кладите во фронт.

**Локально без SMTP:** если `NODE_ENV` не `production` и SMTP в `server/.env` не заполнен, сервер всё равно стартует: заявки **принимаются** с ответом «успех», текст заявки пишется **в консоль** сервера (письма не уходят). Для реальных писем заполните SMTP.

**Фронт и бронь одной командой:** из корня `npm run dev:all` — параллельно Vite (порт из `vite.config.js`, по умолчанию 5177) и `npm run server`.

**Локальная проверка (п. 2):**

1. В корне скопируйте пример env, если ещё нет своего `.env`: `cp .env.example .env` — в нём уже `VITE_RESERVATION_API_URL=http://localhost:8787/reservation`.
2. В `server/`: `cp .env.example .env`. Для теста **без** реальной почты ничего в SMTP можно не заполнять (не выставляйте `NODE_ENV=production` — сервер примет заявку и выведет текст в консоль). Чтобы ушло письмо (Mail.ru и т.д.), заполните `SMTP_*`, `MAIL_TO`, `MAIL_FROM` по комментариям в `server/.env.example`.
3. Один раз: `npm install` в корне и `npm install` в `server/` (или только корень + `npm run server`, который дергает `server`).
4. Запуск: `npm run dev:all` → откройте страницу брони и отправьте форму, либо в отдельном терминале при уже запущенном `npm run server`: **`npm run test:booking-api`** — скрипт шлёт тот же JSON, что и форма, и проверяет ответ `{ "ok": true }`.

```bash
cd server
cp .env.example .env
# для реальных писем: заполните SMTP_* , MAIL_TO , MAIL_FROM — см. комментарии в .env.example
npm install
npm start
```

Хост, порт и учётные данные SMTP возьмите в панели вашего почтового провайдера (корпоративная почта, Яндекс 360 и т.п.). Для Яндекса и аналогов часто используют порт **587** и `SMTP_SECURE=false`, для порта **465** — `SMTP_SECURE=true`.

На фронте в `.env` укажите **полный URL с путём**, например:

`VITE_RESERVATION_API_URL=http://localhost:8787/reservation`

В продакшене подставьте публичный **HTTPS**-адрес того же маршрута `/reservation`. В `server/.env` в **`ALLOWED_ORIGINS`** перечислите origin сайта (например `https://грют.москва`). Если `ALLOWED_ORIGINS` пустой, для локальной разработки по умолчанию разрешены `http://localhost:5177` и `http://127.0.0.1:5177` (чтобы CORS не блокировал запросы с Vite).

Пароли и адреса почты не коммитьте: держите их в `server/.env` на машине деплоя.

Из корня монорепозитория можно запустить: **`npm run server`** (после `npm install` в `server/`).

### PHP на SprintHost и аналогах (`public/reservation.php`)

Если сайт — только статика из **`dist/`** на хостинге с **PHP**, Node не нужен: заявки обрабатывает **`reservation.php`** (попадает в корень `dist/` при сборке).

1. Залейте содержимое **`dist/`** в корень сайта.
2. Скопируйте на сервере **`reservation-config.example.php`** → **`reservation-config.php`** рядом с `reservation.php`, заполните `mail_to`, `mail_from`, SMTP (как у Mail.ru: `smtp.mail.ru`, порт **465**, `smtp_secure` **true** и пароль приложения). Файл **`reservation-config.php`** в репозиторий не коммитьте (в `.gitignore`).
3. В **`.env`** перед сборкой укажите **`VITE_RESERVATION_API_URL=/reservation.php`** (относительный путь — тот же домен, без проблем с CORS) или полный **`https://ваш-домен/reservation.php`**, выполните **`npm run build`** и снова залейте **`dist/`**.
4. Если форма не уходит, в DevTools → Network посмотрите заголовок **Origin** у запроса к `reservation.php` и при необходимости добавьте этот origin в **`allowed_origins`** в конфиге (для кириллического домена иногда нужен и punycode-вариант).

В конфиге можно выставить **`transport` => `mail`**, если на SprintHost настроена отправка через **`mail()`** без SMTP.

## Лицензия

Приватный проект.
