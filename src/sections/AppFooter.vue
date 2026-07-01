<script setup lang="ts">
import { site } from '../config/site'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border py-8">
    <div class="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2 text-sm font-semibold text-fg">
        <img src="/logo.png" class="h-5 w-5" aria-hidden="true" alt="" />
        Numstore
      </div>
      <nav class="flex flex-wrap gap-4 text-xs text-muted">
        <a :href="site.external.docs"    target="_blank" rel="noopener" class="hover:text-fg">Docs</a>
        <a :href="site.external.github"  target="_blank" rel="noopener" class="hover:text-fg">GitHub</a>
        <a :href="site.external.youtube" target="_blank" rel="noopener" class="hover:text-fg">YouTube</a>
        <a :href="site.external.x"       target="_blank" rel="noopener" class="hover:text-fg">X</a>
        <a :href="site.external.linkedin" target="_blank" rel="noopener" class="hover:text-fg">LinkedIn</a>
        <a :href="`mailto:${site.contact.email}`" class="hover:text-fg">{{ site.contact.email }}</a>
      </nav>
      <p class="text-xs text-muted">© {{ year }} Numstore LLC</p>
    </div>
  </footer>
</template>
