<script setup lang="ts">
import Timeline from '../components/Timeline.vue'
import LogoCloud from '../components/LogoCloud.vue'
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
            We are building the storage layer
            <span class="text-accent-soft">numerical workloads deserve.</span>
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Most databases are built for rows of business records. Numstore is built for arrays of numbers —
            telemetry, simulation output, time series, the raw material of modern science and finance.
            Our mission is to give those workloads a foundation that is fast, honest about its guarantees,
            and operable by small teams.
          </p>

          <div class="mt-10 flex flex-wrap gap-3">
            <a :href="`mailto:${site.contact.email}`" class="btn-primary">
              Contact us
            </a>
            <a :href="site.external.docs" target="_blank" rel="noopener" class="btn-secondary">
              Read the docs
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-border py-20 md:py-28">
      <div class="container-page grid gap-12 md:grid-cols-12">
        <div class="md:col-span-5">
          <div class="eyebrow">Principles</div>
          <h2 class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How we work.
          </h2>
        </div>
        <ul class="md:col-span-7 grid gap-6 sm:grid-cols-2">
          <li class="rounded-xl border border-border bg-surface p-6">
            <h3 class="font-display text-lg font-semibold">Mechanical sympathy</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              We measure before we guess. Cache lines, page tables, and disk queues drive our designs — not fashion.
            </p>
          </li>
          <li class="rounded-xl border border-border bg-surface p-6">
            <h3 class="font-display text-lg font-semibold">Boring on purpose</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Storage failures are loud and expensive. We pick boring, well-understood algorithms whenever we can.
            </p>
          </li>
          <li class="rounded-xl border border-border bg-surface p-6">
            <h3 class="font-display text-lg font-semibold">Open by default</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              The engine and the file format are open source. Enterprise pays for operations, not for access.
            </p>
          </li>
          <li class="rounded-xl border border-border bg-surface p-6">
            <h3 class="font-display text-lg font-semibold">Small team, sharp edges</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              We stay small so every engineer can own a system end-to-end. Bureaucracy is the enemy of correctness.
            </p>
          </li>
        </ul>
      </div>
    </section>

    <Timeline />

    <LogoCloud heading="Trusted by Companies Worldwide" />
  </div>
</template>
