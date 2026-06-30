<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from '../composables/useTheme'

// Wrap the literal `github.com/...` in our Go example imports so Vite's
// dev-time dependency scanner doesn't mistake them for real ES imports
// it should pre-bundle.
const GH = 'github.com'

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
        install: `git clone https://${GH}/NumstoreDB/Numstore
cd Numstore/src
# Edit main.c here
gcc *.c -o main
./main`,
        code: `#include <stdio.h>
#include <string.h>

// Smartfiles is a single header
#include "smartfiles.h"

static char buf[64];

int
main (void)
{
  // Open a database
  smfile_t *smf = smfile_open ("sample1_crud");
  smfile_remove (smf, NULL, 0, SMF_END);

  // Insert data at offset 0
  const char *initial = "The quick brown fox jumps over the lazy dog";
  smfile_insert (smf, initial, 0, strlen (initial));

  // Read that data (all of it)
  sb_size n = smfile_read (smf, buf, 0, SMF_END);
  printf ("after insert:  \\"%.*s\\"\\n", (int)n, buf);

  // Execute a transaction
  smfile_begin (smf);
  {
    // Insert data at offset 34
    const char *adverb = " really";
    smfile_insert (smf, adverb, 34, strlen (adverb));

    n = smfile_read (smf, buf, 0, SMF_END);
    printf ("after insert:  \\"%.*s\\"\\n", (int)n, buf);

    // Overwrite data at offset 16
    smfile_write (smf, "cat", 16, 3);

    n = smfile_read (smf, buf, 0, SMF_END);
    printf ("after write:   \\"%.*s\\"\\n", (int)n, buf);

    // Remove data starting at offset
    n = smfile_remove (smf, buf, 4, 6);
    printf ("removed:       \\"%.*s\\"\\n", (int)n, buf);

    n = smfile_read (smf, buf, 0, SMF_END);
    printf ("after remove (inside txn):  \\"%.*s\\"\\n", (int)n, buf);
  }
  smfile_rollback (smf);

  n = smfile_read (smf, buf, 0, SMF_END);
  printf ("after rollback:  \\"%.*s\\"\\n", (int)n, buf);

  return smfile_close (smf);
}`,
      },
      {
        id: 'python',
        label: 'Python',
        install: 'pip install pysmartfiles',
        code: `#!/usr/bin/env python3
import pysmartfiles as smf

with smf.open("sample1_crud") as f:
    f.remove(0, smf.END)  # start clean

    # Insert at offset 0
    f.insert(0, b"The quick brown fox jumps over the lazy dog")
    print(f"after insert:  {f.read(0, smf.END)!r}")

    with f.begin_txn() as txn:
        # Insert at offset 34
        txn.insert(34, b" really")
        print(f"after insert:  {txn.read(0, smf.END)!r}")

        # Overwrite at offset 16
        txn.write(16, b"cat")
        print(f"after write:   {txn.read(0, smf.END)!r}")

        # Remove 6 bytes starting at offset 4
        removed = txn.remove(4, 6)
        print(f"removed:       {removed!r}")
        print(f"after remove (inside txn):  {txn.read(0, smf.END)!r}")

        txn.rollback()

    print(f"after rollback:  {f.read(0, smf.END)!r}")` ,
      },
      {
        id: 'rust',
        label: 'Rust',
        install: 'cargo add smartfiles',
        code: `use smartfiles::{SmartFile, END};

fn main() -> smartfiles::Result<()> {
    let mut f = SmartFile::open("sample1_crud")?;
    f.remove(0, END)?;

    // Insert at offset 0
    f.insert(0, b"The quick brown fox jumps over the lazy dog")?;
    println!("after insert:  {:?}", f.read(0, END)?);

    {
        let mut txn = f.begin_txn()?;

        // Insert at offset 34
        txn.insert(34, b" really")?;
        println!("after insert:  {:?}", txn.read(0, END)?);

        // Overwrite at offset 16
        txn.write(16, b"cat")?;
        println!("after write:   {:?}", txn.read(0, END)?);

        // Remove 6 bytes starting at offset 4
        let removed = txn.remove(4, 6)?;
        println!("removed:       {:?}", removed);
        println!("after remove (inside txn):  {:?}", txn.read(0, END)?);

        txn.rollback()?;
    }

    println!("after rollback:  {:?}", f.read(0, END)?);
    Ok(())
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
        code: `#include <stdint.h>
#include <stdio.h>
#include <assert.h>

#include "numstore.h"

// A packed in memory representation of data
struct example
{
  float   a;
  int32_t b[5][10];
} __attribute__ ((packed));

static struct example src[200], dest[200];
static void print_example (const char *label, struct example *ex, int n);

int
main (void)
{
  // Initialize some data
  for (int i = 0; i < 200; i++)
  {
    src[i].a = i;
    for (int r = 0; r < 5; r++)
    {
      for (int c = 0; c < 10; c++)
      {
        src[i].b[r][c] = i + r * 10 + c;
      }
    }
  }

  // Open up a database
  nsdb_t *ns = nsdb_open ("sample1_crud");

  // Create a typed variable
  nsdb_execute (ns, "delete if exists example", NULL);
  nsdb_execute (ns, "create example struct { a f32, b [5][10] i32 }", NULL);

  // Insert 200 elements of seed data at offset 0
  int n = nsdb_execute (ns, "insert example 0 %d", src, 200);

  // Begin a transaction - mutations rolled back at the end
  nsdb_begin (ns);
  {
    // Read every 3rd element
    n = nsdb_execute (ns, "read example[0::3]", dest);
    print_example ("Every 3rd element", dest, n);

    // Remove every 2nd element up to len - 10
    n = nsdb_execute (ns, "remove example[0:-10:2]", dest);
    print_example ("Removed Elements [0:-10:2]", dest, n);

    // Overwrite every 2nd element with src
    nsdb_execute (ns, "write example[1::2]", src);

    // Read all
    n = nsdb_execute (ns, "read example[0:]", dest);
    print_example ("Data After Write [1::2]", dest, n);
  }
  nsdb_rollback (ns);

  // Read all after rollback
  n = nsdb_execute (ns, "read example[0:]", dest);
  print_example ("Data After Rollback", dest, n);

  return nsdb_close (ns);
}

static void
print_example (const char *label, struct example *ex, int n)
{
  assert(n >= 3);
  printf ("%s (%d):\\n", label, n);
  for (int i = 0; i < 3; i++)
  {
    printf (
        "  [%d] a=%g  b=[[%d, %d ...], [%d, %d ...], ...]\\n",
        i,
        ex[i].a,
        ex[i].b[0][0],
        ex[i].b[0][1],
        ex[i].b[1][0],
        ex[i].b[1][1]
    );
  }

  printf ("  ... (%d more)\\n", n - 3);
}`,
      },
      {
        id: 'python',
        label: 'Python',
        install: 'pip install pynumstore',
        code: `#!/usr/bin/env python3
import numpy as np
import pynumstore as ns

example_dtype = np.dtype([
    ('a', np.float32),
    ('b', np.int32, (5, 10)),
])

# Initialize seed data
src = np.zeros(200, dtype=example_dtype)
src['a'] = np.arange(200, dtype=np.float32)
i = np.arange(200)[:, None, None]
r = np.arange(5)[None, :, None]
c = np.arange(10)[None, None, :]
src['b'] = i + r * 10 + c

with ns.open("sample1_crud") as db:
    db.execute("delete if exists example")
    db.execute("create example struct { a f32, b [5][10] i32 }")
    db.execute(f"insert example 0 {len(src)}", data=src)

    with db.begin_txn() as txn:
        # Read every 3rd element
        print(txn.execute("read example[0::3]"))

        # Remove every 2nd element up to len - 10
        print(txn.execute("remove example[0:-10:2]"))

        # Overwrite every 2nd element with src
        txn.execute("write example[1::2]", data=src)
        print(txn.execute("read example[0:]"))

        txn.rollback()

    # Read all after rollback
    print(db.execute("read example[0:]"))`,
      },
      {
        id: 'rust',
        label: 'Rust',
        install: 'cargo add numstore',
        code: `use numstore::Database;

// Packed struct - matches: struct { a f32, b [5][10] i32 }
#[repr(C, packed)]
#[derive(Clone, Copy, Debug)]
struct Example {
    a: f32,
    b: [[i32; 10]; 5],
}

fn main() -> numstore::Result<()> {
    // Initialize seed data
    let mut src = [Example { a: 0.0, b: [[0; 10]; 5] }; 200];
    for i in 0..200 {
        src[i].a = i as f32;
        for r in 0..5 {
            for c in 0..10 {
                src[i].b[r][c] = (i + r * 10 + c) as i32;
            }
        }
    }

    let mut db = Database::open("sample1_crud")?;
    db.execute("delete if exists example", None)?;
    db.execute("create example struct { a f32, b [5][10] i32 }", None)?;
    db.execute(&format!("insert example 0 {}", src.len()), Some(&src))?;

    {
        let mut txn = db.begin_txn()?;

        // Read every 3rd element
        println!("{:?}", txn.execute::<Example>("read example[0::3]", None)?);

        // Remove every 2nd element up to len - 10
        println!("{:?}", txn.execute::<Example>("remove example[0:-10:2]", None)?);

        // Overwrite every 2nd element with src
        txn.execute("write example[1::2]", Some(&src))?;
        println!("{:?}", txn.execute::<Example>("read example[0:]", None)?);

        txn.rollback()?;
    }

    // Read all after rollback
    println!("{:?}", db.execute::<Example>("read example[0:]", None)?);
    Ok(())
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

// ── Vim HTML code panels ──────────────────────────────────────
const { isDark } = useTheme()

const codeFrameSrc = computed(() => {
  const theme = isDark.value ? 'dark' : 'light'
  // Files live in public/code/{lang}-quickstart-{product}-{theme}.html
  return `/code/${currentExample.value.id}-quickstart-${currentProduct.value.id}-${theme}.html`
})

function resizeIframe(e: Event) {
  const iframe = e.target as HTMLIFrameElement
  try {
    const h = iframe.contentDocument?.body?.scrollHeight
    if (h) iframe.style.height = h + 'px'
  } catch {
    // cross-origin guard (shouldn't happen — same origin)
  }
}
</script>

<template>
  <section id="quickstart" class="border-y border-border bg-surface/30 py-20 md:py-28">
    <div class="container-page">
      <!-- Code widget is always dark regardless of page theme -->
      <div class="overflow-hidden rounded-xl border border-[#26262b] bg-[#0a0a0a] shadow-2xl shadow-black/40">
        <div
            class="flex flex-wrap items-center gap-2 border-b border-[#26262b] bg-[#111113] p-2"
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
                ? 'bg-[#0a0a0a] text-[#e7e7ea] border border-[#26262b]'
                : 'text-[#9a9aa3] hover:text-[#e7e7ea] border border-transparent'
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
            class="flex items-start gap-2 border-b border-[#26262b] bg-secondary/5 px-4 py-3 text-xs text-secondary-soft"
            role="status"
        >
          <svg viewBox="0 0 24 24" class="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
          <span>{{ currentProduct.wipNote }} The API below is illustrative — it may change before release.</span>
        </div>

        <div
            class="border-b border-[#26262b] bg-[#111113] px-2"
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
                  ? 'text-[#e7e7ea] border-b-2 border-accent-soft'
                  : 'text-[#9a9aa3] hover:text-[#e7e7ea] border-b-2 border-transparent'
              "
                @click="activeLang = ex.id"
            >
              {{ ex.label }}
            </button>
          </div>
        </div>

        <div class="grid gap-px bg-[#26262b]">
          <div class="bg-[#0a0a0a] p-5">
            <div class="flex items-baseline justify-between gap-3">
              <span class="font-mono text-[10px] uppercase tracking-widest text-[#9a9aa3]">Setup</span>
              <span class="text-xs leading-relaxed text-[#9a9aa3]">{{ currentProduct.blurb }}</span>
            </div>
            <pre class="mt-2 overflow-x-auto font-mono text-[13px] leading-[1.6] text-[#e7e7ea]">{{ currentExample.install }}</pre>
          </div>
          <div class="bg-[#0a0a0a]">
            <div class="flex items-center justify-between gap-3 px-5 pt-5">
              <span class="font-mono text-[10px] uppercase tracking-widest text-[#9a9aa3]">Code</span>
              <button
                  type="button"
                  class="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#26262b] bg-[#111113] px-2.5 text-xs font-medium text-[#9a9aa3] transition-colors hover:text-[#e7e7ea]"
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
            <!-- Vim colorscheme HTML: edit public/code/{product}-{lang}-{light|dark}.html -->
            <iframe
              :key="codeFrameSrc"
              :src="codeFrameSrc"
              class="block w-full border-0"
              style="height: 200px"
              scrolling="no"
              title="Code example"
              @load="resizeIframe"
            />
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
