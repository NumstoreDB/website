<script setup lang="ts">
import { site } from '../config/site'

const accentClasses: Record<string, { ring: string; text: string; bg: string; border: string }> = {
  smartfiles: {
    ring: 'group-hover:ring-product-smartfiles/40',
    text: 'text-product-smartfiles',
    bg: 'bg-product-smartfiles/10',
    border: 'border-product-smartfiles/30',
  },
  numstore: {
    ring: 'group-hover:ring-product-numstore/40',
    text: 'text-product-numstore',
    bg: 'bg-product-numstore/10',
    border: 'border-product-numstore/30',
  },
  enterprise: {
    ring: 'group-hover:ring-product-enterprise/40',
    text: 'text-product-enterprise',
    bg: 'bg-product-enterprise/10',
    border: 'border-product-enterprise/30',
  },
}
</script>

<template>
  <section id="products" class="border-y border-border bg-surface/40 py-24 md:py-32">
    <div class="container-page">
      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="(product, i) in site.products"
          :key="product.id"
          class="group relative flex flex-col rounded-xl border bg-surface p-8 ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
          :class="[accentClasses[product.accent].border, accentClasses[product.accent].ring]"
        >
          <div
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg"
            :class="accentClasses[product.accent].bg"
          >
            <svg v-if="i === 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" :class="accentClasses[product.accent].text" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8M8 17h5" />
            </svg>
            <svg v-else-if="i === 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" :class="accentClasses[product.accent].text" aria-hidden="true">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5" />
              <path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" :class="accentClasses[product.accent].text" aria-hidden="true">
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 9h2M9 13h2M9 17h2M14 9h2M14 13h2M14 17h2" />
            </svg>
          </div>

          <h3 class="mt-6 font-display text-2xl font-semibold tracking-tight">
            {{ product.name }}
          </h3>
          <p class="mt-4 text-sm leading-relaxed text-muted">
            {{ product.blurb }}
          </p>

          <ul class="mt-6 flex flex-1 flex-col gap-3 border-t border-border pt-6 text-sm">
            <li v-for="f in product.features" :key="f" class="flex items-start gap-2 text-fg">
              <svg viewBox="0 0 20 20" class="mt-0.5 h-4 w-4 shrink-0" :class="accentClasses[product.accent].text" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M5 10l3 3 7-7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>{{ f }}</span>
            </li>
          </ul>

          <a
            :href="product.href"
            target="_blank"
            rel="noopener"
            class="mt-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            :class="accentClasses[product.accent].text"
          >
            Docs →
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
