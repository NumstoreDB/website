<script setup lang="ts">
import { site } from '../config/site'

const year = new Date().getFullYear()
const githubUrl = `https://github.com/${site.github.owner}/${site.github.repo}`
</script>

<template>
  <footer class="border-t border-border bg-surface">
    <div class="container-page flex flex-col items-start justify-between gap-4 py-8 text-sm text-muted md:flex-row md:items-center">
      <div class="flex items-center gap-2 font-display font-bold text-fg">
        <img src="/logo.png" class="h-5 w-5" aria-hidden="true" alt="logo" />
        {{ site.name }}
      </div>

      <nav class="flex flex-wrap gap-4 text-sm">
        <a :href="site.external.docs" target="_blank" rel="noopener" class="hover:text-fg">Docs</a>
        <a :href="site.external.blog" target="_blank" rel="noopener" class="hover:text-fg">Blog</a>
        <a :href="githubUrl" target="_blank" rel="noopener" class="hover:text-fg">GitHub</a>
        <a :href="`mailto:${site.contact.email}`" class="hover:text-fg">{{ site.contact.email }}</a>
      </nav>

      <p class="text-xs">© {{ year }} Numstore LLC</p>
    </div>
  </footer>
</template>
