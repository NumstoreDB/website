<script setup lang="ts">
import { site } from '../config/site'
</script>

<template>
  <section id="products" class="border-b border-border py-20 md:py-24">
    <div class="container-page">
      <h2 class="text-2xl font-bold tracking-tight text-fg md:text-3xl">Products</h2>
      <p class="mt-2 text-sm text-muted">Numstore is the core engine; Numstore Pro extends it with distributed, multi-node scale.</p>

      <div class="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
        <article
          v-for="product in site.products"
          :key="product.id"
          class="flex flex-col bg-bg p-8"
        >
          <div
            class="h-1 w-8 rounded-full"
            :class="{
              'bg-product-numstore': product.id === 'numstore',
              'bg-product-numstore-pro': product.id === 'numstore-pro',
            }"
          />

          <h3 class="mt-6 text-lg font-semibold tracking-tight text-fg">{{ product.name }}</h3>
          <p class="mt-1 text-xs text-muted">{{ product.tagline }}</p>
          <p class="mt-4 text-sm leading-relaxed text-muted">{{ product.blurb }}</p>

          <ul class="mt-6 flex flex-1 flex-col gap-2 border-t border-border pt-6">
            <li v-for="f in product.features" :key="f" class="flex items-start gap-2 text-xs text-muted">
              <span class="mt-0.5 text-fg">-</span>
              {{ f }}
            </li>
          </ul>

          <a
            :href="product.href"
            :target="product.href.startsWith('#') ? undefined : '_blank'"
            :rel="product.href.startsWith('#') ? undefined : 'noopener'"
            class="mt-8 text-sm font-medium transition-colors hover:underline"
            :class="{
              'text-product-numstore': product.id === 'numstore',
              'text-product-numstore-pro': product.id === 'numstore-pro',
            }"
          >
            {{ product.id === 'numstore-pro' ? 'Contact us →' : 'Docs →' }}
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
