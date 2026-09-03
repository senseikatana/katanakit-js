# Contributing to KatanaKit

Thank you for considering contributing! This document describes the architecture,
the conventions and the development workflow so you can jump in quickly.

## The development contract

These rules keep the codebase consistent and maintainable:

1. **Hexagonal layering** — keep the pure `core` layer free of browser/runtime I/O.
   Adapters (DOM, storage, sensors, worker, HTTP, Express, Astro) live in
   `infrastructure/` or `adapters/`. New capabilities go in the layer that matches
   their responsibility.
2. **Design patterns** — services are implemented as Singleton facades with
   Strategy/Observer/Factory/Decorator where it makes sense. Preserve the pattern
   when extending a service.
3. **`use*` convention** — every public method (except `getInstance`) uses the
   `use` prefix (like React hooks). This makes the API consistent and predictable.
4. **Destructured exports** — every service exposes its methods as arrow functions
   and re-exports them destructured (e.g. `useLog`, `useGetStorage`, `useFetch`)
   so consumers can tree-shake and call them without binding `this`.
5. **`@/` path alias** — internal imports use the `@/` alias (mapped to `src/`).
   The public API is exposed through barrel files (`index.ts`).
6. **Single source of truth** — all contracts and types live in `src/types/`.
7. **English only** — comments, identifiers and user-facing messages are written
   in English.
8. **No side effects on import** — importing a module must never trigger network
   calls, timers, storage writes or DOM mutations. Demos and examples live under
   `examples/`.
9. **SSR safety** — browser-only adapters must guard or fall back gracefully when
   `window` is unavailable (Node.js/Bun SSR).
10. **Tests** — add or update a test under `tests/` for every new feature or bug fix.

## Getting started

```bash
# Prerequisites: Node.js >= 20 or Bun >= 1.0
git clone https://github.com/senseikatana/katanakit.git
cd katanakit
bun install
```

Useful scripts:

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `bun run typecheck`  | Type-check the project (`tsc --noEmit`)  |
| `bun run build`      | Build to `dist/` (declarations + ESM)    |
| `bun run test`       | Run the Vitest suite                     |
| `bun run check`      | Lint and format with Biome               |
| `bun run check:fix`  | Auto-fix lint and format issues          |
| `bun run dev`        | Start the Express example server         |

## Directory layout

- `src/types/` — single source of truth for all contracts and domain types.
- `src/core/services/` — pure domain services (no I/O).
- `src/infrastructure/` — adapters that implement contracts (DOM, storage, sensors, ...).
- `src/adapters/` — framework adapters (Astro, Express).
- `src/prisma/` — database layer (Prisma schema + client).
- `tests/` — Vitest unit tests.
- `examples/` — runnable examples (`bun run examples/<name>/demo.ts`).

## Pull request checklist

- [ ] Code follows the development contract above.
- [ ] All methods use the `use*` prefix (except `getInstance`).
- [ ] `bun run typecheck` passes with no errors.
- [ ] `bun run check` passes (Biome lint + format).
- [ ] `bun run test` passes.
- [ ] Tests added/updated for the change.
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
