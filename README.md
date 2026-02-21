# Grut Menu Web

Одностраничный сайт меню ресторана Grut: разделы меню, карточки блюд с фото и ценой, модалка с составом, кнопка «Скачать меню» (PDF). Языки: RU / EN / 中文.

## Стек

- **Vite** + **React 18**
- Данные: `public/menu.json`
- Стили: CSS (без UI-библиотек)

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется по адресу http://localhost:5173

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

- `public/` — `menu.json`, PDF меню, изображения
- `src/components/` — Header, SectionTabs, DishGrid, DishModal, DownloadButton
- `src/context/` — LangContext
- `src/hooks/` — useLang, useMenuData, useActiveSection
- `src/i18n/` — переводы интерфейса и блюд (RU, EN, ZH)
- `src/constants.js` — пути, ключи, `getAssetUrl()`

## Лицензия

Приватный проект.
