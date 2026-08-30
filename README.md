# GRUT Menu Web

Сайт ресторана ГРЮТ (**https://грют.москва**): главная, меню, «О нас», «Банкеты», «Галерея», коктейли, контакты, **бронь**, RU / EN.

## Стек

- **Vite**, **React 18**, **React Router**
- Данные: `public/menu.json`
- Стили: `src/styles/`
- **Бронь на продакшене:** `public/reservation.php` + `reservation-config.php` на хостинге (SMTP или `mail()`), без Node

## Запуск разработки

```bash
npm install
npm run dev
```

**http://localhost:5177/** — Vite не выполняет PHP; форма брони с `VITE_RESERVATION_API_URL=/reservation.php` на локалке не отправится на реальный обработчик. Временно в `.env` можно указать **`https://грют.москва/reservation.php`** для проверки или тестировать бронь только на собранном сайте.

## Сборка

Перед сборкой в **`.env`** или **`.env.production`** задайте **`VITE_SITE_URL=https://грют.москва`** (без слэша в конце) — для `canonical` и `og:url`.

```bash
npm run build
```

Результат — папка **`dist/`** (в git не коммитится). В ней уже есть **`reservation.php`** из `public/`.

Превью:

```bash
npm run preview
```

## Деплой на Спринтхост (и аналоги с PHP)

1. В **`.env.production`** должно быть **`VITE_RESERVATION_API_URL=/reservation.php`** (уже по умолчанию в репозитории).
2. **`npm run build`**.
3. Залить **содержимое `dist/`** в корень сайта (рядом с тем местом, где лежит `index.html`).
4. В корне сайта на сервере создать **`reservation-config.php`**: скопировать с **`public/reservation-config.example.php`**, заполнить почту и SMTP (или `transport` → `mail`, если на хостинге работает только **`mail()`**).
5. Убедиться, что **PHP включён** для каталога и `reservation.php` не отдаётся как статический файл без выполнения.
6. Файл **`reservation-config.php`** не коммитить (в `.gitignore`).

Корень сайта должен содержать **`.htaccess`** из `public/` (SPA: несуществующие пути → `index.html`).

## Структура проекта

| Путь | Назначение |
|------|------------|
| `public/` | Статика в сборке: `menu.json`, изображения, шрифты, **`.htaccess`**, **`reservation.php`**, **`reservation-config.example.php`** |
| `src/` | React-приложение |

## Бронирование

Форма шлёт **POST** JSON на URL из **`VITE_RESERVATION_API_URL`**.

Поля: `bookingType`, `name`, `phone` (`+7` и 10 цифр), `date`, `time`, `guests`, `comment`, `source`.

**Успех на фронте:** ответ **JSON** с **`ok: true`** (см. `BookingPage.jsx`).

**Конфиг PHP:** `allowed_origins` — пустой массив разрешает только текущий хост; иначе список origin. Для кириллического домена в списке достаточно `https://грют.москва` — при наличии расширения **intl** скрипт добавит punycode-вариант для CORS.

## Фото блюд

Фото в **`public/menu-assets/`**, в `menu.json` поле `image` — путь от корня сайта, например `"/menu-assets/grill/..."`.

## Карта на контактах

При **`VITE_YANDEX_MAPS_API_KEY`** подгружается Яндекс.Карты; иначе — OpenStreetMap. В ограничении по Referer укажите домен сайта и `localhost`.

## Лицензия

Приватный проект.
