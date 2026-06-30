<script setup lang="ts">
import { site } from '../config/site'
</script>

<template>
  <section id="products" class="border-b border-border py-20 md:py-24">
    <div class="container-page">
      <h2 class="text-2xl font-bold tracking-tight text-fg md:text-3xl">Three libraries</h2>
      <p class="mt-2 text-sm text-muted">Each builds on the last. Start with SmartFiles; graduate to Numstore when you need types.</p>

      <div class="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
        <article
          v-for="product in site.products"
          :key="product.id"
          class="flex flex-col bg-bg p-8"
        >
          <div
            class="h-1 w-8 rounded-full"
            :class="{
              'bg-product-smartfiles': product.id === 'smartfiles',
              'bg-product-numstore':   product.id === 'numstore',
              'bg-product-enterprise': product.id === 'enterprise',
            }"
          />

          <h3 class="mt-6 text-lg font-semibold tracking-tight text-fg">{{ product.name }}</h3>
          <p class="mt-1 text-xs text-muted">{{ product.tagline }}</p>
          <p class="mt-4 text-sm leading-relaxed text-muted">{{ product.blurb }}</p>

          <ul class="mt-6 flex flex-1 flex-col gap-2 border-t border-border pt-6">
            <li v-for="f in product.features" :key="f" class="flex items-start gap-2 text-xs text-muted">
              <span class="mt-0.5 text-fg">—</span>
              {{ f }}
            </li>
          </ul>

          <a
            :href="product.href"
            :target="product.href.startsWith('#') ? undefined : '_blank'"
            :rel="product.href.startsWith('#') ? undefined : 'noopener'"
            class="mt-8 text-sm font-medium transition-colors hover:underline"
            :class="{
              'text-product-smartfiles': product.id === 'smartfiles',
              'text-product-numstore':   product.id === 'numstore',
              'text-product-enterprise': product.id === 'enterprise',
            }"
          >
            {{ product.id === 'enterprise' ? 'Contact us →' : 'Docs →' }}
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
