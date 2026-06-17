<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { site } from '../config/site'

const stars = ref<number | null>(null)
const failed = ref(false)
const repoUrl = `https://github.com/${site.github.owner}/${site.github.repo}`
const cacheKey = `numstore:gh-stars:${site.github.owner}/${site.github.repo}`
const TTL = 60 * 60 * 1000

function format(n: number): string {
  if (n < 1000) return String(n)
  const k = n / 1000
  return `${k.toFixed(k >= 10 ? 1 : 1).replace(/\.0$/, '')}k`
}

onMounted(async () => {
  try {
    const raw = sessionStorage.getItem(cacheKey)
    if (raw) {
      const parsed = JSON.parse(raw) as { stars: number; t: number }
      if (Date.now() - parsed.t < TTL) {
        stars.value = parsed.stars
        return
      }
    }
  } catch {
    // ignore cache errors
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${site.github.owner}/${site.github.repo}`,
      { headers: { Accept: 'application/vnd.github+json' } },
    )
    if (!res.ok) throw new Error(`gh ${res.status}`)
    const data = (await res.json()) as { stargazers_count?: number }
    if (typeof data.stargazers_count === 'number') {
      stars.value = data.stargazers_count
      try {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ stars: data.stargazers_count, t: Date.now() }),
        )
      } catch {
        // ignore
      }
    } else {
      failed.value = true
    }
  } catch {
    failed.value = true
  }
})
</script>

<template>
  <a
    :href="repoUrl"
    target="_blank"
    rel="noopener"
    class="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-muted transition-colors hover:text-fg"
    :aria-label="stars !== null ? `${stars} stars on GitHub` : 'GitHub'"
  >
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path
        d="M12 .5a11.5 11.5 0 0 0-3.63 22.41c.57.1.78-.25.78-.55v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.97.1-.76.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39s1.98.13 2.9.39c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.26 5.69.41.35.78 1.03.78 2.08v3.08c0 .3.21.66.79.55A11.5 11.5 0 0 0 12 .5z"
      />
    </svg>
    <span v-if="stars !== null" class="tabular-nums">{{ format(stars) }}</span>
    <span v-else-if="failed" class="sr-only">GitHub</span>
    <span v-else class="text-muted/60 tabular-nums">···</span>
  </a>
</template>
