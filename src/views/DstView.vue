<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import {
  fetchDstStatus,
  SLOTS,
  type CrashRecord,
  type DstStatusResponse,
  type RunSummary,
} from '../lib/dstApi'

// One call: /dst_status?start_date=&end_date=&nelems=. The server does all
// the math — this component only draws the response.
type RangeKey = '24h' | '7d' | '30d'
const RANGES: Record<RangeKey, number> = { '24h': 1, '7d': 7, '30d': 30 }
const range = ref<RangeKey>('7d')

const res = ref<DstStatusResponse | null>(null)
const rangeEnd = ref(Date.now())
const loading = ref(false)

async function load() {
  loading.value = true
  const now = new Date()
  res.value = await fetchDstStatus(
    new Date(now.getTime() - RANGES[range.value] * 86_400_000),
    now,
    1500,
  )
  rangeEnd.value = now.getTime()
  loading.value = false
}
watch(range, load)

const nowTick = ref(Date.now())
let tick: ReturnType<typeof setInterval> | undefined
let refetch: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  load()
  tick = setInterval(() => (nowTick.value = Date.now()), 1000)
  refetch = setInterval(load, 60_000)
})
onBeforeUnmount(() => {
  if (tick) clearInterval(tick)
  if (refetch) clearInterval(refetch)
})

const stats = computed(() => res.value?.stats ?? null)
const fleet = computed(() => res.value?.fleet ?? [])
const crashes = computed(() => res.value?.crashes ?? [])
const healthy = computed(() => fleet.value.filter((p) => p.status === 'green').length)

const crashShown = ref(8)
watch(range, () => (crashShown.value = 8))
const expanded = ref<string | null>(null)

// ---------------------------------------------------------------------------
// Formatting (display only)
// ---------------------------------------------------------------------------
const fmt = (n: number) => n.toLocaleString('en-US')
function fmtDur(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  if (s < 3600) return Math.floor(s / 60) + 'm ' + (s % 60) + 's'
  if (s < 86400) return Math.floor(s / 3600) + 'h ' + Math.floor((s % 3600) / 60) + 'm'
  return Math.floor(s / 86400) + 'd ' + Math.floor((s % 86400) / 3600) + 'h'
}
function fmtBytes(b: number): string {
  if (b < 1_048_576) return (b / 1024).toFixed(0) + ' KiB'
  if (b < 1_073_741_824) return (b / 1_048_576).toFixed(1) + ' MiB'
  return (b / 1_073_741_824).toFixed(2) + ' GiB'
}
const fmtTime = (ts: number) =>
  new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

// ---------------------------------------------------------------------------
// Week-over-week rows (values and deltas straight from the API)
// ---------------------------------------------------------------------------
const weekRows = computed(() => {
  if (!stats.value) return []
  const { thisWeek: tw, lastWeek: lw, weekDelta: d } = stats.value
  return [
    { name: 'Runs completed', a: fmt(tw.completed), b: fmt(lw.completed), d: d.completed, upGood: null as boolean | null, pts: false },
    { name: 'Succeeded', a: fmt(tw.succeeded), b: fmt(lw.succeeded), d: d.succeeded, upGood: true, pts: false },
    { name: 'Failed', a: fmt(tw.failed), b: fmt(lw.failed), d: d.failed, upGood: false, pts: false },
    { name: 'Failure rate', a: tw.failureRatePct + '%', b: lw.failureRatePct + '%', d: d.ratePts, upGood: false, pts: true },
  ]
})
const deltaColor = (d: number, upGood: boolean | null) => {
  if (d === 0 || upGood === null) return '#9a9aa3'
  return d > 0 === upGood ? '#0ca30c' : '#e04a2c'
}

// ---------------------------------------------------------------------------
// Failure-rate chart (7 daily points from the API)
// ---------------------------------------------------------------------------
const FW = 640
const FH = 210
const FP = { l: 40, r: 54, t: 14, b: 26 }
const frPoints = computed(() => stats.value?.failureRate7d ?? [])
const frMax = computed(() =>
  Math.max(10, Math.ceil(Math.max(...frPoints.value.map((p) => p.rate), 0) / 10) * 10),
)
const fx = (i: number) => FP.l + (i / Math.max(1, frPoints.value.length - 1)) * (FW - FP.l - FP.r)
const fy = (r: number) => FP.t + (1 - r / frMax.value) * (FH - FP.t - FP.b)
const frPath = computed(() =>
  frPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${fx(i).toFixed(1)},${fy(p.rate).toFixed(1)}`).join(' '),
)
const frArea = computed(() =>
  frPoints.value.length
    ? `${frPath.value} L${fx(frPoints.value.length - 1)},${fy(0)} L${fx(0)},${fy(0)} Z`
    : '',
)
const frTicks = computed(() => [0, frMax.value / 2, frMax.value])
const frDay = (ts: number) => new Date(ts).toLocaleDateString('en-US', { weekday: 'short' })

// ---------------------------------------------------------------------------
// Timeline (5 lanes, one per process slot)
// ---------------------------------------------------------------------------
const TW = 1000
const LANE = 36
const TP = { l: 34, r: 10, t: 6, b: 24 }
const TH = TP.t + LANE * SLOTS + TP.b
const tlStart = computed(() => rangeEnd.value - RANGES[range.value] * 86_400_000)
const tx = (ts: number) =>
  TP.l + ((ts - tlStart.value) / (rangeEnd.value - tlStart.value)) * (TW - TP.l - TP.r)
interface Seg {
  run: RunSummary
  x: number
  w: number
  y: number
}
const segments = computed<Seg[]>(() =>
  (res.value?.runs ?? []).map((r) => {
    const x0 = Math.max(TP.l, tx(r.start))
    const x1 = Math.min(TW - TP.r, tx(r.end))
    return { run: r, x: x0, w: Math.max(2, x1 - x0), y: TP.t + r.slot * LANE + 9 }
  }),
)
const tlTicks = computed(() => {
  const n = 5
  return Array.from({ length: n }, (_, i) => {
    const ts = tlStart.value + ((i + 0.5) / n) * (rangeEnd.value - tlStart.value)
    const d = new Date(ts)
    return {
      x: tx(ts),
      label:
        range.value === '24h'
          ? d.toLocaleTimeString('en-US', { hour: 'numeric' })
          : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
  })
})

// ---------------------------------------------------------------------------
// Shared tooltip
// ---------------------------------------------------------------------------
const tip = reactive({ show: false, x: 0, y: 0, title: '', value: '', sub: '' })
function showTip(e: MouseEvent, value: string, title: string, sub = '') {
  tip.show = true
  tip.x = Math.min(e.clientX + 14, window.innerWidth - 230)
  tip.y = e.clientY + 14
  tip.title = title
  tip.value = value
  tip.sub = sub
}
const hideTip = () => (tip.show = false)
function segTip(e: MouseEvent, s: Seg) {
  const status =
    s.run.endReason === 'crash'
      ? 'crashed'
      : s.run.endReason === 'running'
        ? 'running'
        : 'replaced by newer build'
  showTip(
    e,
    s.run.gitTag + ' — ' + status,
    'started ' + fmtTime(s.run.start) + ' · up ' + fmtDur(s.run.end - s.run.start),
    'seed ' + s.run.seed,
  )
}
const topFrame = (c: CrashRecord) => c.callStack[1]?.split(' ')[0] ?? '—'
</script>

<template>
  <div class="border-b border-border">
    <section class="container-page py-16 md:py-24">
      <!-- Header + how it's set up -->
      <div class="max-w-3xl">
        <div class="eyebrow">
          <span class="relative flex h-1.5 w-1.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-soft opacity-75" />
            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary-soft" />
          </span>
          Deterministic simulation · running
        </div>
        <h1 class="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Numstore, under torture.
        </h1>
        <p class="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Five processes run the simulator around the clock, one build each. Every 300 seconds
          each process reports a poll — seed, uptime, database size — green if it's alive, red
          with a call stack if it crashed. A crash restarts the same build on a fresh seed, and
          when a new git tag lands it replaces the slot running the oldest build. Every crash
          replays, byte for byte, from its seed.
        </p>
        <p class="mt-4 font-mono text-xs text-muted">
          5 processes · poll every 300 s · ~1 h mean time to crash · new tags 1–2× a day
        </p>
      </div>

      <!-- KPI row -->
      <div class="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-surface p-6">
          <p class="text-xs font-medium uppercase tracking-widest text-muted">Fleet</p>
          <p class="mt-2 font-display text-3xl font-semibold">{{ healthy }}/{{ SLOTS }}</p>
          <p class="mt-1 text-xs text-muted">processes alive right now</p>
        </div>
        <div class="bg-surface p-6">
          <p class="text-xs font-medium uppercase tracking-widest text-muted">Runs completed</p>
          <p class="mt-2 font-display text-3xl font-semibold">{{ stats ? fmt(stats.runsCompleted) : '—' }}</p>
          <p class="mt-1 text-xs text-muted">all time</p>
        </div>
        <div class="bg-surface p-6">
          <p class="text-xs font-medium uppercase tracking-widest text-muted">Simulated uptime</p>
          <p class="mt-2 font-display text-3xl font-semibold">{{ stats ? stats.simUptimeYears.toFixed(1) : '—' }} yrs</p>
          <p class="mt-1 text-xs text-muted">of disk time, compressed</p>
        </div>
        <div class="bg-surface p-6">
          <p class="text-xs font-medium uppercase tracking-widest text-muted">Bugs caught</p>
          <p class="mt-2 font-display text-3xl font-semibold">{{ stats ? stats.bugsCaught : '—' }}</p>
          <p class="mt-1 text-xs text-muted">replayed from their seed, then fixed</p>
        </div>
      </div>

      <!-- Failure rate + week over week -->
      <div class="mt-6 grid gap-6 lg:grid-cols-5">
        <div class="rounded-xl border border-border bg-surface p-6 lg:col-span-3">
          <h2 class="font-display text-lg font-semibold tracking-tight">Failure rate, trailing 7 days</h2>
          <p class="mt-1 text-xs text-muted">share of completed runs that ended in a crash</p>
          <svg v-if="frPoints.length" :viewBox="`0 0 ${FW} ${FH}`" class="mt-4 w-full" role="img"
            aria-label="Line chart of daily failure rate over the trailing seven days">
            <g v-for="t in frTicks" :key="t">
              <line :x1="FP.l" :x2="FW - FP.r" :y1="fy(t)" :y2="fy(t)" stroke="#26262b" stroke-width="1" />
              <text :x="FP.l - 8" :y="fy(t) + 3" text-anchor="end" font-size="10" fill="#9a9aa3"
                style="font-variant-numeric: tabular-nums">{{ t }}%</text>
            </g>
            <path :d="frArea" fill="#e04a2c" fill-opacity="0.1" />
            <path :d="frPath" fill="none" stroke="#e04a2c" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
            <g v-for="(p, i) in frPoints" :key="p.ts">
              <text :x="fx(i)" :y="FH - 8" text-anchor="middle" font-size="10" fill="#9a9aa3">{{ frDay(p.ts) }}</text>
              <circle :cx="fx(i)" :cy="fy(p.rate)" r="4" fill="#e04a2c" stroke="#111113" stroke-width="2" />
              <rect :x="fx(i) - 24" y="0" width="48" :height="FH" fill="transparent"
                @mousemove="showTip($event, p.rate.toFixed(1) + '%', frDay(p.ts) + ' · failure rate')" @mouseleave="hideTip" />
            </g>
            <text v-if="frPoints.length" :x="fx(frPoints.length - 1) + 10" :y="fy(frPoints[frPoints.length - 1].rate) + 4"
              font-size="11" font-weight="600" fill="#e7e7ea">{{ frPoints[frPoints.length - 1].rate.toFixed(1) }}%</text>
          </svg>
        </div>

        <div class="rounded-xl border border-border bg-surface p-6 lg:col-span-2">
          <h2 class="font-display text-lg font-semibold tracking-tight">This week vs last</h2>
          <p class="mt-1 text-xs text-muted">runs, by how they ended</p>
          <table class="mt-5 w-full text-sm">
            <thead>
              <tr class="text-xs uppercase tracking-widest text-muted">
                <th class="pb-3 text-left font-medium"></th>
                <th class="pb-3 text-right font-medium">This wk</th>
                <th class="pb-3 text-right font-medium">Last wk</th>
                <th class="pb-3 text-right font-medium">Δ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in weekRows" :key="r.name" class="border-t border-border">
                <td class="py-3 text-fg">{{ r.name }}</td>
                <td class="py-3 text-right font-semibold" style="font-variant-numeric: tabular-nums">{{ r.a }}</td>
                <td class="py-3 text-right text-muted" style="font-variant-numeric: tabular-nums">{{ r.b }}</td>
                <td class="py-3 text-right text-xs font-medium" style="font-variant-numeric: tabular-nums"
                  :style="{ color: deltaColor(r.d, r.upGood) }">
                  {{ r.d > 0 ? '▲' : r.d < 0 ? '▼' : '—' }} {{ Math.abs(r.d) }}{{ r.pts ? ' pts' : '' }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="mt-4 text-xs text-muted">
            A run succeeds when a newer build replaces it before it ever crashed.
          </p>
        </div>
      </div>

      <!-- Fleet -->
      <div class="mt-6">
        <h2 class="font-display text-lg font-semibold tracking-tight">The fleet, right now</h2>
        <p class="mt-1 text-xs text-muted">ordered by start time — longest-lived run first</p>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div v-for="p in fleet" :key="p.runId"
            class="rounded-xl border bg-surface p-5"
            :class="p.status === 'red' ? 'border-secondary-soft/50' : 'border-border'">
            <div class="flex items-center justify-between">
              <span class="font-mono text-sm font-semibold text-accent-soft">{{ p.gitTag }}</span>
              <span class="inline-flex items-center gap-1.5 text-xs" :style="{ color: p.status === 'red' ? '#e04a2c' : '#0ca30c' }">
                <span class="h-1.5 w-1.5 rounded-full" :style="{ background: p.status === 'red' ? '#e04a2c' : '#0ca30c' }" />
                {{ p.status === 'red' ? 'crashed' : 'running' }}
              </span>
            </div>
            <p class="mt-3 font-display text-2xl font-semibold" style="font-variant-numeric: tabular-nums">
              {{ fmtDur((p.status === 'red' ? p.lastPollTs : nowTick) - p.start) }}
            </p>
            <p class="text-xs text-muted">started {{ fmtTime(p.start) }}</p>
            <dl class="mt-4 space-y-1.5 border-t border-border pt-3 font-mono text-[11px] text-muted">
              <div class="flex justify-between gap-2"><dt>seed</dt><dd class="truncate text-fg">{{ p.seed }}</dd></div>
              <div class="flex justify-between gap-2"><dt>db</dt><dd class="text-fg">{{ fmtBytes(p.dbBytes) }}</dd></div>
              <div class="flex justify-between gap-2"><dt>pid</dt><dd>{{ p.pid }}</dd></div>
              <div class="flex justify-between gap-2"><dt>poll</dt><dd>#{{ p.pollSeq }}</dd></div>
              <div class="flex justify-between gap-2"><dt>commit</dt><dd>{{ p.commit }}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <!-- History: timeline -->
      <div class="mt-10">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="font-display text-lg font-semibold tracking-tight">Run history</h2>
            <p class="mt-1 text-xs text-muted">one lane per process · each bar is one run, ended by a crash or a newer build</p>
          </div>
          <div class="flex items-center gap-1 rounded-lg border border-border bg-surface p-1 text-xs">
            <button v-for="(_, k) in RANGES" :key="k" type="button"
              class="rounded-md px-3 py-1.5 font-medium transition-colors"
              :class="range === k ? 'bg-elevated text-fg' : 'text-muted hover:text-fg'"
              @click="range = k">
              {{ k }}
            </button>
          </div>
        </div>

        <div class="mt-4 rounded-xl border border-border bg-surface p-6 transition-opacity" :class="loading ? 'opacity-60' : ''">
          <svg :viewBox="`0 0 ${TW} ${TH}`" class="w-full" role="img"
            aria-label="Timeline of simulator runs per process over the selected range; red marks are crashes">
            <g v-for="t in tlTicks" :key="t.x">
              <line :x1="t.x" :x2="t.x" :y1="TP.t" :y2="TH - TP.b" stroke="#26262b" stroke-width="1" />
              <text :x="t.x" :y="TH - 8" text-anchor="middle" font-size="10" fill="#9a9aa3">{{ t.label }}</text>
            </g>
            <text v-for="i in SLOTS" :key="'l' + i" :x="TP.l - 10" :y="TP.t + (i - 1) * LANE + 21"
              text-anchor="end" font-size="10" fill="#9a9aa3" font-family="monospace">P{{ i - 1 }}</text>
            <g v-for="s in segments" :key="s.run.runId">
              <rect :x="s.x" :y="s.y" :width="s.w" height="16" rx="3"
                :fill="s.run.endReason === 'running' ? '#4a6cd9' : '#1c3a7a'"
                class="cursor-pointer transition-[filter] hover:brightness-150"
                @mousemove="segTip($event, s)" @mouseleave="hideTip" />
              <rect v-if="s.run.endReason === 'crash'" :x="s.x + s.w - 3" :y="s.y" width="3" height="16"
                fill="#e04a2c" pointer-events="none" />
            </g>
          </svg>
          <div class="mt-3 flex flex-wrap items-center gap-5 text-xs text-muted">
            <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-4 rounded-sm" style="background:#1c3a7a" /> run</span>
            <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-4 rounded-sm" style="background:#4a6cd9" /> still running</span>
            <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-1 rounded-sm" style="background:#e04a2c" /> crash</span>
          </div>
        </div>
      </div>

      <!-- Crash log -->
      <div class="mt-6 rounded-xl border border-border bg-surface p-6 transition-opacity" :class="loading ? 'opacity-60' : ''">
        <h2 class="font-display text-lg font-semibold tracking-tight">Crash log</h2>
        <p class="mt-1 text-xs text-muted">{{ crashes.length }} crashes in the last {{ range }} · click a row for the call stack</p>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full min-w-[640px] text-sm">
            <thead>
              <tr class="text-left text-xs uppercase tracking-widest text-muted">
                <th class="pb-3 pr-4 font-medium">When</th>
                <th class="pb-3 pr-4 font-medium">Proc</th>
                <th class="pb-3 pr-4 font-medium">Build</th>
                <th class="pb-3 pr-4 font-medium">Ran for</th>
                <th class="pb-3 pr-4 font-medium">Seed</th>
                <th class="pb-3 font-medium">Died in</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="c in crashes.slice(0, crashShown)" :key="c.runId">
                <tr class="cursor-pointer border-t border-border hover:bg-elevated/50"
                  @click="expanded = expanded === c.runId ? null : c.runId">
                  <td class="py-3 pr-4 whitespace-nowrap text-muted">{{ fmtTime(c.ts) }}</td>
                  <td class="py-3 pr-4 font-mono text-xs">P{{ c.slot }}</td>
                  <td class="py-3 pr-4 font-mono text-xs text-accent-soft">{{ c.gitTag }}</td>
                  <td class="py-3 pr-4 whitespace-nowrap" style="font-variant-numeric: tabular-nums">{{ fmtDur(c.uptimeS * 1000) }}</td>
                  <td class="py-3 pr-4 font-mono text-xs text-muted">{{ c.seed.slice(0, 12) }}…</td>
                  <td class="py-3 font-mono text-xs text-secondary-soft">{{ topFrame(c) }}</td>
                </tr>
                <tr v-if="expanded === c.runId" class="border-t border-border/50 bg-bg/60">
                  <td colspan="6" class="px-4 py-4">
                    <pre class="overflow-x-auto font-mono text-xs leading-relaxed text-fg">{{ c.callStack.join('\n') }}</pre>
                    <p class="mt-3 font-mono text-[11px] text-muted">
                      {{ c.runId }} · pid {{ c.pid }} · commit {{ c.commit }} · seed {{ c.seed }} ·
                      db {{ fmtBytes(c.dbBytes) }} at crash · poll #{{ c.pollSeq }} · {{ c.nParams }} params (dst_params.csv)
                    </p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <button v-if="crashes.length > crashShown" type="button"
          class="mt-4 rounded-md border border-border px-4 py-2 text-xs font-medium text-muted hover:bg-elevated hover:text-fg"
          @click="crashShown += 12">
          Show more ({{ crashes.length - crashShown }} remaining)
        </button>
      </div>

      <p class="mt-6 text-xs text-muted">
        Illustrative data — this page renders whatever <span class="font-mono">/dst_status</span> returns.
      </p>
    </section>

    <!-- Shared tooltip -->
    <div v-if="tip.show"
      class="pointer-events-none fixed z-50 max-w-[220px] rounded-md border border-border bg-elevated px-3 py-2 shadow-xl shadow-black/50"
      :style="{ left: tip.x + 'px', top: tip.y + 'px' }">
      <p class="text-sm font-semibold text-fg">{{ tip.value }}</p>
      <p class="text-xs text-muted">{{ tip.title }}<template v-if="tip.sub"> · <span class="font-mono">{{ tip.sub }}</span></template></p>
    </div>
  </div>
</template>
