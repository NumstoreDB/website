<script setup lang="ts">
import { site } from '../config/site'
</script>

<template>
  <section class="relative overflow-hidden">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10"
    >
      <div class="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>

    <div class="container-page grid items-center gap-16 py-20 md:grid-cols-12 md:py-28 lg:py-32">
      <div class="md:col-span-7">
        <div class="eyebrow">
          <span class="h-1.5 w-1.5 rounded-full bg-secondary" />
          v1.1.3
        </div>
        <h1 class="mt-6 font-display text-secondary text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl">Numstore<br />
        </h1>
        <p class="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Numstore is a database engine purpose built for arrays.
        </p>

        <div class="mt-10 flex flex-wrap gap-3">
          <a :href="site.external.docs" target="_blank" rel="noopener" class="btn-primary">
            Get Started
            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 10h10M11 6l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <a :href="site.external.docs" target="_blank" rel="noopener" class="btn-secondary">
            Read the Docs
          </a>
        </div>
      </div>

      <div class="md:col-span-5">

        <img
            class="relative w-full max-w-md mx-auto"
            src="/p6_bar_time_vs_file_size_log.png"
            aria-hidden="true" alt="Graph of Numstore results"/>
      </div>
    </div>
  </section>
</template>
