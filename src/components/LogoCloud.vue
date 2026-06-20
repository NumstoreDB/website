<script setup lang="ts">
withDefaults(defineProps<{ heading?: string }>(), {
  heading: 'Trusted by teams shipping numerical workloads',
})

const logos = [
  { name: 'You', initials: '?' },
]
</script>

<template>
  <section class="border-y border-border bg-surface/30 py-16">
    <div class="container-page">
      <p class="text-center text-xs font-semibold uppercase tracking-widest text-muted">
        {{ heading }}
      </p>
      <ul class="mt-10 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
        <li
          v-for="logo in logos"
          :key="logo.name"
          class="flex items-center justify-center gap-3 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
        >
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-elevated font-mono text-xs font-semibold text-fg">
            {{ logo.initials }}
          </span>
          <span class="font-display text-sm font-medium tracking-tight text-muted">
            {{ logo.name }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
