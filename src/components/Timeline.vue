<script setup lang="ts">
interface Entry {
  date: string
  title: string
  body: string
}

const entries: Entry[] = [
  {
    date: 'March 2022',
    title: 'Founded',
    body:
      'Numstore began as an internal tool at a quantitative research lab — a numerical file format faster than every off-the-shelf option. Two engineers spun it out as an independent company.',
  },
  {
    date: 'October 2022',
    title: 'Seed round',
    body:
      'Raised a $4.2M seed led by Inflection Capital with participation from a group of operators from the storage and database industry. First three hires joined the same month.',
  },
  {
    date: 'July 2023',
    title: 'First production release',
    body:
      'Cut Numstore 1.0. A telemetry team running ~3PB on Numstore in production confirmed our design assumptions — and gave us our first publicly citable benchmark.',
  },
  {
    date: 'May 2024',
    title: 'Series A',
    body:
      'Closed a $22M Series A led by Northbridge Ventures. Opened our second office, expanded engineering across two timezones, and started building Numstore Enterprise.',
  },
  {
    date: 'November 2024',
    title: 'Partnership with Helion Labs',
    body:
      'Helion Labs standardized on Numstore for their fusion-simulation data lake — 12PB of dense numerical arrays under continuous query.',
  },
  {
    date: 'March 2026',
    title: 'Numstore Enterprise GA',
    body:
      'Numstore Enterprise reached general availability with SOC 2 Type II, multi-region replication, and 24/7 support. SmartFiles became its own standalone open-source release.',
  },
]
</script>

<template>
  <section class="py-20 md:py-28">
    <div class="container-page">
      <div class="max-w-2xl">
        <div class="eyebrow">Milestones</div>
        <h2 class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The road so far.
        </h2>
        <p class="mt-4 text-base leading-relaxed text-muted">
          A short, honest timeline. We left out the noisy moments and kept the ones that changed how we work.
        </p>
      </div>

      <ol class="mt-14 relative border-l border-border pl-8 md:pl-12">
        <li v-for="(entry, i) in entries" :key="entry.title" class="relative pb-12 last:pb-0">
          <span
            class="absolute -left-[37px] md:-left-[49px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-bg font-mono text-[10px] text-accent"
          >
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <div class="text-xs font-medium uppercase tracking-widest text-accent">
            {{ entry.date }}
          </div>
          <h3 class="mt-2 font-display text-xl font-semibold tracking-tight md:text-2xl">
            {{ entry.title }}
          </h3>
          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {{ entry.body }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>
