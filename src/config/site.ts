export const site = {
  name: 'Numstore',
  tagline: 'Numerical storage, engineered.',
  description:
    'Numstore is a numerical storage engine purpose-built for scientific, analytical, and time-series workloads.',
  github: { owner: 'NumstoreDB', repo: 'Numstore' },
  youtube: { channelId: 'UC_PLACEHOLDER', handle: '@numstore' },
  linkedin: 'https://www.linkedin.com/company/numstore',
  external: {
    docs: 'https://numstore.org',
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
      tagline: 'An ACID file with first class support for inner mutations',
      blurb:
        'Smartfiles is an ACID file - meaning it\'s identical to a normal file, but you can pull the plug on your computer and any query to read, write, insert or remove data either finished or didn\'t, there are no half-writes. Also, Smartfiles dwarfs the speed of normal files for inserting or removing data into the middle of the file, something text editors, video editors, datasets all often require' ,
      features: [
        'Store multiple named variables with-in one "smart" file',
        'Read, write or remove "stride-ed" data - skipping every nth byte',
        'Zero dependencies - builds into linux mac and windows machine code',
      ],
      accent: 'smartfiles',
      href: 'https://docs.numstore.com/smartfiles',
    },
    {
      id: 'numstore',
      name: 'Numstore',
      tagline: 'An ACID database for storing numerical arrays',
      blurb:
        'Numstore is a database for numerical arrays. numpy, pytorch, tensorflow numerical arrays, Numstore stores this type of data with the same guarantees of inner mutations as Smartfiles. Numstore is Smartfiles with a rich type system built on top',
      features: [
        'Store ints, floats, complex numbers, arrays of primitive types, structs, unions in a single file database',
        'Read, write or remove "stride-ed" data - skipping every nth byte',
        'Zero dependencies - builds into linux mac and windows machine code',
        'PyNumstore - a numstore python binding that offers an ACID storage engine for numpy arrays',
      ],
      accent: 'numstore',
      href: 'https://docs.numstore.com/numstore',
    },
    {
      id: 'enterprise',
      name: 'Numstore Enterprise',
      tagline: 'Managed Numstore for production teams.',
      blurb:
        'I took all the lessons I learned from Numstore and Smartfiles and re wrote an industry performant distributed, multi file database called Numstore-Enterprise',
      features: [
        'Supports the "just bytes" formulation that smartfiles does so well',
        'Distributed enterprise ready database',
        'Multi file',
        'Multi node',
        'Memory safe - written in rust with all the mistakes made in Numstore and Smartfiles remediated',
        'Unreleased - stay tuned - estimated date: December 2026',
      ],
      accent: 'enterprise',
      href: 'mailto:hello@numstore.com?subject=Numstore%20Enterprise',
    },
  ],
} as const

export type SiteConfig = typeof site
export type Product = (typeof site.products)[number]
