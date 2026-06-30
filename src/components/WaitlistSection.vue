<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

const form = reactive({
  name: '',
  email: '',
  project: '',
  usage: '',
  source: '',
})

const errors = reactive({ name: '', email: '' })
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref<string | null>(null)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const sourceOptions = [
  'GitHub',
  'YouTube',
  'Blog / article',
  'Friend or colleague',
  'Search engine',
  'Social media',
  'Other',
]

const isValid = computed(
  () => form.name.trim() && emailRe.test(form.email.trim()),
)

function validate() {
  errors.name  = form.name.trim() ? '' : 'Required'
  errors.email = emailRe.test(form.email.trim()) ? '' : 'Enter a valid email'
  return !errors.name && !errors.email
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = null
  try {
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    }).catch(() => undefined)
    submitted.value = true
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Something went wrong'
  } finally {
    submitting.value = false
  }
}

const inputClass = 'mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-muted/50 focus:border-accent-soft focus:outline-none focus:ring-1 focus:ring-accent-soft'
const labelClass = 'block text-xs font-medium text-muted'
</script>

<template>
  <section id="waitlist" class="border-b border-border py-20 md:py-24">
    <div class="container-page">
      <div class="max-w-xl">
        <h2 class="text-2xl font-bold tracking-tight text-fg md:text-3xl">Join the waitlist</h2>
        <p class="mt-2 text-sm text-muted">
          Numstore Enterprise is in development. Leave your info and we'll reach out when it's ready.
        </p>

        <div v-if="!submitted" class="mt-8">
          <form class="grid gap-5" novalidate @submit.prevent="onSubmit">
            <div>
              <label for="wl-name" :class="labelClass">Name <span class="text-secondary-soft">*</span></label>
              <input id="wl-name" v-model="form.name" type="text" autocomplete="name" required :class="inputClass" />
              <p v-if="errors.name" class="mt-1 text-xs text-secondary-soft">{{ errors.name }}</p>
            </div>

            <div>
              <label for="wl-email" :class="labelClass">Email <span class="text-secondary-soft">*</span></label>
              <input id="wl-email" v-model="form.email" type="email" autocomplete="email" required :class="inputClass" />
              <p v-if="errors.email" class="mt-1 text-xs text-secondary-soft">{{ errors.email }}</p>
            </div>

            <div>
              <label for="wl-project" :class="labelClass">Project description</label>
              <textarea id="wl-project" v-model="form.project" rows="3" :class="inputClass" placeholder="What are you building?" />
            </div>

            <div>
              <label for="wl-usage" :class="labelClass">How would you use Numstore Enterprise?</label>
              <textarea id="wl-usage" v-model="form.usage" rows="3" :class="inputClass" placeholder="Scale, workload type, current stack…" />
            </div>

            <div>
              <label for="wl-source" :class="labelClass">How did you find us?</label>
              <select id="wl-source" v-model="form.source" :class="inputClass">
                <option value="" disabled>Select…</option>
                <option v-for="opt in sourceOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <div>
              <button type="submit" class="btn-primary" :disabled="submitting || !isValid">
                <span v-if="submitting">Submitting…</span>
                <span v-else>Join waitlist</span>
              </button>
              <p v-if="submitError" class="mt-2 text-xs text-secondary-soft">{{ submitError }}</p>
            </div>
          </form>
        </div>

        <div v-else class="mt-8 rounded-lg border border-border bg-surface p-8 text-center">
          <p class="text-lg font-semibold text-fg">You're on the list.</p>
          <p class="mt-2 text-sm text-muted">We'll be in touch as Enterprise gets closer to release.</p>
        </div>
      </div>
    </div>
  </section>
</template>
