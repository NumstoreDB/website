export const site = {
  name: 'Numstore',
  description: 'A database engine purpose-built for bytes and arrays.',
  github: { owner: 'NumstoreDB', repo: 'Numstore' },
  contact: {
    email: 'hello@numstore.com',
  },
  external: {
    docs:     'https://docs.numstore.org',
    blog:     'https://theolincke.com',
    github:   'https://github.com/NumstoreDB/Numstore',
    youtube:  'https://www.youtube.com/@numstore',
    x:        'https://x.com/numstore',
    discord:  'https://discord.gg/numstore',
    linkedin: 'https://www.linkedin.com/company/numstore',
  },
  products: [
    {
      id: 'smartfiles',
      name: 'SmartFiles',
      tagline: 'An ACID file with first class support for inner mutations',
      blurb:
        'Smartfiles is an ACID file — identical to a normal file, but guaranteed: any read, write, insert or remove either completes or doesn\'t. Inner mutations (inserting/removing in the middle of a file) run in O(log n) instead of O(n).',
      features: [
        'Named variables within a single file',
        'Strided reads and writes — skip every nth byte',
        'Zero dependencies — C, Python, Rust bindings',
      ],
      accent: 'smartfiles',
      href: 'https://docs.numstore.com/smartfiles',
    },
    {
      id: 'numstore',
      name: 'Numstore',
      tagline: 'An ACID database for numerical arrays',
      blurb:
        'Numstore is SmartFiles with a typed column system on top. Store ints, floats, and multi-dimensional arrays with the same ACID guarantees and O(log n) inner-mutation performance.',
      features: [
        'Typed columns: f32, f64, i32, i64, complex, structs',
        'Strided slice queries: read example[0:-10:2]',
        'NumPy / PyTorch array round-trip via PyNumstore',
      ],
      accent: 'numstore',
      href: 'https://docs.numstore.com/numstore',
    },
    {
      id: 'enterprise',
      name: 'Numstore Enterprise',
      tagline: 'Distributed, multi-node — estimated December 2026',
      blurb:
        'A rewrite in Rust taking every lesson from SmartFiles and Numstore: memory-safe, multi-file, multi-node, built for production scale.',
      features: [
        'Multi-node distributed storage',
        'Written in Rust — no memory safety issues',
        'Multi-file, horizontal scale-out',
        'Unreleased — estimated December 2026',
      ],
      accent: 'enterprise',
      href: '#waitlist',
    },
  ],
} as const

export type SiteConfig = typeof site
export type Product = (typeof site.products)[number]
