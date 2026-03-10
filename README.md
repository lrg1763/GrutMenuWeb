# GRUT Menu Web

Одностраничный сайт меню ресторана GRUT: разделы меню, карточки блюд с фото и ценой, модалка с составом, кнопка «Скачать меню» (PDF). Языки: RU / EN / 中文.

## Стек

- **Vite** + **React 18**
- Данные: `public/menu.json`
- Стили: CSS, шрифт **Manrope** (Google Fonts)

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется по адресу: **http://localhost:5173/GrutMenuWeb/**

## Сборка

```bash
npm run build
```

Результат в папке `dist`.

Превью продакшен-сборки:

```bash
npm run preview
```

## Деплой на GitHub Pages

1. В репозитории: **Settings → Pages → Build and deployment → Source** выберите **GitHub Actions**.
2. При пуше в ветку `main` workflow `.github/workflows/deploy-pages.yml` собирает проект и выкладывает `dist` на GitHub Pages.
3. Сайт будет доступен по адресу: `https://<username>.github.io/GrutMenuWeb/`

## Структура

- `public/` — `menu.json`, папка `images/` с фото блюд. Для кнопки «Скачать меню» положите в `public/` файл `1 rus.pdf` (или измените `PDF_MENU_PATH` в `src/constants.js`).
- `src/components/` — Header, SectionTabs, DishGrid, DishModal, DownloadButton
- `src/context/` — LangContext
- `src/hooks/` — useLang, useMenuData, useActiveSection
- `src/i18n/` — переводы интерфейса и блюд (RU, EN, ZH)
- `src/constants.js` — пути, ключи, `getAssetUrl()`, плейсхолдер при ошибке загрузки фото

## Фото блюд

Фото лежат в `public/images/` в подпапках по разделам меню (названия на английском): `appetizers`, `appetizers-party`, `salads`, `soups`, `grill`, `burgers`, `pasta`, `meat-poultry`, `fish-seafood`, `sides`, `sauces`, `desserts`, `beer-snacks`, `bread`. В `menu.json` путь к фото: `"/images/имя-папки/имя-файла.jpg"` (например `/images/appetizers/bruschetta-avocado.jpg`). Рекомендуемое соотношение 4:3 (1200×900 px). Плейсхолдер для блюд без фото: `/images/placeholder.svg`.

## Лицензия

Приватный проект.
