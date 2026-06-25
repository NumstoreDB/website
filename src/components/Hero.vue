<script setup lang="ts">
import { site } from '../config/site'
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="container-page py-20 md:py-28 lg:py-32">
      <div class="max-w-3xl">
        <h1 class="font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl">
          Numstore
        </h1>
        <p class="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          A database engine purpose-built for bytes and arrays.
          Numstore files are <span class="text-accent-soft font-semibold">fully ACID</span> —
          reads, writes, inserts, and removes either complete or don't happen at all.
        </p>

        <div class="mt-10 flex flex-wrap gap-3">
          <a :href="site.external.docs" target="_blank" rel="noopener" class="btn-secondary">
            Documentation →
          </a>
        </div>
      </div>

      <figure class="mt-16 md:mt-20">
        <img
          class="block w-full rounded-xl border border-border bg-surface"
          src="/p6_bar_time_vs_file_size_log.png"
          alt="Benchmark: Numstore write time vs. file size on a log scale"
        />
        <figcaption class="mt-3 text-center text-xs text-muted">
          Time to insert data into the middle of a file vs. file size (log scale).
          Standard file I/O scales linearly; Numstore's inner-insert algorithm runs in O(log n).
          <a href="https://theolincke.com/blog/13_inner_inserts" class="underline text-secondary">Details.</a>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
