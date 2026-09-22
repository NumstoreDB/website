<script setup lang="ts">
import { site_data } from '../data'
</script>

<template>
  <section class="border-y border-border py-16">
    <div class="container-page">
      <div class="border border-border p-10 md:p-16">
        <div class="max-w-2xl">
          <h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Start building with Numstore.
          </h2>
          <div class="mt-8 flex flex-wrap gap-3">
            <a :href="site_data.external.docs" target="_blank" rel="noopener" class="btn-primary">
              Read the Docs
            </a>
            <a :href="`mailto:${site_data.contact.email}`" class="btn-secondary"> Contact </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
