<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

// Deterministic PRNG — fitting, for a page about deterministic simulation.
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(0xdeadbeef)

const SOURCES = [
  'WAL replay',
  'Rope+Tree rebalance',
  'Torn write (fsync)',
  'Page allocator',
  'Buffer pool eviction',
  'Lock manager',
] as const

// --- 30 days of failure-rate history: high early, driven down over time ---
interface DayPoint {
  label: string
  rate: number
}
const history: DayPoint[] = (() => {
  const out: DayPoint[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000)
    const t = (29 - i) / 29
    const base = 6.4 * Math.exp(-2.1 * t) + 0.9
    const noise = (rand() - 0.5) * 0.7 * (1 - t * 0.6)
    out.push({
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rate: Math.max(0.4, base + noise),
    })
  }
  return out
})()
const currentRate = history[history.length - 1].rate
const weekAgoRate = history[history.length - 8].rate

// --- Failure sources (bugs caught, reproduced from their seed, fixed) ---
const sources = reactive(
  [41, 33, 19, 12, 7, 4].map((count, i) => ({ name: SOURCES[i], count })),
)
const totalBugs = computed(() => sources.reduce((s, x) => s + x.count, 0))

// --- Run grid: most recent runs, one cell each, newest last ---
interface Run {
  seed: string
  ok: boolean
  src?: string
  ops: number
}
const GRID = 336
function hexSeed(): string {
  const hi = Math.floor(rand() * 0xffffffff) >>> 0
  const lo = Math.floor(rand() * 0xffffffff) >>> 0
  return '0x' + hi.toString(16).padStart(8, '0') + lo.toString(16).padStart(8, '0')
}
function makeRun(failP: number): Run {
  const ok = rand() >= failP
  return {
    seed: hexSeed(),
    ok,
    src: ok ? undefined : SOURCES[Math.floor(rand() * rand() * SOURCES.length)],
    ops: Math.floor(40 + rand() * 90),
  }
}
const runs = reactive<Run[]>(Array.from({ length: GRID }, () => makeRun(0.018)))

// --- Live counters ---
const runsCompleted = ref(1_283_406)
const simYears = ref(214.6)
const liveSeed = ref(hexSeed())
const liveOps = ref(0)
const liveFaults = ref('crash@fsync · torn page · io reorder')
const FAULT_MIXES = [
  'crash@fsync · torn page · io reorder',
  'power loss · partial write · clock skew',
  'crash@checkpoint · disk full · io stall',
  'torn page ×2 · crash@rebalance',
  'io reorder · crash@wal-append',
]

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return
  timer = setInterval(() => {
    runsCompleted.value += 38 + Math.floor(rand() * 24)
    simYears.value += 0.003
    liveOps.value = Math.floor(8 + rand() * 110)
    if (rand() < 0.4) {
      liveSeed.value = hexSeed()
      liveFaults.value = FAULT_MIXES[Math.floor(rand() * FAULT_MIXES.length)]
    }
    runs.shift()
    runs.push(makeRun(0.015))
  }, 1400)
})
onBeforeUnmount(() => timer && clearInterval(timer))

// --- Line chart geometry ---
const CW = 720
const CH = 262
const PAD = { l: 36, r: 52, t: 12, b: 24 }
const yMax = 8
const px = (i: number) => PAD.l + (i / (history.length - 1)) * (CW - PAD.l - PAD.r)
const py = (r: number) => PAD.t + (1 - r / yMax) * (CH - PAD.t - PAD.b)
const linePath = computed(() =>
  history.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(p.rate).toFixed(1)}`).join(' '),
)
const areaPath = computed(
  () => `${linePath.value} L${px(history.length - 1).toFixed(1)},${py(0)} L${px(0).toFixed(1)},${py(0)} Z`,
)
const yTicks = [0, 2, 4, 6, 8]
const xTickIdx = [0, 10, 20, 29]

// --- Hover state (crosshair + tooltip) ---
const hoverIdx = ref<number | null>(null)
const tip = reactive({ show: false, x: 0, y: 0, title: '', value: '', sub: '' })
function showTip(e: MouseEvent, title: string, value: string, sub = '') {
  tip.show = true
  tip.x = Math.min(e.clientX + 14, window.innerWidth - 190)
  tip.y = e.clientY + 14
  tip.title = title
  tip.value = value
  tip.sub = sub
}
function hideTip() {
  tip.show = false
  hoverIdx.value = null
}
function onChartMove(e: MouseEvent) {
  const svg = e.currentTarget as SVGSVGElement
  const rect = svg.getBoundingClientRect()
  const fx = ((e.clientX - rect.left) / rect.width) * CW
  const i = Math.round(((fx - PAD.l) / (CW - PAD.l - PAD.r)) * (history.length - 1))
  const idx = Math.max(0, Math.min(history.length - 1, i))
  hoverIdx.value = idx
  showTip(e, history[idx].label, history[idx].rate.toFixed(2) + '%', 'failure rate')
}

const maxSource = computed(() => Math.max(...sources.map((s) => s.count)))
const fmt = (n: number) => n.toLocaleString('en-US')
</script>

<template>
  <div class="border-b border-border">
    <section class="container-page py-16 md:py-24">
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
          A fleet of simulators runs Numstore inside a fake disk and a hostile clock —
          crashing it mid-write, tearing pages, reordering I/O — then checks that recovery
          puts every byte back where it belongs. Same seed, same universe, every time.
        </p>
      </div>

      <!-- KPI row -->
      <div class="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-surface p-6">
          <p class="text-xs font-medium uppercase tracking-widest text-muted">Runs completed</p>
          <p class="mt-2 font-display text-3xl font-semibold">{{ fmt(runsCompleted) }}</p>
          <p class="mt-1 text-xs text-muted">since v1.0</p>
        </div>
        <div class="bg-surface p-6">
          <p class="text-xs font-medium uppercase tracking-widest text-muted">Simulated uptime</p>
          <p class="mt-2 font-display text-3xl font-semibold">{{ simYears.toFixed(1) }} yrs</p>
          <p class="mt-1 text-xs text-muted">of disk time, compressed</p>
        </div>
        <div class="bg-surface p-6">
          <p class="text-xs font-medium uppercase tracking-widest text-muted">Bugs caught</p>
          <p class="mt-2 font-display text-3xl font-semibold">{{ totalBugs }}</p>
          <p class="mt-1 text-xs text-muted">each replayed from its seed, then fixed</p>
        </div>
        <div class="bg-surface p-6">
          <p class="text-xs font-medium uppercase tracking-widest text-muted">Failure rate, 7d</p>
          <p class="mt-2 font-display text-3xl font-semibold">{{ currentRate.toFixed(2) }}%</p>
          <p class="mt-1 text-xs" style="color: #0ca30c">
            ▼ {{ (weekAgoRate - currentRate).toFixed(2) }} pts vs last week
          </p>
        </div>
      </div>

      <!-- Now fuzzing -->
      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border bg-surface px-6 py-4 font-mono text-xs text-muted">
        <span class="text-fg">now fuzzing</span>
        <span>seed <span class="text-accent-soft">{{ liveSeed }}</span></span>
        <span>{{ liveOps }}M ops</span>
        <span>faults: {{ liveFaults }}</span>
      </div>

      <div class="mt-6 grid gap-6 lg:grid-cols-5">
        <!-- Failure rate over time -->
        <div class="rounded-xl border border-border bg-surface p-6 lg:col-span-3">
          <h2 class="font-display text-lg font-semibold tracking-tight">Failure rate, last 30 days</h2>
          <p class="mt-1 text-xs text-muted">share of runs that broke an invariant</p>
          <svg
            :viewBox="`0 0 ${CW} ${CH}`"
            class="mt-4 w-full"
            role="img"
            aria-label="Line chart of daily failure rate over the last 30 days, declining from about six percent to under two percent"
            @mousemove="onChartMove"
            @mouseleave="hideTip"
          >
            <g v-for="t in yTicks" :key="t">
              <line :x1="PAD.l" :x2="CW - PAD.r" :y1="py(t)" :y2="py(t)" stroke="#26262b" stroke-width="1" />
              <text :x="PAD.l - 8" :y="py(t) + 3" text-anchor="end" font-size="10" fill="#9a9aa3" style="font-variant-numeric: tabular-nums">{{ t }}%</text>
            </g>
            <text v-for="i in xTickIdx" :key="'x' + i" :x="px(i)" :y="CH - 6" text-anchor="middle" font-size="10" fill="#9a9aa3">{{ history[i].label }}</text>
            <path :d="areaPath" fill="#e04a2c" fill-opacity="0.1" />
            <path :d="linePath" fill="none" stroke="#e04a2c" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
            <line
              v-if="hoverIdx !== null"
              :x1="px(hoverIdx)" :x2="px(hoverIdx)" :y1="PAD.t" :y2="py(0)"
              stroke="#9a9aa3" stroke-width="1"
            />
            <circle
              v-if="hoverIdx !== null"
              :cx="px(hoverIdx)" :cy="py(history[hoverIdx].rate)" r="4"
              fill="#e04a2c" stroke="#111113" stroke-width="2"
            />
            <circle :cx="px(history.length - 1)" :cy="py(currentRate)" r="4" fill="#e04a2c" stroke="#111113" stroke-width="2" />
            <text :x="px(history.length - 1) + 10" :y="py(currentRate) + 4" font-size="11" font-weight="600" fill="#e7e7ea">{{ currentRate.toFixed(1) }}%</text>
          </svg>
        </div>

        <!-- Failure sources -->
        <div class="rounded-xl border border-border bg-surface p-6 lg:col-span-2">
          <h2 class="font-display text-lg font-semibold tracking-tight">Where the failures came from</h2>
          <p class="mt-1 text-xs text-muted">all {{ totalBugs }} bugs, by subsystem</p>
          <div class="mt-5 space-y-4">
            <div
              v-for="s in sources"
              :key="s.name"
              class="group"
              tabindex="0"
              @mousemove="showTip($event, s.name, String(s.count) + ' bugs', ((s.count / totalBugs) * 100).toFixed(0) + '% of total')"
              @mouseleave="hideTip"
            >
              <div class="flex items-baseline justify-between text-sm">
                <span class="text-fg">{{ s.name }}</span>
                <span class="font-mono text-xs text-muted" style="font-variant-numeric: tabular-nums">{{ s.count }}</span>
              </div>
              <div class="mt-1.5 h-3 w-full rounded-r bg-elevated">
                <div
                  class="h-3 rounded-r bg-secondary-soft transition-all group-hover:brightness-125"
                  :style="{ width: (s.count / maxSource) * 100 + '%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Run grid -->
      <div class="mt-6 rounded-xl border border-border bg-surface p-6">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 class="font-display text-lg font-semibold tracking-tight">Last {{ GRID }} runs</h2>
            <p class="mt-1 text-xs text-muted">newest bottom-right · hover any cell for its seed</p>
          </div>
          <div class="flex items-center gap-4 text-xs text-muted">
            <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-accent" /> pass</span>
            <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-secondary-soft" /> fail</span>
          </div>
        </div>
        <div class="mt-4 grid gap-[3px]" style="grid-template-columns: repeat(42, minmax(0, 1fr))">
          <button
            v-for="(r, i) in runs"
            :key="r.seed + i"
            type="button"
            class="aspect-square rounded-[2px] transition-transform hover:scale-125 focus-visible:scale-125"
            :class="r.ok ? 'bg-accent/60 hover:bg-accent' : 'bg-secondary-soft'"
            :aria-label="`seed ${r.seed}: ${r.ok ? 'pass' : 'fail — ' + r.src}`"
            @mousemove="showTip($event, 'seed ' + r.seed, r.ok ? 'pass' : 'fail — ' + r.src, r.ops + 'M ops')"
            @mouseleave="hideTip"
            @focus="hideTip"
          />
        </div>
      </div>

      <p class="mt-6 text-xs text-muted">
        Illustrative data — the live feed lands with the public test harness.
        The seeds are real enough: <span class="font-mono">0xdeadbeef</span> generated this page.
      </p>
    </section>

    <!-- Shared tooltip -->
    <div
      v-if="tip.show"
      class="pointer-events-none fixed z-50 rounded-md border border-border bg-elevated px-3 py-2 shadow-xl shadow-black/50"
      :style="{ left: tip.x + 'px', top: tip.y + 'px' }"
    >
      <p class="text-sm font-semibold text-fg">{{ tip.value }}</p>
      <p class="text-xs text-muted">{{ tip.title }}<template v-if="tip.sub"> · {{ tip.sub }}</template></p>
    </div>
  </div>
</template>
