---
title: Why we built our own storage engine
date: 2026-02-04
description: On the tradeoffs that pushed us off the well-trodden path.
---

# Why we built our own storage engine

Every storage system represents a stack of tradeoffs frozen at a particular moment. The interesting question isn't whether the tradeoffs are *right* — they almost always were, on the day they were made — but whether they are *still* right today, for your workload.

This post walks through the four tradeoffs that, taken together, convinced us to build Numstore instead of bolting another layer on top of Postgres or Parquet.

## Tradeoff #1: row vs. column, per-write

Row stores amortize a single write across all of a record's fields. Column stores amortize a single write across many records' values of one field. For numerical workloads, the second one is just a better fit — and most of the well-known column stores were designed for *batch* analytics, not for write paths that have to keep up with millions of points per second.

Numstore commits at column granularity. A write to one column never invalidates buffers for another column, and our WAL is keyed by `(column, chunk)` so concurrent writers don't share contention.

## Tradeoff #2: durability via fsync vs. via replication

`fsync` is the historical answer for "is this byte safe?" It's also slow, especially on cloud volumes. The Raft-era answer is: replicate the byte to a quorum before acknowledging.

Numstore lets you pick — but the default is *both*. Replication for liveness, fsync for the WAL tail so single-node setups still survive a power loss. We give up some throughput at the head of the WAL in exchange for not needing a flowchart to explain our durability story.

## Tradeoff #3: scheme-flexibility vs. predictable layout

Databases that let you add any column at any time pay for it with indirection in their read path. For numerical workloads, schemas don't change that often, and when they do, the change is well-known ahead of time.

Numstore commits to a fixed numerical type per column at creation time. The reward is a read path that is genuinely zero-copy: `mmap` the chunk, hand the caller an `f64[]`. No deserialization, no per-element branching.

## Tradeoff #4: black-box magic vs. explicit knobs

A lot of modern databases hide their tuning behind autopilot heuristics. That works until it doesn't, and when it stops working, you don't have a steering wheel. We chose the opposite: every knob that matters is named, documented, and observable. Performance is a contract between you and the engine, not a vibe.

---

If you want the practical end of this — what it looks like in production — read [Operating Numstore at scale](/docs/installation/) and the [SmartFiles reference](/docs/smartfiles/).
