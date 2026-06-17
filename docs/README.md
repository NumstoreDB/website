# Numstore Docs Site

A standalone static site that publishes the **Numstore documentation** and **blog**. Pure Vite + Markdown — no framework. Lives independently from the marketing site in the parent repo and can be moved to its own repository at any time.

## Stack

- [Vite](https://vitejs.dev) for dev server + production bundling
- [`markdown-it`](https://github.com/markdown-it/markdown-it) for rendering, with `markdown-it-anchor` for heading permalinks
- One small custom plugin (`plugin-md-site.js`) that wires markdown into Vite's dev server and build output

That's it. No Vue, no React, no SSG framework, no client-side router.

## Layout

```
docs/
  index.md              # site landing page (becomes dist/index.html)
  docs/                 # docs section (one .md per page)
    index.md            # /docs/
    getting-started.md  # /docs/getting-started/
    ...
  blog/                 # blog section (one .md per post)
    index.md            # /blog/
    welcome.md          # /blog/welcome/
    ...
  assets/               # images / files referenced from markdown
    architecture.svg    # → /assets/architecture.svg
  src/
    template.html       # shared HTML wrapper for every page
    style.css           # site CSS (Vite bundles + hashes it)
  index.html            # Vite entry stub (overwritten by the plugin)
  plugin-md-site.js     # the custom Vite plugin
  vite.config.js
  package.json
```

## Run it

```sh
cd docs
npm install
npm run dev          # http://localhost:5173
npm run build        # static site in docs/dist/
npm run preview      # serve dist/ locally
```

The build produces a plain static site:

```
dist/
  index.html
  docs/
    index.html
    getting-started/index.html
    installation/index.html
    smartfiles/index.html
    enterprise/index.html
  blog/
    index.html
    welcome/index.html
    why-numstore/index.html
  assets/
    architecture.svg
  _static/
    index-<hash>.css
```

Drop `dist/` onto any static host (S3, Cloudflare Pages, Netlify, GitHub Pages, nginx). Clean URLs work out of the box thanks to per-page `index.html` files.

## Authoring

### Add a docs page

Create `docs/docs/<slug>.md` with front matter:

```md
---
title: My new page
description: Optional, one-line summary.
---

# My new page

Markdown body…
```

The sidebar regenerates automatically.

### Add a blog post

Create `docs/blog/<slug>.md`:

```md
---
title: A new release
date: 2026-04-01
description: One-line summary.
---

# A new release

…
```

Posts are listed newest-first by `date`. The blog index page renders the list via the `{{posts}}` token; the docs index does the same with `{{docs}}`.

### Reference an asset

Drop the file in `docs/assets/` and reference it absolutely:

```md
![architecture](/assets/architecture.svg)
```

That path resolves the same way in `npm run dev` and in the built site.

### Front matter fields

| Field         | Type   | Used for                                  |
| ------------- | ------ | ----------------------------------------- |
| `title`       | string | `<title>` tag, sidebar label, list label  |
| `description` | string | Optional blurb on index lists             |
| `date`        | string | Sorting blog posts (any sortable format)  |

## How the plugin works

`plugin-md-site.js` does three things:

1. **Dev middleware.** For any URL that matches a markdown page (e.g. `/docs/getting-started/`), the plugin reads the corresponding `.md`, renders it with `markdown-it`, injects it into `src/template.html`, and serves the result. `/assets/*` is served straight from `./assets/`.
2. **Build emission.** After Vite has bundled `src/style.css` (so we know the hashed filename), the plugin reads `dist/index.html` to grab that hashed `<link>` href, then writes one `index.html` per page using the same template. Assets are copied into `dist/assets/`.
3. **Index tokens.** The strings `{{docs}}` and `{{posts}}` in any markdown file expand to an auto-generated list of pages in that section.

No virtual modules, no Vue, no SSR. If you want to swap in a different markdown engine, replace the `markdown-it` setup at the top of `plugin-md-site.js`.

## Customizing the chrome

- **Template** (top bar, sidebar, footer): `src/template.html`
- **Styles**: `src/style.css`
- **Navigation grouping**: the `renderNav` function in `plugin-md-site.js`

Everything outside the markdown body is HTML you can edit by hand.
