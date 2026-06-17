export const site = {
  name: 'Numstore',
  tagline: 'Numerical storage, engineered.',
  description:
    'Numstore is a numerical storage engine purpose-built for scientific, analytical, and time-series workloads.',
  github: { owner: 'numstore', repo: 'numstore' },
  youtube: { channelId: 'UC_PLACEHOLDER', handle: '@numstore' },
  linkedin: 'https://www.linkedin.com/company/numstore',
  external: {
    docs: 'https://docs.numstore.com',
    blog: 'https://blog.numstore.com',
  },
  contact: {
    email: 'hello@numstore.com',
    supportEmail: 'support@numstore.com',
  },
  products: [
    {
      id: 'smartfiles',
      name: 'SmartFiles',
      tagline: 'A self-describing on-disk format for numerical arrays.',
      blurb:
        'The columnar foundation everything else builds on. Chunked, compressed, content-addressed.',
      features: [
        'Self-describing schema with zero-copy reads',
        'Append-only chunks with content-addressed integrity',
        'Native vectorized scans across mmap or io_uring',
      ],
      accent: 'smartfiles',
      href: 'https://docs.numstore.com/smartfiles',
    },
    {
      id: 'numstore',
      name: 'Numstore',
      tagline: 'The open-source numerical storage engine.',
      blurb:
        'A single-binary database for numerical workloads, built on SmartFiles. MIT-licensed, embedded or networked.',
      features: [
        'Single-binary deploy, embedded or over the wire',
        'ACID writes with deterministic crash recovery',
        'SQL-compatible query layer with vectorized execution',
      ],
      accent: 'numstore',
      href: 'https://docs.numstore.com/numstore',
    },
    {
      id: 'enterprise',
      name: 'Numstore Enterprise',
      tagline: 'Managed Numstore for production teams.',
      blurb:
        'Multi-tenant control plane, SSO, audit logging, and 24/7 support. Run it yourself or let us run it.',
      features: [
        'Managed multi-region replication and failover',
        'SOC 2 controls, SSO/SAML, fine-grained RBAC',
        'Dedicated support engineers with SLA-backed response',
      ],
      accent: 'enterprise',
      href: 'mailto:hello@numstore.com?subject=Numstore%20Enterprise',
    },
  ],
} as const

export type SiteConfig = typeof site
export type Product = (typeof site.products)[number]
