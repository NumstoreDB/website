// The /dst_status API contract, plus a mock implementation.
//
// Real backend: GET /dst_status?start_date=<iso>&end_date=<iso>&nelems=<n>
// All aggregation happens server-side — the UI renders this response as-is.
// To go live, replace the body of fetchDstStatus with a fetch() of that URL.
//
// NOTE for the server: an evenly-spread poll sample can drop red (crash)
// polls, which are the rarest and most important records. The mock always
// keeps reds when downsampling; the real endpoint should do the same.

export type PollStatus = 'green' | 'red'

// One raw poll record, exactly as the DST process reports it.
export interface DstPoll {
  ts: number // poll timestamp, ms epoch
  runId: string
  slot: number // process slot, 0..4
  pid: number
  seed: string
  gitTag: string
  commit: string
  runStart: number // start time of this run, ms epoch
  uptimeS: number // how long the run had been alive at this poll
  dbBytes: number // database size at this poll
  status: PollStatus // green = regular poll, red = crash poll
  callStack?: string[] // present on red polls only
  pollSeq: number // per-run sequence number
  nParams: number // size of the DST parameter csv (values not fetched here)
}

// Current state of one process slot (latest poll, server-resolved).
export interface FleetProc {
  slot: number
  runId: string
  pid: number
  seed: string
  gitTag: string
  commit: string
  start: number
  lastPollTs: number
  status: PollStatus
  dbBytes: number
  pollSeq: number
}

// One run collapsed to a segment, for the timeline.
export type EndReason = 'crash' | 'evicted' | 'running'
export interface RunSummary {
  runId: string
  slot: number
  gitTag: string
  commit: string
  seed: string
  start: number
  end: number
  endReason: EndReason
}

// One crash (red poll), fully expanded for the crash log.
export interface CrashRecord {
  ts: number
  runId: string
  slot: number
  pid: number
  seed: string
  gitTag: string
  commit: string
  start: number
  uptimeS: number
  dbBytes: number
  pollSeq: number
  callStack: string[]
  nParams: number
}

// A run "fails" when it ends in a crash; it "succeeds" when a new git tag
// evicts it before it ever crashed.
export interface WeekCounts {
  completed: number
  succeeded: number
  failed: number
  failureRatePct: number
}

export interface DstStats {
  runsCompleted: number
  simUptimeYears: number // simulated (time-compressed) uptime
  bugsCaught: number // distinct root causes found & fixed
  failureRate7d: { ts: number; rate: number }[] // daily, trailing 7 days
  thisWeek: WeekCounts
  lastWeek: WeekCounts
  weekDelta: { completed: number; succeeded: number; failed: number; ratePts: number }
}

export interface DstStatusResponse {
  stats: DstStats
  fleet: FleetProc[] // sorted by run start time, longest-lived first
  runs: RunSummary[] // runs overlapping [start_date, end_date]
  crashes: CrashRecord[] // newest first, within the range
  polls: DstPoll[] // raw polls, spread evenly (nelems), reds always kept
}

export const SLOTS = 5

// ---------------------------------------------------------------------------
// Mock world. Deterministic (fixed PRNG seed) so every load and every date
// range agree with each other.
//
// Cadence: processes run continuously; a run ends when it crashes (mean
// time-to-crash ~1 hour) or when a new git tag lands (1–2 per day) and
// round-robin evicts the slot running the oldest build.
// ---------------------------------------------------------------------------

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

const HOUR = 3_600_000
const DAY = 24 * HOUR
const POLL_EVERY = 5 * 60_000 // poll cadence (N = 300 s)
const WORLD_DAYS = 32
const N_PARAMS = 104

const STACKS: string[][] = [
  [
    'ns_assert_fail (invariant: "lsn <= wal->flushed_lsn")',
    'ns_wal_replay + 0x2f4',
    'ns_recover + 0x88',
    'ns_db_open + 0x1c1',
    'dst_boot_after_crash + 0x33',
    'main + 0x92',
  ],
  [
    'ns_assert_fail (invariant: "node->nkeys <= NS_MAX_KEYS")',
    'ns_rope_rebalance + 0x1c4',
    'ns_rope_insert + 0x3b0',
    'ns_exec_insert + 0x77',
    'dst_apply_op + 0x41',
    'main + 0x92',
  ],
  [
    'ns_assert_fail (invariant: "page checksum mismatch, pgno=4181")',
    'ns_page_read + 0x9c',
    'ns_bpool_fetch + 0x120',
    'ns_rope_lookup + 0x64',
    'dst_apply_op + 0x41',
    'main + 0x92',
  ],
  [
    'ns_panic ("torn write detected past fsync barrier")',
    'ns_fsync_barrier + 0x12',
    'ns_wal_append + 0x88',
    'ns_txn_commit + 0x150',
    'dst_apply_op + 0x41',
    'main + 0x92',
  ],
  [
    'ns_assert_fail (invariant: "freelist page double-alloc, pgno=772")',
    'ns_page_alloc + 0x40',
    'ns_rope_split + 0x2a8',
    'ns_exec_insert + 0x77',
    'dst_apply_op + 0x41',
    'main + 0x92',
  ],
  [
    'ns_assert_fail (invariant: "evicted page still pinned")',
    'ns_bpool_evict + 0x5c',
    'ns_bpool_fetch + 0x120',
    'ns_exec_read + 0x39',
    'dst_apply_op + 0x41',
    'main + 0x92',
  ],
]

interface SimRun {
  runId: string
  slot: number
  pid: number
  seed: string
  gitTag: string
  commit: string
  start: number
  end: number // crash time, evict time, or "now"
  endReason: EndReason
  stack: string[]
  finalDb: number
  finalSeq: number
  polls: DstPoll[]
}

interface World {
  now: number
  runs: SimRun[]
  stats: DstStats
}

let cache: World | null = null

function simulate(now: number): World {
  const rand = mulberry32(0x9e3779b9)
  const t0 = now - WORLD_DAYS * DAY

  const hex = (n: number) => {
    let s = ''
    for (let i = 0; i < n; i++) s += Math.floor(rand() * 16).toString(16)
    return s
  }

  // Git tags: 1–2 per day, round-robin over the 5 slots.
  const releases: { tag: string; commit: string; at: number; idx: number }[] = []
  let patch = 40
  for (let t = t0; t < now; t += (12 + rand() * 12) * HOUR) {
    releases.push({ tag: 'v1.1.' + patch++, commit: hex(7), at: t, idx: releases.length })
  }

  const runs: SimRun[] = []
  let runCounter = 4096

  for (let slot = 0; slot < SLOTS; slot++) {
    const evictions = releases.filter((r) => r.idx % SLOTS === slot)
    let tag = releases[0]
    let t = t0
    while (t < now) {
      const nextEvict = evictions.find((e) => e.at > t)
      const evictAt = nextEvict ? nextEvict.at : Infinity
      // Mean time-to-crash ~1 h early on, climbing as builds improve.
      const prog = (tag.at - t0) / (now - t0)
      const meanH = 0.8 + 4.5 * prog * prog
      const crashAt = t + Math.max(4 * 60_000, -Math.log(1 - rand()) * meanH * HOUR)
      const end = Math.min(crashAt, evictAt, now)
      const endReason: EndReason = end === now ? 'running' : end === crashAt ? 'crash' : 'evicted'

      const run: SimRun = {
        runId: 'run-' + (runCounter++).toString(36),
        slot,
        pid: 30000 + Math.floor(rand() * 20000),
        seed: '0x' + hex(16),
        gitTag: tag.tag,
        commit: tag.commit,
        start: t,
        end,
        endReason,
        stack: STACKS[Math.floor(rand() * rand() * STACKS.length)],
        finalDb: 0,
        finalSeq: 0,
        polls: [],
      }

      const growth = (0.8 + rand() * 2.2) * 1_048_576
      let db = (3 + rand() * 6) * 1_048_576
      let seq = 0
      const mk = (ts: number, status: PollStatus): DstPoll => ({
        ts,
        runId: run.runId,
        slot,
        pid: run.pid,
        seed: run.seed,
        gitTag: run.gitTag,
        commit: run.commit,
        runStart: run.start,
        uptimeS: Math.round((ts - run.start) / 1000),
        dbBytes: Math.round(db),
        status,
        callStack: status === 'red' ? run.stack : undefined,
        pollSeq: seq++,
        nParams: N_PARAMS,
      })
      for (let ts = run.start; ts < run.end; ts += POLL_EVERY) {
        db += growth * (0.6 + rand() * 0.8)
        run.polls.push(mk(ts, 'green'))
      }
      if (endReason === 'crash') run.polls.push(mk(run.end, 'red'))
      run.finalDb = Math.round(db)
      run.finalSeq = seq - 1
      runs.push(run)

      if (end === evictAt && nextEvict) tag = nextEvict
      t = end
    }
  }

  // ---- server-side aggregates ----
  const statsRand = mulberry32(0xc0ffee)
  const week = (lo: number, hi: number): WeekCounts => {
    const w = { completed: 0, succeeded: 0, failed: 0, failureRatePct: 0 }
    for (const r of runs) {
      if (r.endReason === 'running' || r.end <= lo || r.end > hi) continue
      w.completed++
      if (r.endReason === 'crash') w.failed++
      else w.succeeded++
    }
    w.failureRatePct = w.completed ? +((100 * w.failed) / w.completed).toFixed(1) : 0
    return w
  }
  const thisWeek = week(now - 7 * DAY, now)
  const lastWeek = week(now - 14 * DAY, now - 7 * DAY)
  const failureRate7d = Array.from({ length: 7 }, (_, i) => {
    const hi = now - (6 - i) * DAY
    const w = week(hi - DAY, hi)
    return { ts: hi, rate: w.failureRatePct + (statsRand() - 0.5) * 0.4 }
  })

  const stats: DstStats = {
    runsCompleted: 148_312 + runs.length,
    simUptimeYears: 217.4,
    bugsCaught: 116,
    failureRate7d,
    thisWeek,
    lastWeek,
    weekDelta: {
      completed: thisWeek.completed - lastWeek.completed,
      succeeded: thisWeek.succeeded - lastWeek.succeeded,
      failed: thisWeek.failed - lastWeek.failed,
      ratePts: +(thisWeek.failureRatePct - lastWeek.failureRatePct).toFixed(1),
    },
  }

  return { now, runs, stats }
}

export async function fetchDstStatus(
  startDate: Date,
  endDate: Date,
  nelems: number,
): Promise<DstStatusResponse> {
  const now = Date.now()
  // Regenerate at most once a minute so "now" stays fresh but ranges agree.
  if (!cache || now - cache.now > 60_000) cache = simulate(now)
  const world = cache

  const s = startDate.getTime()
  const e = endDate.getTime()

  // Fleet: latest run per slot, sorted by start time (longest-lived first).
  const bySlot = new Map<number, SimRun>()
  for (const r of world.runs) {
    const cur = bySlot.get(r.slot)
    if (!cur || r.end > cur.end) bySlot.set(r.slot, r)
  }
  const fleet: FleetProc[] = [...bySlot.values()]
    .map((r) => {
      const last = r.polls[r.polls.length - 1]
      return {
        slot: r.slot,
        runId: r.runId,
        pid: r.pid,
        seed: r.seed,
        gitTag: r.gitTag,
        commit: r.commit,
        start: r.start,
        lastPollTs: last?.ts ?? r.start,
        status: (r.endReason === 'crash' ? 'red' : 'green') as PollStatus,
        dbBytes: r.finalDb,
        pollSeq: r.finalSeq,
      }
    })
    .sort((a, b) => a.start - b.start)

  const inRange = world.runs.filter((r) => r.end >= s && r.start <= e)
  const runs: RunSummary[] = inRange.map((r) => ({
    runId: r.runId,
    slot: r.slot,
    gitTag: r.gitTag,
    commit: r.commit,
    seed: r.seed,
    start: r.start,
    end: r.end,
    endReason: r.endReason,
  }))

  const crashes: CrashRecord[] = inRange
    .filter((r) => r.endReason === 'crash' && r.end >= s && r.end <= e)
    .sort((a, b) => b.end - a.end)
    .map((r) => ({
      ts: r.end,
      runId: r.runId,
      slot: r.slot,
      pid: r.pid,
      seed: r.seed,
      gitTag: r.gitTag,
      commit: r.commit,
      start: r.start,
      uptimeS: Math.round((r.end - r.start) / 1000),
      dbBytes: r.finalDb,
      pollSeq: r.finalSeq,
      callStack: r.stack,
      nParams: N_PARAMS,
    }))

  // Raw polls, spread evenly across the range; red polls are always kept.
  const all = inRange
    .flatMap((r) => r.polls)
    .filter((p) => p.ts >= s && p.ts <= e)
    .sort((a, b) => a.ts - b.ts)
  let polls = all
  if (all.length > nelems) {
    const reds = all.filter((p) => p.status === 'red')
    const greens = all.filter((p) => p.status === 'green')
    const keep = Math.max(1, nelems - reds.length)
    const step = greens.length / keep
    const sampled: DstPoll[] = []
    for (let i = 0; i < keep; i++) sampled.push(greens[Math.floor(i * step)])
    polls = [...sampled, ...reds].sort((a, b) => a.ts - b.ts)
  }

  await new Promise((r) => setTimeout(r, 120)) // pretend to be a network
  return { stats: world.stats, fleet, runs, crashes, polls }
}
