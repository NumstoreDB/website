<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from '../composables/useTheme'

type Os = 'linux' | 'mac' | 'windows'

interface InstallCommands {
  linux: string
  mac: string
  windows: string
}

interface Example {
  id: string
  label: string
  install: InstallCommands
  code: string
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightBash(raw: string): string {
  return raw.split('\n').map(line => {
    // Comment line
    if (/^\s*#/.test(line)) {
      return `<span style="color:var(--sh-comment);font-style:italic">${escHtml(line)}</span>`
    }
    let out = escHtml(line)
    // Flags: -x --xyz
    out = out.replace(/((?:^|\s)(--?[\w][\w-]*))/g,
      (_, pre, flag) => pre.replace(flag, `<span style="color:var(--sh-flag)">${flag}</span>`))
    // Quoted strings
    out = out.replace(/(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g,
      m => `<span style="color:var(--sh-string)">${m}</span>`)
    // First word of line = command
    out = out.replace(/^(\s*)(\S+)/,
      (_, ws, cmd) => `${ws}<span style="color:var(--sh-cmd)">${cmd}</span>`)
    return out
  }).join('\n')
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
    id: 'numstore',
    label: 'Numstore',
    blurb: 'The typed numerical database. Open it, declare a column, write values.',
    examples: [
      {
        id: 'c',
        label: 'C',
        install: {
          linux:   'curl -L https://get.numstore.com | sh',
          mac:     'curl -L https://get.numstore.com | sh',
          windows: 'winget install numstore\n# or: scoop install numstore',
        },
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
        install: {
          linux:   'pip install pynumstore',
          mac:     'pip install pynumstore',
          windows: 'pip install pynumstore',
        },
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
        install: {
          linux:   'cargo add numstore',
          mac:     'cargo add numstore',
          windows: 'cargo add numstore',
        },
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
    id: 'numstore-pro',
    label: 'Numstore Pro',
    blurb: 'The distributed, multi-node variant. API shape shown for orientation only.',
    wip: true,
    wipNote: 'Work in progress - estimated December 2026.',
    examples: [
      {
        id: 'c',
        label: 'C',
        install: { linux: '# preview - install path TBD', mac: '# preview - install path TBD', windows: '# preview - install path TBD' },
        code: `#include <numstore_pro.h>

// numstore-pro is a work in progress.
// Shape shown for orientation only.

int main(void) {
  nsp_cluster *c = nsp_connect("nsp://node-0,node-1,node-2");
  nsp_col *col = nsp_col(c, "cpu", NSP_F64);

  double values[] = { 0.41, 0.55, 0.62 };
  nsp_write(col, values, 3);

  nsp_close(c);
}`,
      },
      {
        id: 'python',
        label: 'Python',
        install: { linux: '# preview - install path TBD', mac: '# preview - install path TBD', windows: '# preview - install path TBD' },
        code: `# numstore-pro is a work in progress.
# Shape shown for orientation only.

import numstore_pro as nsp

with nsp.connect("nsp://node-0,node-1,node-2") as cluster:
    col = cluster.column("cpu", dtype="f64")
    col.write([0.41, 0.55, 0.62])`,
      },
      {
        id: 'rust',
        label: 'Rust',
        install: { linux: '# preview - crate name TBD', mac: '# preview - crate name TBD', windows: '# preview - crate name TBD' },
        code: `// numstore-pro is a work in progress.
// Shape shown for orientation only.

use numstore_pro::{Cluster, Dtype};

#[tokio::main]
async fn main() -> nsp::Result<()> {
    let cluster = Cluster::connect("nsp://node-0,node-1,node-2").await?;
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
const activeOs = ref<Os>('linux')

const osOptions: { id: Os; label: string }[] = [
  { id: 'linux',   label: 'Linux'   },
  { id: 'mac',     label: 'Mac'     },
  { id: 'windows', label: 'Windows' },
]

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

const highlightedInstall = computed(() =>
  highlightBash(currentExample.value.install[activeOs.value]),
)

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
    // cross-origin guard (shouldn't happen - same origin)
  }
}
</script>

<template>
  <section id="quickstart" class="border-y border-border bg-surface/30 py-20 md:py-28">
    <div class="container-page">
      <div class="overflow-hidden rounded-xl border border-border bg-bg shadow-sm">
        <div
            class="flex flex-wrap items-center gap-2 border-b border-border bg-surface p-2"
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
          <span>{{ currentProduct.wipNote }} The API below is illustrative - it may change before release.</span>
        </div>

        <div
            class="border-b border-border bg-surface px-2"
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
        </div>

        <div class="grid gap-px bg-border">
          <div class="bg-bg p-5">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <span class="font-mono text-[10px] uppercase tracking-widest text-muted">Setup</span>
              <!-- OS tabs -->
              <div class="flex items-center gap-0.5 rounded-md border border-border bg-surface p-0.5">
                <button
                  v-for="os in osOptions"
                  :key="os.id"
                  type="button"
                  class="rounded px-2.5 py-1 text-xs font-medium transition-colors"
                  :class="activeOs === os.id
                    ? 'bg-bg text-fg shadow-sm'
                    : 'text-muted hover:text-fg'"
                  @click="activeOs = os.id"
                >{{ os.label }}</button>
              </div>
            </div>
            <pre class="mt-3 overflow-x-auto font-mono text-[13px] leading-[1.6]"><code v-html="highlightedInstall" /></pre>
          </div>
          <div class="bg-bg">
            <div class="flex items-center justify-between gap-3 px-5 pt-5">
              <span class="font-mono text-[10px] uppercase tracking-widest text-muted">Code</span>
              <button
                  type="button"
                  class="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-muted transition-colors hover:text-fg"
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
