# Задача 00 — Общая база для шаблонов (делать ПЕРВОЙ)

Прочитай `prompts/templates/00_COMMON_RULES.md` и следуй ему.

## Проблема
В 7 файлах шаблонов скопированы одни и те же куски: `API_URL` с фолбэком `http://localhost:3000`, `getMediaUrl`, логика `isSectionVisible` с алиасами, копирование номера карты, форматирование даты, ссылки на карты, частицы. Из-за копий баги чинятся в одном месте и остаются в другом.

## Сделай
Создай папку `frontend/src/templates/sites/shared/` с файлами (только хелперы и маленькие компоненты, БЕЗ изменения существующих шаблонов — их переведут на shared следующие задачи):

1. `media.ts`
   - `getMediaUrl(url?: string): string` — повтори текущую логику из `HilalWeddingSite.tsx` (blob:, data:, http(s) — как есть; относительные пути — через хост API). Фолбэк API — `import.meta.env.VITE_API_URL || '/api'`, как в `App.tsx`, НЕ localhost.
2. `sections.ts`
   - `createSectionVisibility(hidden: string[])` → функция `isVisible(id)`, которая учитывает алиасы: `giftCard|gift`, `dateVenue|venue|calendar`, `photo|couple|showHeroPhoto`. Логику возьми из `SimpleWeddingSite.tsx`.
3. `format.ts`
   - `formatEventDate(date: string, lang: 'ru'|'uz'|'en')` → `{ day, month, monthShort, year, weekday, full }`. Для `uz` используй свои массивы месяцев/дней недели на латинице (`yanvar, fevral, mart, aprel, may, iyun, iyul, avgust, sentabr, oktabr, noyabr, dekabr`; `dushanba, seshanba, chorshanba, payshanba, juma, shanba, yakshanba`), т.к. `Intl` на части Android отдаёт кириллицу или английский.
   - `formatCardNumber(raw: string)` → группы по 4 цифры. `maskCardExample()` → `'8600 •••• •••• ••••'`.
   - Используй `parseEventDateTime` из `frontend/src/utils/timer.ts`, не пиши парсер заново.
4. `maps.ts`
   - `getYandexMapsUrl(venue, address)`, `getGoogleMapsUrl(venue, address)` — URL из общих правил.
5. `calendar.ts`
   - `downloadIcs({ title, start: Date, durationMinutes, location, description })` — генерирует `.ics` (корректный `DTSTART` в UTC, экранирование `,;\n`), скачивает через Blob.
   - `getGoogleCalendarUrl(...)`.
6. `useCopy.ts`
   - хук `useCopyToClipboard()` → `{ copied, copy(text) }`, с фолбэком через `textarea + execCommand`, если `navigator.clipboard` недоступен (WebView Telegram).
7. `demo.ts`
   - `DEMO_CONTENT` по языкам: узбекские демо-имена (жених `Jasur`, невеста `Madina` — одинаково во всех языках), демо-ресторан `Navroʻz saroyi`, демо-адрес на трёх языках, демо-программа вечера (4 пункта), демо-история любви (2–3 предложения), демо-имена родителей. Этим будут пользоваться шаблоны ТОЛЬКО в `isPreview`.
   - `isDemo(isPreview, value)` хелпер: вернуть значение пользователя или демо только в превью, иначе `undefined`.
8. `motion.ts`
   - `useCalmMotion(isPreview)` → `true`, если `useReducedMotion()` или `isPreview` — шаблоны будут выключать бесконечные анимации.
9. `index.ts` — реэкспорт всего.

Шрифты: в `frontend/src/index.css` добавь в существующий `@import` Google Fonts семейство `Amiri:wght@400;700` и класс `.font-arabic` из общих правил.

## Ограничения
- Не меняй ни один `*WeddingSite.tsx` / `TaklifetPinkSite.tsx` в этой задаче.
- Без новых npm-зависимостей.
- Каждая функция — с TypeScript-типами, без `any`.

## Критерии готовности
- `npx tsc -b --noEmit` без ошибок, `npm run build` проходит.
- Отчёт по формату из общих правил.
