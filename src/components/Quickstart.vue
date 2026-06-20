<script setup lang="ts">
import { computed, ref } from 'vue'

interface Example {
  id: string
  label: string
  install: string
  code: string
}

const examples: Example[] = [
  {
    id: 'c',
    label: 'C',
    install: 'curl -L https://get.numstore.com | sh',
    code: `#include <numstore.h>
#include <stdio.h>

int main(void) {
  numstore_db *db = numstore_open("./data");
  numstore_col *col = numstore_col(db, "cpu", NS_F64);

  double values[] = { 0.41, 0.55, 0.62, 0.71 };
  numstore_write(col, values, 4);

  double out[1024];
  size_t n = numstore_read(col, out, 1024);
  printf("read %zu values\\n", n);

  numstore_close(db);
}`,
  },
  {
    id: 'python',
    label: 'Python',
    install: 'pip install pynumstore',
    code: `import numstore as ns
import numpy as np

with ns.open("./data") as db:
    col = db.column("cpu", dtype=np.float64)
    col.write(np.array([0.41, 0.55, 0.62, 0.71]))

    values = col.read()
    print(f"read {len(values)} values")`,
  },
  {
    id: 'rust',
    label: 'Rust',
    install: 'cargo add numstore',
    code: `use numstore::{Db, Dtype};

fn main() -> numstore::Result<()> {
    let db = Db::open("./data")?;
    let col = db.column("cpu", Dtype::F64)?;

    col.write(&[0.41, 0.55, 0.62, 0.71])?;

    let values: Vec<f64> = col.read()?;
    println!("read {} values", values.len());
    Ok(())
}`,
  },
  {
    id: 'go',
    label: 'Go',
    install: 'go get github.com/numstore/numstore-go',
    code: `package main

import (
    "fmt"
    "github.com/numstore/numstore-go"
)

func main() {
    db, _ := numstore.Open("./data")
    defer db.Close()

    col, _ := db.Column("cpu", numstore.F64)
    col.Write([]float64{0.41, 0.55, 0.62, 0.71})

    values, _ := col.Read()
    fmt.Printf("read %d values\\n", len(values))
}`,
  },
]

const active = ref(examples[0].id)
const current = computed(() => examples.find((e) => e.id === active.value)!)

const copied = ref(false)
async function copyCode() {
  try {
    await navigator.clipboard.writeText(current.value.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <section class="border-y border-border bg-surface/30 py-20 md:py-28">
    <div class="container-page">
      <div class="max-w-2xl">
        <div class="eyebrow">Quickstart</div>
        <h2 class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Read and write a column in five lines.
        </h2>
        <p class="mt-4 text-base leading-relaxed text-muted md:text-lg">
          The same shape in every language — open a database, declare a typed column, write values,
          read them back.
        </p>
      </div>

      <div class="mt-10 overflow-hidden rounded-xl border border-border bg-bg shadow-2xl shadow-black/40">
        <div
          class="flex items-center justify-between border-b border-border bg-surface/60 px-2"
          role="tablist"
          aria-label="Language"
        >
          <div class="flex flex-wrap">
            <button
              v-for="ex in examples"
              :key="ex.id"
              type="button"
              role="tab"
              :id="`qs-tab-${ex.id}`"
              :aria-selected="active === ex.id"
              :aria-controls="`qs-panel-${ex.id}`"
              :tabindex="active === ex.id ? 0 : -1"
              class="relative -mb-px px-4 py-3 text-sm font-medium transition-colors min-h-[44px]"
              :class="
                active === ex.id
                  ? 'text-fg border-b-2 border-accent-soft'
                  : 'text-muted hover:text-fg border-b-2 border-transparent'
              "
              @click="active = ex.id"
            >
              {{ ex.label }}
            </button>
          </div>

          <button
            type="button"
            class="m-1 inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-muted transition-colors hover:text-fg"
            :aria-label="copied ? 'Copied' : 'Copy code'"
            @click="copyCode"
          >
            <svg v-if="!copied" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="h-3.5 w-3.5 text-accent-soft" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </div>

        <div
          :id="`qs-panel-${current.id}`"
          role="tabpanel"
          :aria-labelledby="`qs-tab-${current.id}`"
          class="grid gap-px bg-border md:grid-cols-[1fr_2fr]"
        >
          <div class="bg-bg p-5">
            <div class="font-mono text-[10px] uppercase tracking-widest text-muted">Install</div>
            <pre class="mt-2 overflow-x-auto font-mono text-[13px] leading-relaxed text-fg"><code>{{ current.install }}</code></pre>
          </div>
          <div class="bg-bg p-5">
            <div class="font-mono text-[10px] uppercase tracking-widest text-muted">Example</div>
            <pre class="mt-2 overflow-x-auto font-mono text-[13px] leading-[1.6] text-fg"><code>{{ current.code }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
