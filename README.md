# Vilfood — “Sunlight, sealed since 2007.”

A premium, single-page marketing site for **Vilfood** (VIL FOOD LLC) — natural
Armenian fruit & vegetable preserves, made in Hrazdan since 2007. Built to feel
handcrafted and editorial: a 3D glass-jar hero, buttery smooth scroll, and
scroll-driven motion, trilingual in **English / Русский / Հայերեն**.

---

## Run it

Requires **Node 18+** (built with Node 24). This machine uses `nvm`, so:

```bash
nvm use 24            # or: nvm install 24
cd vilfood-app
npm install
npm run dev           # http://localhost:5173
```

Other scripts:

```bash
npm run build         # type-check (tsc) + production build → dist/
npm run preview       # serve the production build locally
```

---

## Stack & why

| Library | Role | Why |
|---|---|---|
| **React + Vite + TypeScript** | App + build | Fast HMR, typed components, tiny config. |
| **Tailwind CSS** | Styling + design tokens | All brand colors, type and spacing live in [`tailwind.config.ts`](tailwind.config.ts) — change the palette in one place. |
| **Lenis** | Smooth scroll | Inertia scrolling, synced to GSAP’s ticker so it shares one clock with ScrollTrigger (no jitter). |
| **GSAP + ScrollTrigger** | Scroll motion | Pinned horizontal product showcase, reveals, counters, the headline entrance. |

The hero is a full-bleed illustrated landscape image with a cream legibility
scrim — light, no WebGL, works everywhere. (An earlier version used a React
Three Fiber 3D jar; that stack was removed, cutting ~245 KB gz from the bundle.)

---

## Where to drop in real assets

Placeholder imagery is reused from the brand’s packaging artwork and is clearly
swappable. All images live in [`public/img/`](public/img).

- **Product-line photos** — [`src/components/sections/Products.tsx`](src/components/sections/Products.tsx).
  Each card currently shows `hero-jar.webp` on a tinted panel. Replace the
  `<img src="/img/hero-jar.webp">` (and the `THEME[...].fruit` accent) with a real
  photo per line (compotes / jams / vegetables / imported).
- **Process imagery** — `VISUALS` array at the top of
  [`Process.tsx`](src/components/sections/Process.tsx) (harvest → prepare → seal → deliver).
- **Retailer logos** — `RETAILERS` array in
  [`WhereToBuy.tsx`](src/components/sections/WhereToBuy.tsx). They render as text
  wordmarks; drop real SVGs into `public/img/` and swap the `<span>` for an `<img>`.
- **Hero background** — `public/img/hero-landscape.webp` (+ `.jpg` fallback),
  referenced in [`Hero.tsx`](src/components/sections/Hero.tsx). Swap the file (keep
  a wide ~16:9 image) and adjust the `object-[68%_center]` focal point + the
  cream scrim gradients if the new image needs a different text area. `favicon.svg`
  lives in `public/`.
- **Logo** — the `vilfood` wordmark is `public/img/wordmark-dark.png` (light bg)
  and `wordmark-white.png` (dark bg), used by [`Wordmark.tsx`](src/components/Wordmark.tsx).

---

## Translations (EN / RU / HY)

All copy lives in one file: [`src/lib/i18n.tsx`](src/lib/i18n.tsx).

- `en` is the **complete source of truth**.
- `ru` and `hy` are typed as deep-partial objects merged over `en` at runtime, so
  **any missing key falls back to English automatically**. RU is complete; HY
  covers nav, headings and labels — fill in the rest by adding keys to the `hy`
  object (product item copy, etc.).
- The toggle (EN · RU · AM) is [`LangToggle.tsx`](src/components/LangToggle.tsx);
  choice persists to `localStorage` and sets `<html lang>`.

Fonts use per-glyph fallback (Fraunces/Hanken for Latin, Playfair/Noto Sans for
Cyrillic, Noto Serif/Sans Armenian for Armenian) so each script renders in an
appropriate face — see the `<link>` in [`index.html`](index.html) and the CSS
variables in [`src/index.css`](src/index.css).

---

## Tuning the hero

The hero lives in [`src/components/sections/Hero.tsx`](src/components/sections/Hero.tsx):

- **Background image** — the `<picture>` points at `hero-landscape.webp` / `.jpg`.
  `object-[68%_center]` sets the focal point (which slice stays visible when the
  image is cropped to fill); nudge it if a new image crops awkwardly.
- **Legibility scrims** — two responsive gradient layers (desktop = cream wash on
  the left; mobile = soft overall wash) plus top/bottom fades that blend into the
  nav and the Story section. Tune their opacity/stops if your image is darker or
  lighter behind the text.
- **Headline entrance** — the GSAP timeline (slide-up reveal + staggered fades).
  The line masks keep `pb-[0.2em] -mb-[0.2em]` so descenders/commas aren't clipped.

---

## Quality notes

- **Responsive**, mobile-first; type scales with `clamp()`; the hero image fills
  via `object-cover` and the scrim swaps per breakpoint; layouts reflow (swipeable
  products, stacked grids).
- **Accessible**: semantic landmarks, labelled form with inline validation +
  `aria-invalid`, keyboard-navigable, on-brand focus rings, alt text.
- **Reduced motion** is fully respected — Lenis, pinning and parallax are
  disabled and reveals become plain (or instant).
- **Performance**: no WebGL/3D, optimized hero image (~200 KB webp), code-split
  motion chunk, lazy nothing-blocking.

The contact form is **front-end only** — `onSubmit` validates then stubs a
success state (`Contact.tsx`). Wire it to a real endpoint/email service to go live.
