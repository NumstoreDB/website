---
title: SmartFiles
description: The on-disk numerical file format that backs Numstore.
---

# SmartFiles

SmartFiles is the on-disk file format Numstore is built on. It is intentionally small in scope: store typed arrays of numbers, chunked, content-addressed, with checksums you can trust.

![SmartFiles layout](/assets/architecture.svg)

## Design goals

1. **Zero-copy reads.** A read should `mmap` a chunk and hand the caller a typed slice. No deserialization, no per-record overhead.
2. **Content-addressed integrity.** Every chunk's name is a hash of its bytes. Replication, caching, and bitrot detection fall out for free.
3. **Append-only.** Writers never overwrite. Compaction produces new chunks; old chunks become eligible for GC once no reader holds them.

## On-disk layout

```
data/
  chunks/
    f2/3a/f23a8c…b1.chunk
    f2/3a/f23a8c…b1.idx
  wal/
    000000123.wal
  manifest
```

A chunk file is laid out as:

| Offset | Length | Field                |
| ------ | ------ | -------------------- |
| 0      | 16     | Magic + version      |
| 16     | 8      | Element count        |
| 24     | 4      | Element type tag     |
| 28     | 4      | Reserved             |
| 32     | N × T  | Element payload      |
| ...    | 32     | BLAKE3 of all above  |

The `.idx` companion file holds a sparse index — one (timestamp, byte-offset) pair every 4096 elements — so range scans skip straight to the right region without scanning the chunk header.

## Why a new format?

> Parquet and Arrow are excellent for analytics, but they were designed for batch interchange. Numstore's read path is dominated by *append-and-scan* workloads where a million small writes per second is the floor.

SmartFiles drops features we don't need (nested types, dictionaries, run-length encoding for strings) and keeps the ones that matter for numerical workloads: fixed-width types, predictable layout, and a checksum every reader actually verifies.

See the blog post on [why we built our own format](/blog/why-numstore/) for the long version.
