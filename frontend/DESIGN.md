# Web-Taklifnoma — Design System (landing `/`)

Direction: **«Приглашение, которое оживает»** — modern Uzbek luxury stationery.
Heavy cotton paper, real gold foil, wax seal, a thread of adras silk, a hint of Samarkand
majolica blue. Quiet, warm, expensive. Nothing glows, nothing is glass.

Scope: the landing page first. Editor, cabinet and admin keep their current styles until
we decide to migrate them. Tokens live as CSS variables on `:root` / `html.light`.

---

## 1. Color

Two themes: **Night** (default, ink) and **Day** (ivory paper). Every color has one job.

| Token | Night | Day | Role |
|---|---|---|---|
| `--bg` | `#0B1020` ink | `#F6F1E7` ivory | Page background |
| `--surface` | `#121A33` | `#FFFCF6` paper | Cards, FAQ rows, catalog tiles |
| `--surface-2` | `#1A2445` | `#EFE7D8` | Hover / pressed surface, inputs |
| `--line` | `rgba(245,239,227,.12)` | `rgba(20,26,51,.12)` | Hairlines, dividers, borders |
| `--text` | `#F5EFE3` | `#141A33` | Headings, body text |
| `--text-2` | `#BDB5A4` | `#4A4F63` | Secondary text, captions |
| `--text-3` | `#8A8578` | `#6F7180` | Meta, disabled labels (≥ 4.5:1 on `--bg`) |
| `--gold` | `#C9A45C` | `#C9A45C` | **Primary**: main CTA fill, active filter, foil |
| `--gold-ink` | `#D9B873` | `#8A6A2B` | Gold used as *text* or a link (contrast-safe) |
| `--on-gold` | `#0B1020` | `#0B1020` | Text on a gold fill (8.5:1) |
| `--lapis` | `#5A8BD6` | `#24508F` | **Accent** (rare): focus ring, the single "live" marker in the phone scene |
| `--turquoise` | `#4FB3AA` | `#1F6F69` | Majolica detail in 3D/ornament only, never for UI text blocks |
| `--success` | `#5DB383` | `#2F7A52` | RSVP "Приду", success toasts |
| `--danger` | `#E07A6E` | `#B23B30` | Errors |

Rules
- Gold fill appears on **one** action per screen. Everything else is text or hairline.
- `gold-gradient-text` is removed from the landing; the only "foil" is in 3D (PBR) and on the
  hero poster. Flat gold `--gold-ink` for one word in the H1 is allowed.
- No purple, no blurred color blobs, no `backdrop-blur` cards. The header keeps a solid
  `--bg` at 92% opacity, no glass.

## 2. Typography

| Family | Use |
|---|---|
| **Cormorant Garamond** (500/600, italic 500) | All display: H1, H2, step numbers, big stats, names on the card |
| **Inter** (400/500/600) | Interface, body, buttons, filters, prices |
| Great Vibes | Only the couple's names inside the 3D invitation card. Nowhere else |

Playfair Display and Montserrat are not used on the landing (they stay for templates).
Both families have Cyrillic and Latin Extended; check `oʻ gʻ` (U+02BB) renders in Cormorant
before sign-off, with a fallback to `U+2018` if it doesn't.

Scale (fluid, mobile → desktop)

| Token | Size / line-height | Tracking | Use |
|---|---|---|---|
| `display-xl` | `clamp(3rem, 7.5vw, 7.25rem)` / 0.95 | -0.035em | H1 only |
| `display-l` | `clamp(2.25rem, 5vw, 4.5rem)` / 1.0 | -0.03em | H2 section titles |
| `display-m` | `clamp(1.75rem, 3vw, 2.5rem)` / 1.1 | -0.02em | Feature titles, FAQ question on desktop |
| `numeral` | `clamp(4rem, 10vw, 9rem)` / 0.85 | -0.04em | Step numbers 1·2·3, italic |
| `body-l` | 1.125rem / 1.6 | 0 | Lead paragraphs |
| `body` | 1rem / 1.6 | 0 | Body (never below 16px) |
| `small` | 0.875rem / 1.5 | 0 | Card meta, prices |
| `eyebrow` | 0.75rem / 1.4, 600 | 0.16em, uppercase | Section labels, sparingly |

Line length 60–68ch. Headings left-aligned by default; centered only for the final CTA.

## 3. Spacing & layout

- 4px base: `4 8 12 16 24 32 48 64 96 128 192`.
- Section rhythm is **uneven on purpose**: `clamp(96px, 12vw, 192px)` between story scenes,
  `64px` inside the catalog. Pinned scenes are 150–250vh tall.
- Content width 1280px; text column 640px; 12-col grid on desktop, text often sits on cols
  1–6 or 7–12 (asymmetric), 3D fills the opposite side.
- Mobile gutter 20px; tap targets ≥ 44px.

## 4. Shape & depth

- Radius: `2px` buttons and inputs (stationery edge), `16px` catalog cards, `28px` phone
  frames only, `999px` only for language/filter chips.
- Shadows (two only):
  - `--shadow-paper`: `0 1px 0 rgba(0,0,0,.04), 0 12px 32px -12px rgba(11,16,32,.35)`
  - `--shadow-lift`: `0 30px 60px -20px rgba(11,16,32,.55)` (hover / picked card)
- Ornament: girih/islimi as 1px `--line` strokes or embossed in 3D. Never as a full-screen
  pattern.

## 5. Motion

| Token | Curve | Character |
|---|---|---|
| `--ease-paper` | `cubic-bezier(.2,.75,.15,1)` | Paper settles: fast start, long soft landing |
| `--ease-metal` | `cubic-bezier(.7,0,.2,1)` | Weighty hinge / foil, slow-fast-slow |
| `--ease-thread` | `linear` (scrubbed) | Gold thread drawing on scroll |

Durations 240ms (UI), 600ms (reveals), 900–1200ms (scene transitions).
Text reveals are line-masked (clip + translateY 100%→0), staggered 60ms.
Scroll: Lenis + GSAP ScrollTrigger (scrubbed). `prefers-reduced-motion`: no pin, no
parallax, static scene frames with 200ms opacity only.

## 6. Components

- **Primary button**: `--gold` fill, `--on-gold` Inter 600, radius 2px, 52px tall.
  Hover: fill darkens 6% and a 1px foil line slides along the bottom. Focus: 2px `--lapis`
  ring, 3px offset. Disabled: `--surface-2` fill, `--text-3`.
- **Secondary**: text + 1px underline in `--gold-ink`, arrow nudges 4px on hover.
- **Quiet**: plain `--text-2`, underline on hover.
- **Filter chips**: 999px, `--line` border; active = `--gold` fill.
- **Catalog card**: DOM, `--surface`, `--shadow-paper`, 16px radius, phone-shaped preview
  that auto-scrolls on hover, 4° tilt toward pointer, title in Inter 600, price in
  `--text`, old price struck in `--text-3`. Website badge is a small eyebrow, not a pill.
- **Stats row**: three numerals in Cormorant, divided by 1px vertical `--line`, no box.
- **FAQ**: full-width rows separated by hairlines, question in `display-m`/Inter on
  mobile, `+` rotates to `×`, height animated, `aria-expanded`.
- **Header / footer**: unchanged structure; restyled with tokens (solid bg, hairline).

## 7. Imagery, icons & 3D

- The product *is* the imagery: real templates from `templates/sites` on the phone and
  catalog previews. No stock couples, no AI-generated people.
- Icons: lucide only for UI affordances (chevrons, globe, sun/moon). Features are shown by
  small 3D objects, not icons.
- 3D materials: cotton paper (roughness .9, subtle normal emboss), gold foil (metalness 1,
  roughness .28, light anisotropy), wax seal (deep `#7A1E22` night / `#8E2A2A` day,
  roughness .45), adras ribbon (ikat texture ≤ 1024px), lapis/turquoise tile details.
- Light: Night — warm key `#FFD9A0` from upper left, cool lapis rim, low ambient.
  Day — soft window light `#FFF4E2`, higher ambient, lighter contact shadow.
  Environment: `RoomEnvironment` via PMREM. Bloom only on foil highlights (threshold .9),
  disabled on low tier.
- Poster: a pre-rendered WebP/AVIF of the closed envelope for each theme, shown before
  WebGL and as the no-WebGL fallback.
