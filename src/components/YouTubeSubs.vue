<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { site } from '../config/site'

const subs = ref<number | null>(null)
const failed = ref(false)
const channelUrl = `https://www.youtube.com/${site.youtube.handle}`
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
const cacheKey = `numstore:yt-subs:${site.youtube.channelId}`
const TTL = 60 * 60 * 1000

function format(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) {
    const k = n / 1000
    return `${k.toFixed(k >= 10 ? 1 : 1).replace(/\.0$/, '')}k`
  }
  const m = n / 1_000_000
  return `${m.toFixed(1).replace(/\.0$/, '')}M`
}

onMounted(async () => {
  if (!apiKey) return

  try {
    const raw = sessionStorage.getItem(cacheKey)
    if (raw) {
      const parsed = JSON.parse(raw) as { subs: number; t: number }
      if (Date.now() - parsed.t < TTL) {
        subs.value = parsed.subs
        return
      }
    }
  } catch {
    // ignore
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${site.youtube.channelId}&key=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`yt ${res.status}`)
    const data = (await res.json()) as {
      items?: { statistics?: { subscriberCount?: string } }[]
    }
    const count = data.items?.[0]?.statistics?.subscriberCount
    if (count) {
      const n = Number(count)
      subs.value = n
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ subs: n, t: Date.now() }))
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
    :href="channelUrl"
    target="_blank"
    rel="noopener"
    class="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-muted transition-colors hover:text-fg"
    :aria-label="subs !== null ? `${subs} YouTube subscribers` : 'YouTube'"
  >
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7l6.3 3.5-6.3 3.5z"
      />
    </svg>
    <span v-if="subs !== null" class="tabular-nums">{{ format(subs) }}</span>
  </a>
</template>
