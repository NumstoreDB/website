// A small Vite plugin that turns docs/*.md and blog/*.md into a static site.
//
// Build: Vite produces dist/index.html (and hashes the CSS). We read that
// hashed CSS path, then rewrite dist/index.html and emit dist/<section>/<slug>/index.html
// for each markdown page.
//
// Dev: middleware renders markdown on the fly and serves /assets/* from ./assets/.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const md = new MarkdownIt({ html: true, linkify: true, typographer: true }).use(anchor, {
  permalink: anchor.permalink.linkInsideHeader({
    symbol: '#',
    placement: 'after',
    class: 'h-anchor',
    ariaHidden: true,
  }),
  slugify: (s) =>
    s
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-'),
})

const MIME = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
  json: 'application/json',
  txt: 'text/plain; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
}

function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) return { data: {}, content: src }
  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const k = line.slice(0, idx).trim()
    let v = line.slice(idx + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    data[k] = v
  }
  return { data, content: m[2] }
}

function scanSection(section) {
  const dir = path.join(__dirname, section)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      const src = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { data, content } = parseFrontmatter(src)
      const isIndex = slug === 'index'
      return {
        section,
        slug,
        isIndex,
        url: isIndex ? `/${section}/` : `/${section}/${slug}/`,
        title: data.title || slug,
        date: data.date || '',
        description: data.description || '',
        content,
      }
    })
}

function scanRoot() {
  const p = path.join(__dirname, 'index.md')
  if (!fs.existsSync(p)) return []
  const src = fs.readFileSync(p, 'utf-8')
  const { data, content } = parseFrontmatter(src)
  return [
    {
      section: '',
      slug: 'index',
      isIndex: true,
      url: '/',
      title: data.title || 'Numstore',
      date: data.date || '',
      description: data.description || '',
      content,
    },
  ]
}

function scanAll() {
  return [...scanRoot(), ...scanSection('docs'), ...scanSection('blog')]
}

function renderNav(pages, currentUrl) {
  const docs = pages.filter((p) => p.section === 'docs' && !p.isIndex)
  const blog = pages.filter((p) => p.section === 'blog' && !p.isIndex)
  const link = (href, label) =>
    `<a href="${href}" class="nav-link${currentUrl === href ? ' is-active' : ''}">${label}</a>`

  let html = ''
  html += `<div class="nav-group"><div class="nav-title">Site</div>`
  html += link('/', 'Home')
  html += `</div>`

  if (docs.length) {
    html += `<div class="nav-group"><div class="nav-title">Docs</div>`
    html += link('/docs/', 'Overview')
    for (const p of docs) html += link(p.url, p.title)
    html += `</div>`
  }

  if (blog.length) {
    const sorted = [...blog].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    html += `<div class="nav-group"><div class="nav-title">Blog</div>`
    html += link('/blog/', 'Latest')
    for (const p of sorted) html += link(p.url, p.title)
    html += `</div>`
  }

  return html
}

function expandIndexLists(content, pages) {
  // Replace tokens with auto-generated lists.
  // {{posts}} → all blog posts (newest first)
  // {{docs}}  → all docs pages
  const blog = pages
    .filter((p) => p.section === 'blog' && !p.isIndex)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  const docs = pages.filter((p) => p.section === 'docs' && !p.isIndex)

  const renderList = (items) =>
    items
      .map(
        (p) =>
          `- [**${p.title}**](${p.url})${p.date ? `  \n  *${p.date}*` : ''}${
            p.description ? `  \n  ${p.description}` : ''
          }`,
      )
      .join('\n\n')

  return content.replace('{{posts}}', renderList(blog)).replace('{{docs}}', renderList(docs))
}

function renderTemplate(template, { title, body, nav, cssHref, viteHead }) {
  return template
    .replaceAll('{{title}}', title)
    .replaceAll('{{body}}', body)
    .replaceAll('{{nav}}', nav)
    .replaceAll('{{cssHref}}', cssHref || '')
    .replaceAll('{{viteHead}}', viteHead || '')
}

function loadTemplate() {
  return fs.readFileSync(path.join(__dirname, 'src', 'template.html'), 'utf-8')
}

function pageBody(page, pages) {
  const expanded = expandIndexLists(page.content, pages)
  let body = md.render(expanded)
  // Build-time header for content pages (not the very root).
  if (page.section) {
    const meta = page.date ? `<div class="page-meta">${page.date}</div>` : ''
    body = `<header class="page-header"><div class="page-eyebrow">${page.section}</div>${meta}</header>${body}`
  }
  return body
}

function outputPathFor(page) {
  if (page.section === '') return path.join('dist', 'index.html')
  if (page.isIndex) return path.join('dist', page.section, 'index.html')
  return path.join('dist', page.section, page.slug, 'index.html')
}

export function mdSitePlugin() {
  return {
    name: 'md-site',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '/'
        const pathname = decodeURIComponent(url.split('?')[0].split('#')[0])

        // Serve /assets/* from ./assets/
        if (pathname.startsWith('/assets/')) {
          const rel = pathname.replace(/^\/+/, '')
          const filePath = path.join(__dirname, rel)
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).slice(1).toLowerCase()
            if (MIME[ext]) res.setHeader('Content-Type', MIME[ext])
            res.end(fs.readFileSync(filePath))
            return
          }
          res.statusCode = 404
          res.end('not found')
          return
        }

        // Only intercept routes that map to markdown pages.
        const pages = scanAll()
        const candidate = pathname.endsWith('/') ? pathname : pathname + '/'
        const match =
          pages.find((p) => p.url === pathname) ||
          pages.find((p) => p.url === candidate) ||
          (pathname === '' || pathname === '/' ? pages.find((p) => p.url === '/') : null)

        if (!match) return next()

        const body = pageBody(match, pages)
        const nav = renderNav(pages, match.url)
        const template = loadTemplate()
        const html = renderTemplate(template, {
          title: match.title === 'Numstore' ? 'Numstore' : `${match.title} — Numstore`,
          body,
          nav,
          cssHref: '/src/style.css',
          // The dev client gets injected by Vite's transformIndexHtml.
          viteHead: '',
        })

        // Hand to Vite so it injects @vite/client + HMR.
        server.transformIndexHtml(req.url, html).then((transformed) => {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(transformed)
        }, next)
      })
    },

    async closeBundle() {
      const distDir = path.join(__dirname, 'dist')
      if (!fs.existsSync(distDir)) return

      // Pull the hashed CSS href out of the Vite-emitted index.html.
      let cssHref = ''
      const builtIndex = path.join(distDir, 'index.html')
      if (fs.existsSync(builtIndex)) {
        const built = fs.readFileSync(builtIndex, 'utf-8')
        const m = built.match(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/i)
        if (m) cssHref = m[1]
      }

      const template = loadTemplate()
      const pages = scanAll()

      for (const page of pages) {
        const body = pageBody(page, pages)
        const nav = renderNav(pages, page.url)
        const html = renderTemplate(template, {
          title: page.title === 'Numstore' ? 'Numstore' : `${page.title} — Numstore`,
          body,
          nav,
          cssHref,
          viteHead: '',
        })
        const outPath = path.join(__dirname, outputPathFor(page))
        fs.mkdirSync(path.dirname(outPath), { recursive: true })
        fs.writeFileSync(outPath, html)
      }

      // Copy assets/ → dist/assets/
      const srcAssets = path.join(__dirname, 'assets')
      const dstAssets = path.join(distDir, 'assets')
      if (fs.existsSync(srcAssets)) copyDir(srcAssets, dstAssets)
    },
  }
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dst, entry.name)
    if (entry.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}
