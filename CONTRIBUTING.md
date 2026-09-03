# Contributing to apify-manager

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
3. **Destructured exports** — every service exposes its methods as arrow functions
   and re-exports them destructured (e.g. `LOGGER`, `GET_STORAGE`, `FETCH`) so
   consumers can tree-shake and call them without binding `this`.
4. **`@/` path alias** — internal imports use the `@/` alias (mapped to `src/`).
   The public API is exposed through barrel files (`index.ts`).
5. **English only** — comments, identifiers and user-facing messages are written
   in English.
6. **No side effects on import** — importing a module must never trigger network
   calls, timers, storage writes or DOM mutations. Demos and examples live under
   `examples/`.
7. **SSR safety** — browser-only adapters must guard or fall back gracefully when
   `window` is unavailable (Node.js/Bun SSR).
8. **Tests** — add or update a test under `tests/` for every new feature or bug fix.

## Getting started

```bash
# Prerequisites: Node.js >= 20 or Bun >= 1.0
git clone https://github.com/senseikatana/apify-manager.git
cd apify-manager
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

- `src/core/` — pure domain services and ports (contracts).
- `src/infrastructure/` — adapters that implement ports (DOM, storage, sensors, ...).
- `src/adapters/` — framework adapters (Astro, Express).
- `src/types/` — shared domain types (single source of truth).
- `tests/` — Vitest unit tests.
- `examples/` — runnable examples (`bun run examples/<name>/demo.ts`).

## Pull request checklist

- [ ] Code follows the development contract above.
- [ ] `bun run typecheck` passes with no errors.
- [ ] `bun run check` passes (Biome lint + format).
- [ ] `bun run test` passes.
- [ ] Tests added/updated for the change.
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
