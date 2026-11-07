# Задача 06 — Шаблон «Malika & Ulugʻbek / Silk Gold» (`MalikaUlugbekWeddingSite.tsx`, ID 9)

Прочитай `prompts/templates/00_COMMON_RULES.md` и следуй ему. Используй `frontend/src/templates/sites/shared/`.

⚠️ В этом шаблоне есть КРИТИЧЕСКИЕ баги данных — их чинить в первую очередь, до дизайна.

## Критические баги
1. **Имена родителей захардкожены**: «Akmal va Dilbar Karimovlar», «Rustam va Nodira Soliyevlar» — их видят гости КАЖДОЙ пары, которая купила шаблон. В редакторе при этом есть секция `parents` («Имена родителей»).
   → Брать из новых необязательных полей `SiteData`: `brideParents?: string`, `brideFamily?: string`, `groomParents?: string`, `groomFamily?: string`. Если пусто на реальном сайте — блок родителей скрыт. В превью — демо из `shared/demo`.
2. **История любви захардкожена**: таймлайн 2022/2023/2024 «Ilk uchrashuv…» показывается всем и игнорирует `data.loveStory`. Секция не учитывает `isSectionVisible('loveStory')`.
   → Если `data.loveStory` — строка: показать как текст/абзацы. Поддержать необязательное `data.loveStoryItems?: { year: string; title: string; desc?: string }[]` для таймлайна. Если ничего нет — секция скрыта на реальном сайте. Обернуть в `isSectionVisible('loveStory')`. То же для секции хозяев — `isSectionVisible('parents')`.
3. **RSVP показывает «успех» всегда**: `handleRsvpSubmit` ставит `setRsvpSubmitted(true)` даже если запрос упал, и закрывает модалку через 2.2 с. → Успех только при `rsvpState.isSuccess`, ошибка — сообщение и форма остаётся.
4. **Нет переводов вообще**: все строки на узбекском прямо в JSX («NIKOH TO'YIGA TAKLIFNOMA», «KATTA HURMAT BILAN», «Bizning hikoyamiz», «Yuklangan rasmlar», «Tashrifingizni tasdiqlang»…), `lang` берётся, но не используется, переключателя языка нет. → Сделать объект переводов `ru/uz/en` как в `HilalWeddingSite.tsx`, переключатель языка как в других шаблонах, `onLanguageChange`.
5. Дефолтная карта `8600 7710 4420 8911`, дата выводится как `2026 . 10 . 10` (`replace(/-/g, ' . ')`), Unsplash по умолчанию, арабский шрифт `Traditional Arabic` (нет на Android).
6. Строка «Yuklangan rasmlar: N / 6» — это служебный счётчик для владельца, гостям не нужен. Показывать только в `isPreview`.

## Арт-дирекшн
Шёлк и золото, светлый «champagne silk». Сейчас основа неплохая (`#FAF7F2`, serif) — усилить материал.
- Фон: шёлковые переливы — 2–3 очень мягких диагональных градиента с медленным (20–30 с) сдвигом `background-position`, выключается в `useCalmMotion`. Без частиц `GoldParticleSystem` на всём сайте — оставить только на обложке, ≤ 10.
- Обложка: тёмный шёлк с золотой рамкой, Bismillah/аят шрифтом `Amiri` (`.font-arabic`), имена, кнопка «свайп чтобы открыть» — сохранить, но:
  - добавить клавиатурную/тап-альтернативу (кнопка «Открыть» для тех, у кого не получается свайп — пожилые гости),
  - `role="slider"` + `aria-label`, порог 70%.
- Убрать «рамку телефона» `max-w-[450px] shadow border-x` на десктопе — вместо неё по центру колонка 480px на шёлковом фоне без «устройства».
- Блок хозяев: две колонки «Kelin tomondan / Kuyov tomondan» — оставить идею, но без карточек `bg-white/60`, разделить тонкой вертикальной золотой линией.
- Шрифты: `Cormorant Garamond` + `Montserrat` + `Amiri`.

## Сохранить
ID секций для `malika`: `hero, couple, parents, schedule, countdown, loveStory, gallery, venue, rsvp, giftCard` — каждый блок должен реально скрываться по своему ID (сейчас часть блоков не обёрнута). Музыку, лайтбокс, RSVP-модалку, свайп.

## Что указать в отчёте
Список новых полей `SiteData` (`brideParents`, `brideFamily`, `groomParents`, `groomFamily`, `loveStoryItems`) — их нужно добавить в редактор (`getEditorFieldsForTemplate` в `App.tsx`) отдельной задачей. Сам редактор в этой задаче НЕ трогать.

## Критерии
- В коде нет ни одного реального имени/фамилии, кроме демо из `shared/demo`, и они видны только в `isPreview`.
- Переключение языка меняет ВСЕ тексты.
- Отчёт по формату.
