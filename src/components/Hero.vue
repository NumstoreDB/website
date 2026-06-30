<script setup lang="ts">
import { site } from '../config/site'
</script>

<template>
  <section class="border-b border-border py-24 md:py-32">
    <div class="container-page">
      <div class="max-w-2xl">
        <p class="font-mono text-xs text-muted">v1.1.3</p>
        <h1 class="mt-4 text-5xl font-bold tracking-tight text-fg md:text-6xl lg:text-7xl">
          Numstore
        </h1>
        <p class="mt-6 text-lg leading-relaxed text-muted">
          A database engine purpose-built for bytes and arrays.
          Numstore files are <span class="font-semibold text-accent-soft">fully ACID</span> —
          reads, writes, inserts, and removes either complete or don't happen at all.
          Inner mutations run in <span class="font-semibold text-secondary-soft">O(log n)</span>
          instead of O(n).
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a :href="site.external.docs" target="_blank" rel="noopener" class="btn-primary">
            Documentation
          </a>
          <a href="#quickstart" class="btn-secondary">
            Quickstart
          </a>
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
