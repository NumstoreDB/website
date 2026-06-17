# Numstore Website

The Numstore marketing site — landing, about, and contact pages.

Built with **Vue 3 + Vite + Tailwind CSS + TypeScript**. Docs and blog live on
separate sites and are linked externally; this repo contains only the marketing
surface.

## Stack

- Vue 3 (Composition API, `<script setup>`)
- Vite 6
- Tailwind CSS 3
- Vue Router 4
- TypeScript 5

No UI library, no icon library (inline SVGs), no markdown libs, no state manager,
no date lib, no HTTP client (uses `fetch`). Fonts are self-hosted via
`@fontsource/*` so the site does not call Google Fonts at runtime.

## Getting started

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

## Configuration

### YouTube subscriber count

The header shows a YouTube subscriber chip when an API key is provided:

```bash
# .env.local
VITE_YOUTUBE_API_KEY=your-google-api-key
```

Without the key the YouTube chip renders as a plain icon link with no count.
The channel id and handle live in `src/config/site.ts`.

### GitHub repo slug

The GitHub stars chip reads the repo owner/name from `src/config/site.ts`:

```ts
github: { owner: 'numstore', repo: 'numstore' },
```

It hits `https://api.github.com/repos/{owner}/{repo}` and caches the result in
`sessionStorage` for one hour. If the fetch fails (e.g. rate-limited) the chip
falls back to a plain icon link.

### Swapping placeholder copy and links

Everything that might change lives in `src/config/site.ts`:

- Name, tagline, description
- GitHub / YouTube / LinkedIn handles
- External URLs (docs, blog)
- Contact email
- Product cards (name, tagline, blurb, features, learn-more href, accent color)

Customer logos for `<LogoCloud />` are placeholder initials in the component
itself — replace the `logos` array with real `<svg>` marks when you have them.

About-page timeline entries live in `src/components/Timeline.vue`. Feature pillar
copy and metrics live in `src/components/FeaturesSection.vue`. Hero stats live in
`src/components/Hero.vue`.

## File layout

```
src/
  components/  All UI sections (each page composes these)
  views/       LandingView, AboutView, ContactView
  router/      Vue Router setup
  config/      site.ts — shared copy and links
  assets/
  App.vue
  main.ts
  style.css
```

## Routes

- `/` — landing
- `/about` — company / mission / timeline
- `/contact` — contact form + alternative email

Documentation and Blog are external links only (`https://docs.numstore.com`,
`https://blog.numstore.com`); there are no internal routes for them.

## Contact form

`<ContactForm />` POSTs JSON to `/api/contact` on submit. The endpoint is a
placeholder — wire it up to whatever backend handles inbound contact (e.g. an
edge function that forwards to your CRM or Slack). The form swaps to an inline
success state regardless of network result so a missing backend will not block
local development.

## Accessibility & motion

- Default theme is dark; `<html class="dark">` is set in `index.html`. Tailwind's
  `dark:` variants are used throughout so a light theme can be added later
  without rewriting components.
- All animations respect `prefers-reduced-motion`.
- Focus rings are visible on every interactive element.
- Form fields have associated labels; required fields show validation errors
  inline.
- All tap targets are at least 44px tall.

## Notes on dependencies

The only runtime dependencies beyond Vue/Vue Router are the three
`@fontsource/*` font packages — included so the site does not depend on
Google Fonts at runtime. Everything else is dev-only.
