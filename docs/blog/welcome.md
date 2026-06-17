---
title: Hello from Numstore
date: 2026-03-12
description: We are launching the Numstore project publicly.
---

# Hello from Numstore

After two years of internal use, we are launching Numstore publicly today. This post is the short version of why we built it, who we built it for, and where we go from here.

## Why now

Numerical workloads — telemetry, sensor streams, simulation output, market data — have outgrown the row-oriented databases that most engineering teams reach for. The "obvious" alternatives are either built for analytical batch (Parquet on object storage) or for ops monitoring (TSDBs with cardinality ceilings that bite at the worst possible moment).

We wanted something in between: a storage engine that treats *arrays of numbers* as a first-class primitive, scales to billions of rows per column per day on commodity hardware, and never makes you choose between durability and throughput.

## What's in the box today

- **Numstore 1.0** — the open-source engine. MIT-licensed. Single binary.
- **SmartFiles 1.0** — the on-disk format, also open-source, also small.
- **Numstore Enterprise** — the managed tier, available now in private preview.

Head over to [Getting Started](/docs/getting-started/) to install it.

## What's next

The next quarter is about hardening: more replication topologies, better automatic compaction, and shipping the formal model we use internally so anyone can validate it.

Thanks for reading.
