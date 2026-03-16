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

Откроется по адресу: **http://localhost:5173/GrutMenuWeb/** (или без пути, если `base` не задан).

## Сборка

```bash
npm run build
```

Результат сборки попадает в папку **`dist/`**. Эту папку в репозиторий не коммитят (она в `.gitignore`); её создаёт команда `build` при деплое.

Превью продакшен-сборки:

```bash
npm run preview
```

## Деплой на GitHub Pages

1. В репозитории: **Settings → Pages → Source** — **GitHub Actions**.
2. При пуше в `main` workflow собирает проект и выкладывает содержимое `dist/` на Pages.
3. Сайт: `https://<username>.github.io/GrutMenuWeb/`

## Структура проекта

| Путь | Назначение |
|------|------------|
| `public/` | Статика: `menu.json`, папка `menu/` с фото блюд, `cocktails/`, `images/`, `fonts/`, `favicons/`, PDF для скачивания меню |
| `public/menu/` | Одна папка для фото блюд; внутри — подпапки по разделам: `grill/`, `garniry/`, `zacuski/`, `sousy/`, `supy/`, `pasta/`, `myaso_ptica/`, `ryba_moreprodukty/`, `deserty/`, `k_pivu/`, `hleb/`, `detskoe/`, `zacuski_kompaniya/`, `salaty/` |
| `src/components/` | Header, Footer, Layout, SectionTabs, DishGrid, DishModal, DownloadButton, IconArrow, CocktailsCompositionModal |
| `src/context/` | LangContext (язык) |
| `src/hooks/` | useLang, useMenuData, useActiveSection |
| `src/i18n/` | Переводы интерфейса и названий/описаний блюд (RU, EN) |
| `src/pages/` | HomePage, MenuPage, CocktailsPage |
| `src/styles/` | Разбитые CSS-файлы |
| `src/constants.js` | Пути к PDF и menu.json, ключи localStorage, `getAssetUrl()` |
| `src/routes.jsx` | Маршруты приложения |
| `scripts/` | Скрипты миграции/организации фото (при необходимости) |

Папка **`dist/`** не хранится в репозитории: она создаётся при `npm run build` и используется при деплое.  
Папка **`menu_old`** в проекте не используется (удалена); все актуальные фото блюд — в `public/menu/<раздел>/`.

## Фото блюд

- Все фото блюд лежат в **`public/menu/`**.
- Внутри — подпапки по разделам меню (id из `menu.json`: `grill`, `garniry`, `zacuski` и т.д.).
- В `menu.json` у каждого блюда поле `image`, например: `"/menu/grill/porterhouse.webp"`.
- Рекомендуемое соотношение сторон фото: 4:3.
- Для блюд без фото в JSON указывают `"/images/placeholder.svg"`.

## Лицензия

Приватный проект.
