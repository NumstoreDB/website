<script setup lang="ts">
interface Pillar {
  title: string
  body: string
  metric: string
  metricLabel: string
}

const pillars: Pillar[] = [
  {
    title: 'Performance',
    body: '',
    metric: '8.4M',
    metricLabel: 'writes/sec on commodity NVMe',
  },
  {
    title: 'Consistency',
    body: 'Strict serializability for writes',
    metric: 'Strict-1SR',
    metricLabel: 'across replicas, by default',
  },
  {
    title: 'No dynamic memory allocation',
    body: '',
    metric: '11 nines',
    metricLabel: 'modeled annual durability',
  },
  {
    title: 'A Testing infrastructure',
    body: '',
    metric: '11 nines',
    metricLabel: 'modeled annual durability',
  },
]
</script>

<template>
  <section class="py-24 md:py-32">
    <div class="container-page">
      <div class="max-w-2xl">
        <div class="eyebrow">Why Numstore</div>
        <h2 class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          The four pillars numstore refuses to trade.
        </h2>
      </div>

      <div class="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
        <div
          v-for="(p, i) in pillars"
          :key="p.title"
          class="relative bg-surface p-8 md:p-10"
        >
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="font-display text-xl font-semibold tracking-tight md:text-2xl">
              {{ p.title }}
            </h3>
            <span class="font-mono text-xs text-muted">0{{ i + 1 }}</span>
          </div>
          <p class="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            {{ p.body }}
          </p>
          <div class="mt-8 flex items-end gap-3 border-t border-border pt-6">
            <div class="font-display text-3xl font-bold text-accent-soft tabular-nums md:text-4xl">
              {{ p.metric }}
            </div>
            <div class="pb-1 text-xs text-muted">
              {{ p.metricLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
