<template>
  <section id="custom" class="border-b border-border py-20 md:py-24">
    <div class="container-page">
      <div class="grid gap-12 md:grid-cols-2 md:gap-16">

        <!-- Left: pitch -->
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-fg md:text-3xl">Custom database development</h2>
          <p class="mt-4 text-sm leading-relaxed text-muted">
            Most teams default to Postgres or SQLite and spend months compensating for the mismatch.
            We build from the storage layer up, engineered around your data shape,
            access patterns, and consistency requirements.
          </p>
          <p class="mt-4 text-sm leading-relaxed text-muted">
            We build ACID file formats, typed column stores, and distributed engines.
            If your workload is numerical arrays, time-series, or scientific data —
            or anything that does not map cleanly to rows and columns — it is precisely where we specialize.
          </p>
          <a href="#contact" class="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-soft hover:underline">
            Talk to us about your workload →
          </a>
        </div>

        <!-- Right: what we deliver -->
        <div class="flex flex-col gap-6">
          <div
            v-for="item in deliverables"
            :key="item.title"
            class="border-l-2 border-border pl-5"
          >
            <h3 class="text-sm font-semibold text-fg">{{ item.title }}</h3>
            <p class="mt-1 text-xs leading-relaxed text-muted">{{ item.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const deliverables = [
  {
    title: 'Storage engine design',
    body: 'We specify the on-disk format, index structure, and ACID guarantees from scratch, matched to your read/write ratio and data shapes.',
  },
  {
    title: 'Language bindings',
    body: 'C, Python (NumPy/PyTorch compatible), and Rust bindings delivered as part of the engagement, engineered for drop-in integration with your existing stack.',
  },
  {
    title: 'Performance characterization',
    body: 'Benchmarks run against your actual workload, not synthetic ones. You review the numbers before committing.',
  },
  {
    title: 'Ongoing support',
    body: 'We can remain the team that owns and evolves the engine, or hand off clean, fully documented source with a transition period.',
  },
]
</script>
