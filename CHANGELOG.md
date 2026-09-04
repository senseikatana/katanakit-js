# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2026-09-04

### Changed

- Renamed package to `katanakit-js` on npm.
- Restructured dependencies: `express`, `cors`, `dotenv` and
  `@prisma/orm-postgres` are now **optional peer dependencies**; only
  `@js-temporal/polyfill` remains a runtime dependency.
- Upgraded Biome to v2 and Vitest to v5; migrated `biome.json` schema.

### Added

- Added a **Nuxt adapter** (`katanakit-js/adapters/nuxt`) with `useUnwrap`,
  `useSafeResponse` and `useEventResponse` helpers.
- Added `publish:*` scripts to `package.json`.

### Fixed

- Fixed ESM exports: all barrel files now use explicit `.js` extensions so
  tree-shaking and bundlers resolve imports correctly.
- Fixed `WorkerService` pool correlation (taskId echo in the worker blob).
- Fixed `useEncrypt` to generate a random salt when none is provided.
- Escaped JSON-LD `</script>` breakouts in the SEO service.

## [2.0.0] - 2026-09-03

### Changed

- **Reorganized the project with hexagonal architecture** into `core/`
  (ports + services), `infrastructure/` (adapters) and `adapters/`
  (Astro + Express), replacing the previous flat `helpers/`/`api/` layout.
- Migrated all internal imports to the `@/` path alias and exposed the public API
  through barrel files (`src/index.ts` and per-layer `index.ts`).

### Fixed

- Fixed 51 TypeScript compile errors: broken imports, broken singleton guards
  (`TimingService` and `ViewportService`), the `FIND_ENTRY` scope bug in
  `AstroService`, and Express `Request`/`Response` typing.
- Removed all side effects on import (top-level `fetch` to dummyjson.com,
  `console.log` calls, storage writes and timers).
- Fixed the Express server: `listen` now uses the configured port/host, the user
  router is mounted, and handler `(req, res)` order is correct.
- Fixed the logger call sites (level is now the first argument).

### Removed

- Removed duplicate type definitions (unified in `src/types/`), dead code, empty
  files and the broken signals draft.
- Moved demos to `examples/` and dropped the obsolete `wiki/` documentation.

### Added

- Added `biome.json` and `vitest.config.ts`; wired `typecheck`, `build`, `test`,
  `lint` and `format` scripts.
- Added Vitest unit tests for the HTTP client, logger, storage, geometry, errors
  and reactive signals.
- Added English documentation (`README.md`, `CONTRIBUTING.md`, `docs/`).
