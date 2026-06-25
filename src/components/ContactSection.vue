<script setup lang="ts">
import ContactForm from './ContactForm.vue'
import { site } from '../config/site'
</script>

<template>
  <section id="contact" class="border-t border-border py-16 md:py-24">
    <div class="container-page">
      <div class="grid gap-10 md:grid-cols-12 md:gap-12">
        <div class="md:col-span-7">
          <ContactForm />
        </div>

        <aside class="md:col-span-5">
          <div class="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
            <h2 class="font-display text-xl font-semibold tracking-tight">What happens next?</h2>
            <ol class="mt-6 space-y-6">
              <li class="flex gap-4">
                <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-sm font-semibold text-accent-soft">1</span>
                <div>
                  <h3 class="font-display text-base font-semibold">Manual review</h3>
                  <p class="mt-1 text-sm leading-relaxed text-muted">A real engineer reads your message — no autoresponders.</p>
                </div>
              </li>
              <li class="flex gap-4">
                <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-sm font-semibold text-accent-soft">2</span>
                <div>
                  <h3 class="font-display text-base font-semibold">Routed to the right person</h3>
                  <p class="mt-1 text-sm leading-relaxed text-muted">Whoever owns the relevant surface area gets looped in.</p>
                </div>
              </li>
              <li class="flex gap-4">
                <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-sm font-semibold text-accent-soft">3</span>
                <div>
                  <h3 class="font-display text-base font-semibold">Response within 1–2 business days</h3>
                  <p class="mt-1 text-sm leading-relaxed text-muted">Concrete follow-up, not a discovery-call template.</p>
                </div>
              </li>
            </ol>

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
    </div>
  </section>
</template>
