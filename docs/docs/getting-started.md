---
title: Getting Started
description: Install Numstore, write your first column, run a query.
---

# Getting Started

Numstore is distributed as a single static binary. There is no JVM, no daemon dependency, and no required cluster manager. You can run it embedded in your process or as a network service.

## Install

### macOS / Linux

```sh
curl -L https://get.numstore.com | sh
```

The installer drops a `numstore` binary in `~/.numstore/bin` and prints the line you should add to your shell rc file.

### Docker

```sh
docker run -p 7878:7878 -v $(pwd)/data:/data numstore/numstore:latest
```

### From source

```sh
git clone https://github.com/numstore/numstore
cd numstore
zig build -Doptimize=ReleaseFast
```

## First column

Numstore stores data as named columns. Each column has a fixed numerical type.

```sh
numstore init ./data
numstore col create cpu_util --type f64 --chunk 1m
```

Write a few values:

```sh
numstore write cpu_util --values 0.41,0.55,0.62,0.71
```

Read them back:

```sh
numstore read cpu_util --range last-1h
```

## What you just did

- `numstore init` created a SmartFiles directory at `./data`. Everything Numstore stores lives in here as content-addressed chunks.
- `numstore col create` registered a column with type `f64` and a 1-minute chunk size — meaning each on-disk chunk covers a one-minute window.
- `numstore write` appended four samples to that column's WAL, then flushed them into a new chunk.
- `numstore read` scanned matching chunks via `mmap`.

## Next

- [Installation reference](/docs/installation/) — packaging, paths, system tuning.
- [SmartFiles](/docs/smartfiles/) — the file format that backs everything.
- [Enterprise](/docs/enterprise/) — managed Numstore for teams.
