<script setup lang="ts">
import ContactForm from '../components/ContactForm.vue'
import { site } from '../config/site'

const steps = [
  {
    title: 'We review your request manually',
    body:
      'No autoresponders. A real engineer reads what you sent and figures out who on the team can actually help.',
  },
  {
    title: 'We route it to the right person',
    body:
      'Operations, engineering, or solutions — whoever owns the surface area of your question gets paged in.',
  },
  {
    title: 'We follow up quickly',
    body:
      'You will hear back with concrete next steps, not a generic discovery-call template.',
  },
]
</script>

<template>
  <div class="border-b border-border">
    <section class="container-page py-16 md:py-24">
      <div class="mx-auto max-w-3xl text-center md:text-left">
        <div class="inline-flex"><div class="eyebrow">Contact</div></div>
        <h1 class="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Let's talk about your workload.
        </h1>
        <p class="mt-4 text-base leading-relaxed text-muted md:text-lg">
          Tell us what you are trying to store, query, or scale. We will get back to you with concrete advice.
        </p>
      </div>

      <div class="mt-14 grid gap-10 md:grid-cols-12 md:gap-12">
        <div class="md:col-span-7">
          <ContactForm />
        </div>

        <aside class="md:col-span-5">
          <div class="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
            <h2 class="font-display text-2xl font-semibold tracking-tight">What happens next?</h2>
            <ol class="mt-6 space-y-6">
              <li v-for="(s, i) in steps" :key="s.title" class="flex gap-4">
                <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-sm font-semibold text-accent-soft">
                  {{ i + 1 }}
                </span>
                <div>
                  <h3 class="font-display text-base font-semibold">{{ s.title }}</h3>
                  <p class="mt-1 text-sm leading-relaxed text-muted">{{ s.body }}</p>
                </div>
              </li>
            </ol>

            <div class="mt-8 rounded-lg border border-border bg-bg p-4">
              <p class="text-xs uppercase tracking-widest text-muted">Average response time</p>
              <p class="mt-1 font-display text-xl font-semibold text-fg">1–2 business days</p>
            </div>

            <div class="my-8 h-px w-full bg-border" />

            <div>
              <p class="text-sm text-muted">Prefer email?</p>
              <a
                :href="`mailto:${site.contact.email}`"
                class="mt-1 inline-flex items-center gap-2 font-mono text-sm font-medium text-accent-soft hover:text-white"
              >
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {{ site.contact.email }}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
