<script setup lang="ts">
import { site } from '../config/site'
</script>

<template>
  <section class="relative overflow-hidden">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10"
    />

    <div class="container-page py-20 md:py-28 lg:py-32">
      <div class="max-w-3xl">
        <div class="eyebrow">
          <span class="h-1.5 w-1.5 rounded-full bg-secondary" />
          v1.1.3
        </div>
        <h1 class="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl">
          Numstore
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

      <figure class="mt-16 md:mt-20">
        <img
          class="block w-full rounded-xl border border-border bg-surface"
          src="/p6_bar_time_vs_file_size_log.png"
          alt="Benchmark: Numstore write time vs. file size on a log scale"
        />
        <figcaption class="mt-3 text-center text-xs text-muted">
          Write time vs. file size, log scale — Numstore vs. baselines.
        </figcaption>
      </figure>
    </div>
  </section>
</template>
