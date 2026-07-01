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
const touched = reactive({ name: false, email: false, interest: false })
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref<string | null>(null)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Live validity, recomputed on every keystroke (used for icons + hint text)
const nameValid = computed(() => form.name.trim().length > 0)
const emailValid = computed(() => emailRe.test(form.email.trim()))
const interestValid = computed(() => form.interest.length > 0)

function markTouched(field: keyof typeof touched) {
  touched[field] = true
}

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
  touched.name = true
  touched.email = true
  touched.interest = true
  errors.name     = nameValid.value     ? '' : 'Required'
  errors.email    = emailValid.value    ? '' : 'Enter a valid email'
  errors.interest = interestValid.value ? '' : 'Required'
  return !errors.name && !errors.email && !errors.interest
}

// Formspree endpoint for this form
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgojlbrl'

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = null
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Formspree returns a JSON response (instead of redirecting) when this is set
        'Accept': 'application/json',
      },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      submitted.value = true
      return
    }

    // Formspree error shape: { errors: [{ field, message, code }, ...] }
    const data = await res.json().catch(() => null)
    if (data?.errors?.length) {
      submitError.value = data.errors
          .map((err: { field?: string; message: string }) =>
              err.field ? `${err.field}: ${err.message}` : err.message,
          )
          .join(', ')
    } else {
      submitError.value = 'Something went wrong. Please try again.'
    }
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}

const inputClass = 'mt-1.5 w-full rounded-md border bg-surface px-3 py-2.5 pr-9 text-sm text-fg placeholder:text-muted/50 focus:outline-none focus:ring-1 transition-colors'
const labelClass = 'block text-xs font-medium text-muted'

function fieldBorderClass(touchedField: boolean, valid: boolean) {
  if (!touchedField) return 'border-border focus:border-accent-soft focus:ring-accent-soft'
  return valid
      ? 'border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/40'
      : 'border-secondary-soft focus:border-secondary-soft focus:ring-secondary-soft'
}
</script>

<template>
  <section id="contact" class="border-b border-border py-20 md:py-24">
    <div class="container-page">
      <div class="grid gap-12 md:grid-cols-2 md:gap-16">

        <div>
          <h2 class="text-2xl font-bold tracking-tight text-fg md:text-3xl">Get in touch</h2>
          <p class="mt-4 text-sm leading-relaxed text-muted">
            Whether you want to use the libraries, commission a custom engine, or get on the
            Enterprise waitlist - start here. I read every submission and respond within 1-2 business days.
          </p>
          <p class="mt-6 text-xs text-muted">
            Prefer email?
            <a href="mailto:lincketheo.dev@gmail.com" class="text-accent-soft hover:underline">lincketheo.dev@gmail.com</a>
          </p>
        </div>

        <div v-if="!submitted">
          <form class="grid gap-5" novalidate @submit.prevent="onSubmit">

            <!-- Interest - first and prominent -->
            <div>
              <label for="c-interest" :class="labelClass">
                What are you interested in? <span class="text-secondary-soft">*</span>
              </label>
              <div class="relative">
                <select
                    id="c-interest"
                    v-model="form.interest"
                    required
                    :class="[inputClass, fieldBorderClass(touched.interest, interestValid)]"
                    @change="markTouched('interest')"
                    @blur="markTouched('interest')"
                >
                  <option value="" disabled>Select…</option>
                  <option v-for="opt in interestOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <span v-if="touched.interest" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg v-if="interestValid" class="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42L8.5 12.09l6.79-6.8a1 1 0 011.42 0z" clip-rule="evenodd"/></svg>
                  <svg v-else class="h-4 w-4 text-secondary-soft" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.7 7.29a1 1 0 011.41 0L10 7.18l-.11.11a1 1 0 00-1.41 1.42L9.59 10l-1.11 1.29a1 1 0 101.41 1.42L10 11.41l.11.11a1 1 0 001.41-1.42L10.41 10l1.11-1.29a1 1 0 10-1.41-1.42L10 8.59l-.11-.11a1 1 0 00-1.19-.19z" clip-rule="evenodd"/></svg>
                </span>
              </div>
              <p v-if="touched.interest && !interestValid" class="mt-1 text-xs text-secondary-soft">Pick one to continue</p>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="c-name" :class="labelClass">Name <span class="text-secondary-soft">*</span></label>
                <div class="relative">
                  <input
                      id="c-name"
                      v-model="form.name"
                      type="text"
                      autocomplete="name"
                      required
                      :class="[inputClass, fieldBorderClass(touched.name, nameValid)]"
                      @blur="markTouched('name')"
                  />
                  <span v-if="touched.name" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg v-if="nameValid" class="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42L8.5 12.09l6.79-6.8a1 1 0 011.42 0z" clip-rule="evenodd"/></svg>
                    <svg v-else class="h-4 w-4 text-secondary-soft" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.7 7.29a1 1 0 011.41 0L10 7.18l-.11.11a1 1 0 00-1.41 1.42L9.59 10l-1.11 1.29a1 1 0 101.41 1.42L10 11.41l.11.11a1 1 0 001.41-1.42L10.41 10l1.11-1.29a1 1 0 10-1.41-1.42L10 8.59l-.11-.11a1 1 0 00-1.19-.19z" clip-rule="evenodd"/></svg>
                  </span>
                </div>
                <p v-if="touched.name && !nameValid" class="mt-1 text-xs text-secondary-soft">Required</p>
              </div>
              <div>
                <label for="c-email" :class="labelClass">Email <span class="text-secondary-soft">*</span></label>
                <div class="relative">
                  <input
                      id="c-email"
                      v-model="form.email"
                      type="email"
                      autocomplete="email"
                      required
                      :class="[inputClass, fieldBorderClass(touched.email, emailValid)]"
                      @blur="markTouched('email')"
                  />
                  <span v-if="touched.email" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg v-if="emailValid" class="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42L8.5 12.09l6.79-6.8a1 1 0 011.42 0z" clip-rule="evenodd"/></svg>
                    <svg v-else class="h-4 w-4 text-secondary-soft" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.7 7.29a1 1 0 011.41 0L10 7.18l-.11.11a1 1 0 00-1.41 1.42L9.59 10l-1.11 1.29a1 1 0 101.41 1.42L10 11.41l.11.11a1 1 0 001.41-1.42L10.41 10l1.11-1.29a1 1 0 10-1.41-1.42L10 8.59l-.11-.11a1 1 0 00-1.19-.19z" clip-rule="evenodd"/></svg>
                  </span>
                </div>
                <p v-if="touched.email && !emailValid" class="mt-1 text-xs text-secondary-soft">Needs an @ and a domain, e.g. name@example.com</p>
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
          <p class="text-lg font-semibold text-fg">Got it - thanks.</p>
          <p class="mt-2 text-sm text-muted">We'll reply within 1–2 business days.</p>
        </div>

      </div>
    </div>
  </section>
</template>
