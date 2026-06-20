<script setup lang="ts">
import { computed, ref } from 'vue'

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
  wip?: boolean
  wipNote?: string
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
      {
        id: 'c',
        label: 'C',
        install: 'curl -L https://get.numstore.com/smartfiles | sh',
        code: `#include <smartfiles.h>

int main(void) {
  sf_file *f = sf_open("data.sf", SF_RDWR);

  double v = 0.41;
  sf_append(f, &v, sizeof v);

  // Insert into the middle — Smartfiles makes this fast.
  sf_insert(f, /*offset*/ 0, &v, sizeof v);

  // Strided read: every 8th double.
  double out[16];
  sf_read_strided(f, out, sizeof(double), 8 * sizeof(double), 16);

  sf_close(f);
}`,
      },
      {
        id: 'python',
        label: 'Python',
        install: 'pip install smartfiles',
        code: `import smartfiles as sf

with sf.open("data.sf", "rw") as f:
    f.append(b"\\x01\\x02\\x03\\x04")
    f.insert(offset=0, data=b"\\x00")

    # Read every 8th byte, 16 elements deep.
    chunk = f.read_strided(start=0, stride=8, count=16)
    print(f"read {len(chunk)} bytes")`,
      },
      {
        id: 'rust',
        label: 'Rust',
        install: 'cargo add smartfiles',
        code: `use smartfiles::SmartFile;

fn main() -> smartfiles::Result<()> {
    let mut f = SmartFile::open("data.sf")?;

    f.append(&[0u8, 1, 2, 3])?;
    f.insert(0, &[42])?;

    let chunk: Vec<u8> = f.read_strided(0, 8, 16)?;
    println!("read {} bytes", chunk.len());
    Ok(())
}`,
      },
      {
        id: 'go',
        label: 'Go',
        install: 'go get github.com/numstore/smartfiles-go',
        code: `package main

import (
    "fmt"
    "github.com/numstore/smartfiles-go"
)

func main() {
    f, _ := smartfiles.Open("data.sf")
    defer f.Close()

    f.Append([]byte{0, 1, 2, 3})
    f.Insert(0, []byte{42})

    chunk, _ := f.ReadStrided(0, 8, 16)
    fmt.Printf("read %d bytes\\n", len(chunk))
}`,
      },
    ],
  },
  {
    id: 'numstore',
    label: 'Numstore',
    blurb: 'The typed numerical database. Open it, declare a column, write values.',
    examples: [
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
    ],
  },
  {
    id: 'enterprise',
    label: 'Numstore Enterprise',
    blurb: 'The distributed, multi-node variant. API shape shown for orientation only.',
    wip: true,
    wipNote: 'Work in progress — estimated December 2026.',
    examples: [
      {
        id: 'c',
        label: 'C',
        install: '# preview — install path TBD',
        code: `#include <numstore_enterprise.h>

// numstore-enterprise is a work in progress.
// Shape shown for orientation only.

int main(void) {
  nse_cluster *c = nse_connect("nse://node-0,node-1,node-2");
  nse_col *col = nse_col(c, "cpu", NSE_F64);

  double values[] = { 0.41, 0.55, 0.62 };
  nse_write(col, values, 3);

  nse_close(c);
}`,
      },
      {
        id: 'python',
        label: 'Python',
        install: '# preview — install path TBD',
        code: `# numstore-enterprise is a work in progress.
# Shape shown for orientation only.

import numstore_enterprise as nse

with nse.connect("nse://node-0,node-1,node-2") as cluster:
    col = cluster.column("cpu", dtype="f64")
    col.write([0.41, 0.55, 0.62])`,
      },
      {
        id: 'rust',
        label: 'Rust',
        install: '# preview — crate name TBD',
        code: `// numstore-enterprise is a work in progress.
// Shape shown for orientation only.

use numstore_enterprise::{Cluster, Dtype};

#[tokio::main]
async fn main() -> nse::Result<()> {
    let cluster = Cluster::connect("nse://node-0,node-1,node-2").await?;
    let col = cluster.column("cpu", Dtype::F64).await?;

    col.write(&[0.41, 0.55, 0.62]).await?;
    Ok(())
}`,
      },
      {
        id: 'go',
        label: 'Go',
        install: '# preview — module path TBD',
        code: `// numstore-enterprise is a work in progress.
// Shape shown for orientation only.

package main

import "github.com/numstore/numstore-enterprise-go"

func main() {
    c, _ := nse.Connect("nse://node-0,node-1,node-2")
    defer c.Close()

    col, _ := c.Column("cpu", nse.F64)
    col.Write([]float64{0.41, 0.55, 0.62})
}`,
      },
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
</script>

<template>
  <section class="border-y border-border bg-surface/30 py-20 md:py-28">
    <div class="container-page">
      <div class="max-w-2xl">
        <div class="eyebrow">Quickstart</div>
        <h2 class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Read and write in five lines.
        </h2>
        <p class="mt-4 text-base leading-relaxed text-muted md:text-lg">
          Pick a product, pick a language. The same shape everywhere —
          open it, write some bytes or values, read them back.
        </p>
      </div>

      <div class="mt-10 overflow-hidden rounded-xl border border-border bg-bg shadow-2xl shadow-black/40">
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
            <span
              v-if="p.wip"
              class="rounded-full border border-secondary/40 bg-secondary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-secondary-soft"
            >
              WIP
            </span>
          </button>
        </div>

        <div
          v-if="currentProduct.wip"
          class="flex items-start gap-2 border-b border-border bg-secondary/5 px-4 py-3 text-xs text-secondary-soft"
          role="status"
        >
          <svg viewBox="0 0 24 24" class="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
          <span>{{ currentProduct.wipNote }} The API below is illustrative — it may change before release.</span>
        </div>

        <div
          class="flex items-center justify-between border-b border-border bg-surface/40 px-2"
          role="tablist"
          aria-label="Language"
        >
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

        <div class="grid gap-px bg-border md:grid-cols-[1fr_2fr]">
          <div class="bg-bg p-5">
            <div class="font-mono text-[10px] uppercase tracking-widest text-muted">Install</div>
            <pre class="mt-2 overflow-x-auto font-mono text-[13px] leading-relaxed text-fg"><code>{{ currentExample.install }}</code></pre>
            <p class="mt-6 text-xs leading-relaxed text-muted">{{ currentProduct.blurb }}</p>
          </div>
          <div class="bg-bg p-5">
            <div class="font-mono text-[10px] uppercase tracking-widest text-muted">Example</div>
            <pre class="mt-2 overflow-x-auto font-mono text-[13px] leading-[1.6] text-fg"><code>{{ currentExample.code }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
