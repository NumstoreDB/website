<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { site } from '../config/site'
</script>

<template>
  <section class="py-24 md:py-32">
    <div class="container-page">
      <div class="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-elevated via-surface to-bg p-10 md:p-16">
        <div aria-hidden="true" class="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        <div aria-hidden="true" class="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-product-smartfiles/10 blur-3xl" />
        <div class="relative max-w-2xl">
          <h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Start building with Numstore.
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted md:text-lg">
            Install the binary, write your first column, and have a query running in five minutes.
            Bring questions to our team whenever you need a hand.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a :href="site.external.docs" target="_blank" rel="noopener" class="btn-primary">
              Read the Docs
            </a>
            <RouterLink to="/contact" class="btn-secondary">
              Talk to us
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
