<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { site } from '../config/site'

const year = new Date().getFullYear()
const githubUrl = `https://github.com/${site.github.owner}/${site.github.repo}`
const youtubeUrl = `https://www.youtube.com/${site.youtube.handle}`
</script>

<template>
  <footer class="border-t border-border bg-surface">
    <div class="container-page grid gap-12 py-16 md:grid-cols-12">
      <div class="md:col-span-5">
        <div class="flex items-center gap-2 font-display text-lg font-bold">
          <svg viewBox="0 0 32 32" class="h-7 w-7" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#1c3a7a" />
            <path d="M9 22V10l14 12V10" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ site.name }}
        </div>
        <p class="mt-4 max-w-md text-sm leading-relaxed text-muted">
          {{ site.description }}
        </p>
      </div>

      <div class="md:col-span-4">
        <h4 class="text-xs font-semibold uppercase tracking-widest text-muted">Site</h4>
        <ul class="mt-4 space-y-3 text-sm">
          <li>
            <RouterLink to="/" class="text-fg hover:text-accent-soft">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/about" class="text-fg hover:text-accent-soft">About</RouterLink>
          </li>
          <li>
            <RouterLink to="/contact" class="text-fg hover:text-accent-soft">Contact</RouterLink>
          </li>
          <li>
            <a :href="site.external.docs" target="_blank" rel="noopener" class="text-fg hover:text-accent-soft">
              Documentation ↗
            </a>
          </li>
          <li>
            <a :href="site.external.blog" target="_blank" rel="noopener" class="text-fg hover:text-accent-soft">
              Blog ↗
            </a>
          </li>
        </ul>
      </div>

      <div class="md:col-span-3">
        <h4 class="text-xs font-semibold uppercase tracking-widest text-muted">Connect</h4>
        <ul class="mt-4 space-y-3 text-sm">
          <li>
            <a :href="githubUrl" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-fg hover:text-accent-soft">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.41c.57.1.78-.25.78-.55v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.97.1-.76.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39s1.98.13 2.9.39c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.26 5.69.41.35.78 1.03.78 2.08v3.08c0 .3.21.66.79.55A11.5 11.5 0 0 0 12 .5z"/>
              </svg>
              GitHub
            </a>
          </li>
          <li>
            <a :href="site.linkedin" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-fg hover:text-accent-soft">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
              </svg>
              LinkedIn
            </a>
          </li>
          <li>
            <a :href="youtubeUrl" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-fg hover:text-accent-soft">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7l6.3 3.5-6.3 3.5z"/>
              </svg>
              YouTube
            </a>
          </li>
          <li>
            <RouterLink to="/contact" class="inline-flex items-center gap-2 text-fg hover:text-accent-soft">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              Email
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-border">
      <div class="container-page flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted md:flex-row md:items-center">
        <p>Copyright © {{ year }} Numstore LLC. All Rights Reserved.</p>
        <p class="font-mono text-[11px]">v0.1.0 · built with Vue + Vite</p>
      </div>
    </div>
  </footer>
</template>
