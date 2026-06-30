<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { site } from '../config/site'

const scrolled = ref(false)
const mobileOpen = ref(false)
const isDark = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('ns-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('ns-theme', 'light')
  }
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const navLinks = [
  { label: 'Quickstart', href: '#quickstart' },
  { label: 'Products',   href: '#products'   },
  { label: 'Waitlist',   href: '#waitlist'   },
]

const socialLinks = [
  { label: 'GitHub',    href: site.external.github },
  { label: 'YouTube',   href: site.external.youtube },
  { label: 'X',         href: site.external.x },
  { label: 'LinkedIn',  href: site.external.linkedin },
  { label: 'Discord',   href: site.external.discord },
  { label: 'Email',     href: `mailto:${site.contact.email}` },
]
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-bg transition-colors duration-200"
    :class="scrolled ? 'border-border' : 'border-transparent'"
  >
    <div class="container-page flex h-14 items-center gap-4">
      <!-- Logo -->
      <a href="#" class="flex shrink-0 items-center gap-2 font-display text-base font-bold tracking-tight text-fg">
        <img src="/logo.png" class="h-6 w-6" aria-hidden="true" alt="Numstore" />
        Numstore
      </a>

      <div class="flex-1" />

      <!-- Desktop nav -->
      <nav class="hidden items-center md:flex" aria-label="Primary">
        <!-- Scroll links -->
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
        >{{ link.label }}</a>

        <!-- Separator -->
        <span class="mx-2 select-none text-border">|</span>

        <!-- External links -->
        <a
          :href="site.external.docs"
          target="_blank" rel="noopener"
          class="px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
        >Docs</a>
        <a
          :href="site.external.blog"
          target="_blank" rel="noopener"
          class="px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
        >Blog</a>

        <!-- Separator -->
        <span class="mx-2 select-none text-border">|</span>

        <!-- Social icons -->
        <a :href="site.external.github" target="_blank" rel="noopener" aria-label="GitHub" class="p-2 text-muted transition-colors hover:text-fg">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.41c.57.1.78-.25.78-.55v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.97.1-.76.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39s1.98.13 2.9.39c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.26 5.69.41.35.78 1.03.78 2.08v3.08c0 .3.21.66.79.55A11.5 11.5 0 0 0 12 .5z"/>
          </svg>
        </a>
        <a :href="site.external.youtube" target="_blank" rel="noopener" aria-label="YouTube" class="p-2 text-muted transition-colors hover:text-fg">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7l6.3 3.5-6.3 3.5z"/>
          </svg>
        </a>
        <a :href="site.external.x" target="_blank" rel="noopener" aria-label="X" class="p-2 text-muted transition-colors hover:text-fg">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a :href="site.external.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn" class="p-2 text-muted transition-colors hover:text-fg">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
          </svg>
        </a>
        <a :href="site.external.discord" target="_blank" rel="noopener" aria-label="Discord" class="p-2 text-muted transition-colors hover:text-fg">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </a>
        <a :href="`mailto:${site.contact.email}`" aria-label="Email" class="p-2 text-muted transition-colors hover:text-fg">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </a>

        <!-- Theme toggle -->
        <button
          type="button"
          class="ml-1 p-2 text-muted transition-colors hover:text-fg"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <!-- Sun -->
          <svg v-if="isDark" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <!-- Moon -->
          <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </nav>

      <!-- Mobile: theme toggle + hamburger -->
      <div class="flex items-center gap-1 md:hidden">
        <button type="button" class="p-2 text-muted hover:text-fg" :aria-label="isDark ? 'Light mode' : 'Dark mode'" @click="toggleTheme">
          <svg v-if="isDark" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <button
          type="button"
          class="p-2 text-fg"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M6 18L18 6"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="-translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <div v-if="mobileOpen" id="mobile-menu" class="border-t border-border bg-bg md:hidden">
        <div class="container-page flex flex-col py-3">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" class="px-2 py-3 text-sm font-medium text-fg hover:text-accent-soft" @click="mobileOpen = false">{{ link.label }}</a>
          <div class="my-2 h-px bg-border" />
          <a :href="site.external.docs" target="_blank" rel="noopener" class="px-2 py-3 text-sm text-muted hover:text-fg" @click="mobileOpen = false">Docs</a>
          <a :href="site.external.blog" target="_blank" rel="noopener" class="px-2 py-3 text-sm text-muted hover:text-fg" @click="mobileOpen = false">Blog</a>
          <div class="my-2 h-px bg-border" />
          <div class="flex flex-wrap gap-4 px-2 py-3">
            <a v-for="s in socialLinks" :key="s.label" :href="s.href" target="_blank" rel="noopener" class="text-sm text-muted hover:text-fg">{{ s.label }}</a>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>
