<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  interest: string
  message: string
}

const form = reactive<ContactPayload>({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  jobTitle: '',
  interest: '',
  message: '',
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  interest: '',
})

const submitting = ref(false)
const submitted = ref(false)
const submitError = ref<string | null>(null)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const interestOptions = [
  'Enterprise Support',
  'Feature Development',
  'Engineering Collaboration',
  'Unsure — exploratory',
  'Other',
]

const isValid = computed(
  () =>
    form.firstName.trim() &&
    form.lastName.trim() &&
    emailRe.test(form.email.trim()) &&
    form.interest,
)

function validate(): boolean {
  errors.firstName = form.firstName.trim() ? '' : 'Required'
  errors.lastName = form.lastName.trim() ? '' : 'Required'
  errors.email = emailRe.test(form.email.trim()) ? '' : 'Enter a valid work email'
  errors.interest = form.interest ? '' : 'Pick one'
  return !errors.firstName && !errors.lastName && !errors.email && !errors.interest
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
</script>

<template>
  <div class="rounded-2xl border border-border bg-surface p-6 sm:p-8">
    <div v-if="!submitted">
      <h2 class="font-display text-2xl font-semibold tracking-tight">Tell us about your project</h2>
      <p class="mt-2 text-sm text-muted">
        Everything you send goes to a human on our team — usually whoever knows the most about your use case.
      </p>

      <form class="mt-8 grid gap-5" novalidate @submit.prevent="onSubmit">
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="firstName" class="block text-xs font-medium text-muted">First name <span class="text-accent-soft">*</span></label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              autocomplete="given-name"
              required
              class="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-accent-soft focus:outline-none focus:ring-1 focus:ring-accent-soft"
              :aria-invalid="!!errors.firstName"
              :aria-describedby="errors.firstName ? 'firstName-error' : undefined"
            />
            <p v-if="errors.firstName" id="firstName-error" class="mt-1 text-xs text-red-400">{{ errors.firstName }}</p>
          </div>
          <div>
            <label for="lastName" class="block text-xs font-medium text-muted">Last name <span class="text-accent-soft">*</span></label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              autocomplete="family-name"
              required
              class="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-accent-soft focus:outline-none focus:ring-1 focus:ring-accent-soft"
              :aria-invalid="!!errors.lastName"
              :aria-describedby="errors.lastName ? 'lastName-error' : undefined"
            />
            <p v-if="errors.lastName" id="lastName-error" class="mt-1 text-xs text-red-400">{{ errors.lastName }}</p>
          </div>
        </div>

        <div>
          <label for="email" class="block text-xs font-medium text-muted">Work email <span class="text-accent-soft">*</span></label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            required
            class="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-accent-soft focus:outline-none focus:ring-1 focus:ring-accent-soft"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'email-error' : undefined"
          />
          <p v-if="errors.email" id="email-error" class="mt-1 text-xs text-red-400">{{ errors.email }}</p>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="company" class="block text-xs font-medium text-muted">Company</label>
            <input
              id="company"
              v-model="form.company"
              type="text"
              autocomplete="organization"
              class="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-accent-soft focus:outline-none focus:ring-1 focus:ring-accent-soft"
            />
          </div>
          <div>
            <label for="jobTitle" class="block text-xs font-medium text-muted">Job title</label>
            <input
              id="jobTitle"
              v-model="form.jobTitle"
              type="text"
              autocomplete="organization-title"
              class="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-accent-soft focus:outline-none focus:ring-1 focus:ring-accent-soft"
            />
          </div>
        </div>

        <div>
          <label for="interest" class="block text-xs font-medium text-muted">What are you looking for? <span class="text-accent-soft">*</span></label>
          <select
            id="interest"
            v-model="form.interest"
            required
            class="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg focus:border-accent-soft focus:outline-none focus:ring-1 focus:ring-accent-soft"
            :aria-invalid="!!errors.interest"
            :aria-describedby="errors.interest ? 'interest-error' : undefined"
          >
            <option value="" disabled>Select one…</option>
            <option v-for="opt in interestOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <p v-if="errors.interest" id="interest-error" class="mt-1 text-xs text-red-400">{{ errors.interest }}</p>
        </div>

        <div>
          <label for="message" class="block text-xs font-medium text-muted">Tell us about your use case</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="5"
            class="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-accent-soft focus:outline-none focus:ring-1 focus:ring-accent-soft"
            placeholder="Workloads, scale, current stack, timelines — whatever helps us help you."
          />
        </div>

        <div>
          <button
            type="submit"
            class="btn-primary w-full sm:w-auto"
            :disabled="submitting || !isValid"
            :aria-disabled="submitting || !isValid"
          >
            <span v-if="submitting">Sending…</span>
            <span v-else>Send message</span>
            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 10h10M11 6l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <p class="mt-3 text-xs text-muted">
            By submitting this form, you agree that Numstore may contact you regarding your request.
          </p>
          <p v-if="submitError" class="mt-2 text-xs text-red-400">{{ submitError }}</p>
        </div>
      </form>
    </div>

    <div v-else class="py-10 text-center">
      <div class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
        <svg viewBox="0 0 24 24" class="h-6 w-6 text-accent-soft" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2 class="mt-6 font-display text-2xl font-semibold tracking-tight">Thanks for contacting us!</h2>
      <p class="mt-2 text-sm text-muted">
        We will get in touch with you shortly.
      </p>
      <a href="#" class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-soft hover:text-white">
        ↑ Back to top
      </a>
    </div>
  </div>
</template>
