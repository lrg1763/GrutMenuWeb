# GRUT Menu Web

Сайт-меню ресторана ГРЮТ: главная, разделы меню с карточками блюд (фото, цена), модальное окно с составом, кнопка «Скачать меню» (PDF), страница коктейлей, переключатель языков (RU / EN).

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

## Структура проекта

| Путь | Назначение |
|------|------------|
| `public/` | Статика: `menu.json`, папка `menu-assets/` с фото блюд, `cocktail-images/` с фото коктейлей, `images/`, `fonts/`, `favicons/`, `.htaccess`, PDF для скачивания меню |
| `public/menu-assets/` | Фото блюд; внутри — подпапки по разделам: `grill/`, `garniry/`, `zacuski/`, `sousy/`, `supy/`, `pasta/`, `myaso_ptica/`, `ryba_moreprodukty/`, `deserty/`, `k_pivu/`, `hleb/`, `detskoe/`, `zacuski_kompaniya/`, `salaty/` |
| `public/cocktail-images/` | Фото коктейлей (например, `1.jpg`, `2.jpg`) |
| `src/components/` | Header, Footer, Layout, SectionTabs, DishGrid, DishModal, DownloadButton, IconArrow, CocktailsCompositionModal, ErrorBoundary |
| `src/context/` | LangContext (язык) |
| `src/hooks/` | useLang, useMenuData, useActiveSection |
| `src/i18n/` | Переводы интерфейса и названий/описаний блюд (RU, EN) |
| `src/pages/` | HomePage, MenuPage, CocktailsPage |
| `src/styles/` | Разбитые CSS-файлы |
| `src/constants.js` | Пути к PDF и menu.json, ключи localStorage, `getAssetUrl()` |
| `src/routes.jsx` | Маршруты приложения |
| `scripts/` | Скрипты миграции/организации фото (при необходимости) |

Папка **`dist/`** не хранится в репозитории: она создаётся при `npm run build` и используется при деплое.

## Фото блюд

- Все фото блюд лежат в **`public/menu-assets/`**.
- Внутри — подпапки по разделам меню (id из `menu.json`: `grill`, `garniry`, `zacuski` и т.д.).
- В `menu.json` у каждого блюда поле `image`, например: `"/menu-assets/grill/porterhouse.webp"`.
- Рекомендуемое соотношение сторон фото: 4:3.
- Для блюд без фото в JSON указывают `"/images/placeholder.svg"`.

## Карта на странице контактов

На странице «Контакты» отображается карта с адресом (г. Москва, ул. Шипиловская, 28A). Если в `.env` задан ключ `VITE_YANDEX_MAPS_API_KEY`, подгружается карта Яндекса; при ошибке или без ключа показывается OpenStreetMap. В настройках ключа Яндекса в «Ограничение по HTTP Referer» укажите: `грют.москва`, `localhost`, `127.0.0.1` (каждый с новой строки).

## Лицензия

Приватный проект.
