<script setup lang="ts">
const options = [
  {
    id: 'libraries',
    label: 'Use the libraries',
    desc: 'Open-source SmartFiles & Numstore - drop them into your project.',
    href: '#quickstart',
  },
  {
    id: 'custom',
    label: 'Custom database',
    desc: 'I design and build custom storage engines for your workload.',
    href: '#custom',
  },
  {
    id: 'enterprise',
    label: 'Numstore Enterprise',
    desc: 'Distributed, multi-node variant written entirely in Rust. Currently in development.',
    href: '#contact',
  },
]

function navigate(href: string) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="border-b border-border py-24 md:py-32">
    <div class="container-page">
      <div class="max-w-2xl">
        <a href="https://github.com/NumstoreDB/Numstore/releases/tag/v1.1.3"><p class="font-mono text-xs text-muted">Numstore · v1.1.3</p></a>
        <h1 class="mt-4 text-5xl font-bold tracking-tight text-fg md:text-6xl lg:text-7xl">
          <a href="https://github.com/NumstoreDB/Numstore"><span class="font-semibold text-accent-soft hover:text-secondary-soft">Numstore</span></a>,
        </h1>
        <p class="mt-6 text-lg leading-relaxed text-muted">
          A <span class="font-semibold text-accent-soft">Fully ACID</span>, single file
          database for <span class="font-semibold text-accent-soft">numerical arrays</span>.
          Or use Numstore as a faster <span class="font-semibold text-secondary-soft">Smart File</span>,
          offering speed ups on the <span class="font-semibold text-secondary-soft">order of thousands</span>
          over the traditional file.
        </p>
      </div>

      <!-- Interest selector -->
      <div class="mt-12">
        <p class="text-xs font-medium uppercase tracking-widest text-muted">What are you interested in?</p>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            v-for="opt in options"
            :key="opt.id"
            type="button"
            class="group flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-5 text-left transition-colors hover:border-accent-soft hover:bg-elevated"
            @click="navigate(opt.href)"
          >
            <span class="text-sm font-semibold text-fg group-hover:text-accent-soft transition-colors">
              {{ opt.label }}
            </span>
            <span class="text-xs leading-relaxed text-muted">{{ opt.desc }}</span>
          </button>
        </div>
      </div>

      <figure class="mt-16 md:mt-20">
        <img
          class="block w-full rounded-lg border border-border"
          src="/p6_bar_time_vs_file_size_log.png"
          alt="Benchmark: Numstore write time vs. file size on a log scale"
        />
        <figcaption class="mt-3 text-center text-xs text-muted">
          Time to insert into the middle of a file vs. file size (log scale).
          Standard I/O is O(n); Numstore's inner-insert algorithm is O(log n).
          <a href="https://theolincke.com/blog/13_inner_inserts" class="underline hover:text-fg">Details.</a>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
