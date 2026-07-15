export const site = {
  name: 'Numstore',
  description: 'A database engine purpose-built for bytes and arrays.',
  github: { owner: 'NumstoreDB', repo: 'Numstore' },
  contact: {
    email: 'lincketheo.dev@gmail.com',
  },
  external: {
    docs:     'https://docs.numstore.org',
    blog:     'https://theolincke.com',
    github:   'https://github.com/NumstoreDB/Numstore',
    youtube:  'https://www.youtube.com/@numstore',
    x:        'https://x.com/lincke_the7232',
    linkedin: 'https://www.linkedin.com/in/Theo-Lincke',
  },
  products: [
    {
      id: 'numstore',
      name: 'Numstore',
      tagline: 'An ACID database for numerical arrays',
      blurb:
        'Numstore is an ACID file format with a typed column system built in. Every read, write, insert, and remove commits in full or not at all, and inner mutations (inserting or removing in the middle of a file) run in O(log n) instead of O(n). Store integers, floats, and multi-dimensional arrays under the same guarantees.',
      features: [
        'Typed columns: f32, f64, i32, i64, complex, structs',
        'Strided slice queries: read example[0:-10:2]',
        'NumPy / PyTorch array round-trip via PyNumstore',
      ],
      accent: 'numstore',
      href: 'https://docs.numstore.com/',
    },
    {
      id: 'numstore-pro',
      name: 'Numstore Pro',
      tagline: 'Distributed, multi-node — estimated December 2026',
      blurb:
        'A ground-up rewrite in Rust that incorporates every lesson learned from Numstore: memory-safe, multi-file, multi-node, and built for production scale.',
      features: [
        'Multi-node distributed storage',
        'Written in Rust for memory safety',
        'Multi-file, horizontal scale-out',
        'Unreleased — estimated December 2026',
      ],
      accent: 'numstore-pro',
      href: '#contact',
    },
  ],
} as const

export type SiteConfig = typeof site
export type Product = (typeof site.products)[number]
