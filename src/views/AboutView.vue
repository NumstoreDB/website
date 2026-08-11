<script setup lang="ts">
import Timeline from '../components/Timeline.vue'
import { site } from '../config/site'
</script>
<template>
  <div>
    <section class="relative overflow-hidden border-b border-border">
      <div aria-hidden="true" class="pointer-events-none absolute -top-32 right-0 h-[500px] w-[700px] rounded-full bg-accent/10 blur-3xl" />
      <div class="container-page relative py-20 md:py-28">
        <div class="max-w-3xl">
          <div class="eyebrow">About</div>
          <h1 class="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Numstore exists so that
            <span class="text-accent-soft">everything can be a database.</span>
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            The "file as a database" concept means any file format you want can have
            the same guarantees as a regular industry grade database. JSON, CSV, PNG,
            image data, made up binary formats, can all have the same benefits that
            come from industry grade databases:
          </p>
          <ul class="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted md:text-lg">
            <li>
              <span class="font-semibold text-foreground">Atomicity.</span>
              A write either completes in full or has no effect. If a process crashes
              partway through, the file is left in its pre-write state — never
              half-written or partially updated.
            </li>
            <li>
              <span class="font-semibold text-foreground">Consistency.</span>
              Every write moves the file from one valid state to another valid state.
              Format invariants and schema constraints hold before and after each
              operation; invalid intermediate states are not observable.
            </li>
            <li>
              <span class="font-semibold text-foreground">Isolation.</span>
              Concurrent readers and writers do not see each other's partial work. A
              reader observes either the pre-write or post-write state of the file,
              never an in-progress mixture.
            </li>
            <li>
              <span class="font-semibold text-foreground">Durability.</span>
              Once a write is acknowledged, it survives process termination, crashes,
              and power loss. Acknowledgement implies the data has reached persistent
              storage, not just an in-memory buffer.
            </li>
          </ul>
          <div class="mt-10 flex flex-wrap gap-3">
            <a :href="`mailto:${site.contact.email}`" class="btn-primary">
              Say hello
            </a>
            <a :href="site.external.docs" target="_blank" rel="noopener" class="btn-secondary">
              Read the docs
            </a>
          </div>
        </div>
      </div>
    </section>
    <Timeline />
  </div>
</template>
