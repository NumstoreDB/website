<script setup lang="ts">
import { site } from '../config/site'
</script>

<template>
  <section class="relative overflow-hidden">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10"
    >
      <div class="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>

    <div class="container-page grid items-center gap-16 py-20 md:grid-cols-12 md:py-28 lg:py-32">
      <div class="md:col-span-7">
        <div class="eyebrow">
          <span class="h-1.5 w-1.5 rounded-full bg-secondary" />
          v0.9 — Open Beta
        </div>
        <h1 class="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl">
          Numerical storage,<br />
          <span class="text-secondary">engineered for scale.</span>
        </h1>
        <p class="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Numstore is a storage engine purpose-built for arrays of numbers — telemetry, simulations,
          quant data, sensor streams. One foundation, three products, and the speed your numbers deserve.
        </p>

        <div class="mt-10 flex flex-wrap gap-3">
          <a :href="site.external.docs" target="_blank" rel="noopener" class="btn-primary">
            Get Started
            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 10h10M11 6l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <a :href="site.external.docs" target="_blank" rel="noopener" class="btn-secondary">
            Read the Docs
          </a>
        </div>

        <dl class="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8 text-sm">
          <div>
            <dt class="text-xs uppercase tracking-widest text-muted">Throughput</dt>
            <dd class="mt-1 font-display text-xl font-semibold text-fg tabular-nums">8.4M <span class="text-xs font-normal text-muted">w/s</span></dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-widest text-muted">p99 read</dt>
            <dd class="mt-1 font-display text-xl font-semibold text-fg tabular-nums">0.4<span class="text-xs font-normal text-muted">ms</span></dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-widest text-muted">Footprint</dt>
            <dd class="mt-1 font-display text-xl font-semibold text-fg tabular-nums">~12<span class="text-xs font-normal text-muted">MB</span></dd>
          </div>
        </dl>
      </div>

      <div class="md:col-span-5">
        <div class="relative aspect-square w-full max-w-md mx-auto">
          <div class="absolute inset-0 rounded-2xl border border-border bg-surface/80 shadow-2xl shadow-black/40 backdrop-blur" />
          <svg viewBox="0 0 400 400" class="absolute inset-0 h-full w-full p-6" aria-hidden="true">
            <defs>
              <linearGradient id="hero-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#4a6cd9" stop-opacity="1" />
                <stop offset="100%" stop-color="#4a6cd9" stop-opacity="0" />
              </linearGradient>
              <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0V32" fill="none" stroke="#26262b" stroke-width="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#hero-grid)" />
            <g stroke="#4a6cd9" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 320 L70 280 L120 290 L170 200 L220 220 L270 140 L320 170 L380 80" />
            </g>
            <g fill="#4a6cd9">
              <circle cx="20" cy="320" r="3" />
              <circle cx="70" cy="280" r="3" />
              <circle cx="120" cy="290" r="3" />
              <circle cx="170" cy="200" r="3" />
              <circle cx="220" cy="220" r="3" />
              <circle cx="270" cy="140" r="3" />
              <circle cx="320" cy="170" r="3" />
            </g>
            <circle cx="380" cy="80" r="4.5" fill="#c0391b" />
            <path d="M20 320 L70 280 L120 290 L170 200 L220 220 L270 140 L320 170 L380 80 L380 380 L20 380 Z" fill="url(#hero-g)" opacity="0.35" />
            <g font-family="JetBrains Mono, monospace" font-size="9" fill="#9a9aa3">
              <text x="20" y="360">2021</text>
              <text x="180" y="360">2023</text>
              <text x="340" y="360">2025</text>
            </g>
            <g font-family="JetBrains Mono, monospace" font-size="10" fill="#e7e7ea">
              <text x="20" y="40">numstore.read("series:cpu")</text>
              <text x="20" y="56" fill="#9a9aa3">→ 8,419,302 rows · 0.41ms</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>
