<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

const form = reactive({
  name: '',
  email: '',
  interest: '',
  project: '',
  source: '',
})

const errors = reactive({ name: '', email: '', interest: '' })
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref<string | null>(null)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const interestOptions = [
  { value: 'libraries',   label: 'Using the open-source libraries (SmartFiles / Numstore)' },
  { value: 'custom',      label: 'Custom database development' },
  { value: 'diy',         label: 'Building my own database on top of Numstore' },
  { value: 'enterprise',  label: 'Numstore Enterprise (waitlist)' },
  { value: 'other',       label: 'Something else' },
]

const sourceOptions = [
  'GitHub', 'YouTube', 'Blog / article', 'Friend or colleague',
  'Search engine', 'Social media', 'Other',
]

const isValid = computed(
  () => form.name.trim() && emailRe.test(form.email.trim()) && form.interest,
)

function validate() {
  errors.name     = form.name.trim()                   ? '' : 'Required'
  errors.email    = emailRe.test(form.email.trim())    ? '' : 'Enter a valid email'
  errors.interest = form.interest                      ? '' : 'Required'
  return !errors.name && !errors.email && !errors.interest
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = null
  try {
    await fetch('/api/contact', {
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
  <section id="contact" class="border-b border-border py-20 md:py-24">
    <div class="container-page">
      <div class="grid gap-12 md:grid-cols-2 md:gap-16">

        <div>
          <h2 class="text-2xl font-bold tracking-tight text-fg md:text-3xl">Get in touch</h2>
          <p class="mt-4 text-sm leading-relaxed text-muted">
            Whether you want to use the libraries, commission a custom engine, or get on the
            Enterprise waitlist — start here. A real engineer reads every submission.
          </p>
          <p class="mt-4 text-sm leading-relaxed text-muted">
            Response time: 1–2 business days.
          </p>
          <p class="mt-6 text-xs text-muted">
            Prefer email?
            <a href="mailto:hello@numstore.com" class="text-accent-soft hover:underline">hello@numstore.com</a>
          </p>
        </div>

        <div v-if="!submitted">
          <form class="grid gap-5" novalidate @submit.prevent="onSubmit">

            <!-- Interest — first and prominent -->
            <div>
              <label for="c-interest" :class="labelClass">
                What are you interested in? <span class="text-secondary-soft">*</span>
              </label>
              <select id="c-interest" v-model="form.interest" required :class="inputClass">
                <option value="" disabled>Select…</option>
                <option v-for="opt in interestOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <p v-if="errors.interest" class="mt-1 text-xs text-secondary-soft">{{ errors.interest }}</p>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="c-name" :class="labelClass">Name <span class="text-secondary-soft">*</span></label>
                <input id="c-name" v-model="form.name" type="text" autocomplete="name" required :class="inputClass" />
                <p v-if="errors.name" class="mt-1 text-xs text-secondary-soft">{{ errors.name }}</p>
              </div>
              <div>
                <label for="c-email" :class="labelClass">Email <span class="text-secondary-soft">*</span></label>
                <input id="c-email" v-model="form.email" type="email" autocomplete="email" required :class="inputClass" />
                <p v-if="errors.email" class="mt-1 text-xs text-secondary-soft">{{ errors.email }}</p>
              </div>
            </div>

            <div>
              <label for="c-project" :class="labelClass">Tell us about your project</label>
              <textarea id="c-project" v-model="form.project" rows="4" :class="inputClass" placeholder="Data shapes, scale, current stack, what's not working today…" />
            </div>

            <div>
              <label for="c-source" :class="labelClass">How did you find us?</label>
              <select id="c-source" v-model="form.source" :class="inputClass">
                <option value="" disabled>Select…</option>
                <option v-for="opt in sourceOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <div>
              <button type="submit" class="btn-primary" :disabled="submitting || !isValid">
                <span v-if="submitting">Sending…</span>
                <span v-else>Send</span>
              </button>
              <p v-if="submitError" class="mt-2 text-xs text-secondary-soft">{{ submitError }}</p>
            </div>
          </form>
        </div>

        <div v-else class="flex flex-col justify-center">
          <p class="text-lg font-semibold text-fg">Got it — thanks.</p>
          <p class="mt-2 text-sm text-muted">We'll reply within 1–2 business days.</p>
        </div>

      </div>
    </div>
  </section>
</template>
