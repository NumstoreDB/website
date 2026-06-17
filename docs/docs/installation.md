---
title: Installation
description: Supported platforms, packaging formats, and system tuning.
---

# Installation

Numstore ships as a self-contained static binary. The same binary embeds, serves over the wire, and joins replication clusters — there is no separate server distribution.

## Supported platforms

| Platform        | Architectures      | Notes                          |
| --------------- | ------------------ | ------------------------------ |
| Linux (kernel ≥ 5.10) | `x86_64`, `aarch64` | `io_uring` enabled when present |
| macOS (12+)     | `x86_64`, `aarch64` | `mmap` path; no `io_uring`    |
| Windows         | `x86_64`           | beta, file locking differences |

## Packaging

- **Static binary:** `https://get.numstore.com` (script) or release tarballs on GitHub.
- **Docker:** `numstore/numstore:{version}` and `:latest`.
- **Homebrew:** `brew install numstore/tap/numstore`.
- **APT/RPM:** signed packages at `https://pkg.numstore.com`.

## Filesystem paths

| Path                          | Purpose                                |
| ----------------------------- | -------------------------------------- |
| `<data>/wal/`                 | Write-ahead log segments               |
| `<data>/chunks/`              | Content-addressed chunk files          |
| `<data>/manifest`             | Catalog of columns, schemas, retention |
| `<data>/state/`               | Replication state, leases              |

You point Numstore at `<data>` with `--data` or the `NUMSTORE_DATA` env var.

## System tuning

For sustained high-throughput workloads, set these on Linux hosts.

```sh
# More file descriptors — Numstore opens one per active chunk.
ulimit -n 1048576

# Disable transparent hugepages — they create latency spikes in mmap workloads.
echo never > /sys/kernel/mm/transparent_hugepage/enabled

# Give Numstore a higher I/O priority.
ionice -c 2 -n 0 numstore serve --data ./data
```

> **Read more:** [Operating Numstore at scale](/blog/why-numstore/) covers production tuning in detail.
