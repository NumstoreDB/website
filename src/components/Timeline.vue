<script setup lang="ts">
interface Entry {
  date: string
  title: string
  body: string
}

const entries: Entry[] = [
  {
    date: 'February 2020',
    title: 'Problem and formulation',
    body:
        'Numstore began as a pain point to the fact that there are no databases for numerical data. Numpy arrays, signals, large complex datasets can\'t easily be stored in a database.',
  },
  {
    date: 'February 2025',
    title: 'First Ideas',
    body:
      'The idea of making a B+Tree into a rope was formulated and initial work was made to design a proof of concept app',
  },
  {
    date: 'December 2025',
    title: 'V0 Works',
    body: 'Numstore as a concept worked - with a notably overengineered / poorly implemented version of ARIES that was hard to reason about, but it worked',
  },
  {
    date: 'Febuary 2026',
    title: 'First open source release of Numstore',
    body: 'Released version 1.0 of numstore to the world on github',
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
            class="absolute -left-[37px] md:-left-[49px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-bg font-mono text-[10px] text-accent-soft"
          >
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <div class="text-xs font-medium uppercase tracking-widest text-accent-soft">
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
