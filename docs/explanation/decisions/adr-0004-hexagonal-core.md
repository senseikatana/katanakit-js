---
title: "ADR-0004: Hexagonal layout with a pure core"
description: Four layers — shared types, pure core services, infrastructure with I/O, framework adapters — with two documented pragmatic exceptions.
---

# ADR-0004: Hexagonal layout with a pure core

**Status:** Accepted · **Date:** 2026-09-03 (released in v2.0.0)

## Context

The toolkit runs in browsers, Node, Bun, workers and SSR build steps. When
domain logic touches `window`, `fetch` or the filesystem directly, two things
break at once: unit tests need environment stubs to test pure logic, and any
server-side import risks touching a browser API. Early versions had services
with mixed responsibilities and no rule about where I/O was allowed.

## Decision

Four layers with one direction of dependency, described in full on the
[Architecture](/guides/architecture) page:

1. `types/` — the shared kernel: every contract and domain type, single source
   of truth.
2. `core/services/` — pure logic. No `window`, `document`, `fetch`,
   filesystem or framework.
3. `infrastructure/` — the I/O owners (DOM, storage, viewport, sensors,
   observer, worker, theme, decorators), each guarded or with an SSR fallback.
4. `adapters/` — framework entry points, published on subpaths
   ([ADR-0003](/explanation/decisions/adr-0003-adapter-subpath-exports)).

Plus `config/` (site + SEO) and an optional `prisma/` layer. Two pragmatic
exceptions are documented in code rather than hidden: `http.service.ts` wraps
the global `fetch` (present in every supported runtime), and
`reactive.service.ts` persists through injected storage functions instead of
importing infrastructure. `db.ts` is the only module that reads the
environment, and it is not part of the public barrel.

## Consequences

**Better.** Core logic is testable without mocks; SSR safety is structural
because guards live at the edge; swapping implementations goes through
strategies rather than edits. A reviewer can tell where a change belongs from
one question: does it do I/O?

**Worse.** More files and indirection for small helpers. The boundary is
enforced by review discipline, not the compiler — a stray `window` reference
in `core/` would pass `tsc`. And the exceptions are load-bearing: if they stop
being documented, they will eventually be read as violations and "fixed".

## Links

- [Architecture](/guides/architecture) — layer by layer, with the pattern table.
- [Contributing contract](https://github.com/senseikatana/katanakit-js/blob/dev/CONTRIBUTING.md) — rules 1, 10 and 11.
