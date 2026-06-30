<script setup lang="ts">
import { site } from '../config/site'

const paths = [
  {
    title: 'Start with SmartFiles',
    body: 'A single-header C library. Fork it, strip what you don\'t need, add what you do. The ACID machinery and O(log n) inner-mutation algorithm are the parts worth keeping.',
    link: site.external.docs,
    linkLabel: 'SmartFiles docs →',
  },
  {
    title: 'Read the internals writeup',
    body: 'The blog series covers the on-disk format, the B-tree variant used for inner mutations, and the WAL implementation. Start there before touching the code.',
    link: site.external.blog,
    linkLabel: 'Blog →',
  },
  {
    title: 'Ask questions on Discord',
    body: 'We\'re active in the server. Bring a specific question about the engine design and you\'ll get a direct answer — not a link to a wiki page.',
    link: site.external.discord,
    linkLabel: 'Join Discord →',
  },
]
</script>

<template>
  <section id="build-your-own" class="border-b border-border py-20 md:py-24">
    <div class="container-page">
      <div class="max-w-2xl">
        <h2 class="text-2xl font-bold tracking-tight text-fg md:text-3xl">Build your own</h2>
        <p class="mt-4 text-sm leading-relaxed text-muted">
          Numstore and SmartFiles are MIT licensed. Fork them, gut them, rebuild on top of them.
          The core ideas — ACID guarantees without a server process, O(log n) inner mutations —
          are the transferable parts. Everything else is up for change.
        </p>
      </div>

      <div class="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
        <div v-for="path in paths" :key="path.title" class="flex flex-col bg-bg p-7">
          <h3 class="text-sm font-semibold text-fg">{{ path.title }}</h3>
          <p class="mt-3 flex-1 text-xs leading-relaxed text-muted">{{ path.body }}</p>
          <a
            :href="path.link"
            target="_blank"
            rel="noopener"
            class="mt-6 text-xs font-medium text-accent-soft hover:underline"
          >{{ path.linkLabel }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
