# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
