<script setup lang="ts">
import { site_data } from '../data'
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="container-page py-20 md:py-28 lg:py-32">
      <div class="max-w-3xl">
        <div class="eyebrow">v1.1.3</div>
        <h1
          class="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Numstore
        </h1>
        <p class="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Numstore is an ACID database engine built for arrays. With Numstore -
          <span class="text-fg font-medium">anything can be a database.</span>
        </p>

        <div class="mt-10 flex flex-wrap gap-3">
          <a :href="site_data.external.docs" target="_blank" rel="noopener" class="btn-primary">
            Read the Docs
            <svg
              viewBox="0 0 20 20"
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path d="M5 10h10M11 6l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <figure class="mt-16 md:mt-20">
        <img
          class="block w-full border border-border"
          src="/p6_bar_time_vs_file_size_log.png"
          alt="Benchmark: Numstore write time vs. file size on a log scale"
        />
        <figcaption class="mt-3 text-center text-xs text-muted">
          This plot shows how long it takes to punch a hole in the middle of a standard file and
          write data compared to the same operation done using Numstore (using the "Smartfiles" api
          in purple). Numstore's inner file modification algorithm is first class, running in
          logarithmic time with respect to the original file size. Read more about it
          <a href="https://theolincke.com/blog/13_inner_inserts" class="underline text-fg">here</a>.
        </figcaption>
      </figure>
    </div>
  </section>
</template>
