<script setup lang="ts">
import { computed, ref } from 'vue'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import python from 'highlight.js/lib/languages/python'
import rust from 'highlight.js/lib/languages/rust'
import 'highlight.js/styles/github-dark.css'

import smartfilesCInstall from '../../examples/smartfiles/c/install.sh?raw'
import smartfilesCCode from '../../examples/smartfiles/c/main.c?raw'
import smartfilesPythonInstall from '../../examples/smartfiles/python/install.sh?raw'
import smartfilesPythonCode from '../../examples/smartfiles/python/main.py?raw'
import smartfilesRustInstall from '../../examples/smartfiles/rust/install.sh?raw'
import smartfilesRustCode from '../../examples/smartfiles/rust/main.rs?raw'

import numstoreCInstall from '../../examples/numstore/c/install.sh?raw'
import numstoreCCode from '../../examples/numstore/c/main.c?raw'
import numstorePythonInstall from '../../examples/numstore/python/install.sh?raw'
import numstorePythonCode from '../../examples/numstore/python/main.py?raw'
import numstoreRustInstall from '../../examples/numstore/rust/install.sh?raw'
import numstoreRustCode from '../../examples/numstore/rust/main.rs?raw'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('c', c)
hljs.registerLanguage('python', python)
hljs.registerLanguage('rust', rust)

interface Example {
  id: string
  label: string
  install: string
  code: string
}

interface Product {
  id: string
  label: string
  blurb: string
  examples: Example[]
}

// Languages are the same set across products so the user's choice
// is preserved when they switch products.
const products: Product[] = [
  {
    id: 'smartfiles',
    label: 'SmartFiles',
    blurb: 'The ACID file. Open it, write bytes, do strided reads.',
    examples: [
      { id: 'c', label: 'C', install: smartfilesCInstall, code: smartfilesCCode },
      {
        id: 'python',
        label: 'Python',
        install: smartfilesPythonInstall,
        code: smartfilesPythonCode,
      },
      { id: 'rust', label: 'Rust', install: smartfilesRustInstall, code: smartfilesRustCode },
    ],
  },
  {
    id: 'numstore',
    label: 'Numstore',
    blurb: 'The typed numerical database. Open it, declare a column, write values.',
    examples: [
      { id: 'c', label: 'C', install: numstoreCInstall, code: numstoreCCode },
      { id: 'python', label: 'Python', install: numstorePythonInstall, code: numstorePythonCode },
      { id: 'rust', label: 'Rust', install: numstoreRustInstall, code: numstoreRustCode },
    ],
  },
]

const activeProduct = ref(products[0].id)
const activeLang = ref(products[0].examples[0].id)

const currentProduct = computed(
  () => products.find((p) => p.id === activeProduct.value) ?? products[0],
)
const currentExample = computed(
  () =>
    currentProduct.value.examples.find((e) => e.id === activeLang.value) ??
    currentProduct.value.examples[0],
)

const copied = ref(false)
async function copyCode() {
  try {
    await navigator.clipboard.writeText(currentExample.value.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}

function highlight(code: string, language: string): string {
  try {
    return hljs.highlight(code, { language, ignoreIllegals: true }).value
  } catch {
    // Unknown language → fall back to plain text (still escaped).
    return hljs.highlight(code, { language: 'plaintext', ignoreIllegals: true }).value
  }
}

const highlightedCode = computed(() =>
  highlight(currentExample.value.code, currentExample.value.id),
)
const highlightedInstall = computed(() => highlight(currentExample.value.install, 'bash'))
</script>

<template>
  <section class="border-y border-border bg-surface/30 py-20 md:py-28">
    <div class="container-page">
      <div class="max-w-2xl">
        <div class="eyebrow">Quickstart</div>
        <h2 class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Numstore is ready in a few lines
        </h2>
        <p class="mt-4 text-base leading-relaxed text-muted md:text-lg">
          Pick a product, pick a language. The same shape everywhere — open it, write some bytes or
          values, read them back.
        </p>
      </div>

      <div
        class="mt-10 overflow-hidden rounded-xl border border-border bg-bg shadow-2xl shadow-black/40"
      >
        <div
          class="flex flex-wrap items-center gap-2 border-b border-border bg-surface/60 p-2"
          role="tablist"
          aria-label="Product"
        >
          <button
            v-for="p in products"
            :key="p.id"
            type="button"
            role="tab"
            :id="`qs-prod-${p.id}`"
            :aria-selected="activeProduct === p.id"
            :tabindex="activeProduct === p.id ? 0 : -1"
            class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors min-h-[40px]"
            :class="
              activeProduct === p.id
                ? 'bg-bg text-fg border border-border'
                : 'text-muted hover:text-fg border border-transparent'
            "
            @click="activeProduct = p.id"
          >
            {{ p.label }}
          </button>
        </div>

        <div class="border-b border-border bg-surface/40 px-2" role="tablist" aria-label="Language">
          <div class="flex flex-wrap">
            <button
              v-for="ex in currentProduct.examples"
              :key="ex.id"
              type="button"
              role="tab"
              :id="`qs-lang-${currentProduct.id}-${ex.id}`"
              :aria-selected="activeLang === ex.id"
              :tabindex="activeLang === ex.id ? 0 : -1"
              class="relative -mb-px px-4 py-3 text-sm font-medium transition-colors min-h-[44px]"
              :class="
                activeLang === ex.id
                  ? 'text-fg border-b-2 border-accent-soft'
                  : 'text-muted hover:text-fg border-b-2 border-transparent'
              "
              @click="activeLang = ex.id"
            >
              {{ ex.label }}
            </button>
          </div>
        </div>

        <div class="grid gap-px bg-border">
          <div class="bg-bg p-5">
            <div class="flex items-baseline justify-between gap-3">
              <span class="font-mono text-[10px] uppercase tracking-widest text-muted">Setup</span>
              <span class="text-xs leading-relaxed text-muted">{{ currentProduct.blurb }}</span>
            </div>
            <pre
              class="mt-2 overflow-x-auto font-mono text-[13px] leading-[1.6]"
            ><code class="hljs language-bash" v-html="highlightedInstall" /></pre>
          </div>
          <div class="bg-bg p-5">
            <div class="flex items-center justify-between gap-3">
              <span class="font-mono text-[10px] uppercase tracking-widest text-muted">Code</span>
              <button
                type="button"
                class="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-muted transition-colors hover:text-fg"
                :aria-label="copied ? 'Copied' : 'Copy code'"
                @click="copyCode"
              >
                <svg
                  v-if="!copied"
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5 text-accent-soft"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre
              class="mt-2 overflow-x-auto font-mono text-[13px] leading-[1.6]"
            ><code :class="['hljs', `language-${currentExample.id}`]" v-html="highlightedCode" /></pre>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Strip github-dark's background so the code blends with our panel. */
:deep(.hljs) {
  background: transparent;
  padding: 0;
  color: #e7e7ea;
}
</style>
