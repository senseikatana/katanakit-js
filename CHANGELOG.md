# Changelog

All notable changes to this project are documented in this file.

## [6.7.1] - 2026-10-04

### Fixed

- **prisma:** align orm-postgres with the CLI toolchain and regenerate the contract
  <details>
  <summary>9 files</summary>

  - `AGENTS.md`
  - `README.md`
  - `bun.lock`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`
  - `src/prisma/schema.d.ts`
  - `src/prisma/schema.json`

  </details>

## [6.7.0] - 2026-10-04

### Added

- **docs:** generate per-page SEO metas with useSeoMeta
  <details>
  <summary>2 files</summary>

  - `AGENTS.md`
  - `docs/.vitepress/config.ts`

  </details>

### Changed

- **docs:** compact API sidebar and enable metaChunk
  <details>
  <summary>2 files</summary>

  - `AGENTS.md`
  - `docs/.vitepress/config.ts`

  </details>

### Chores

- **deps:** update dependencies
  <details>
  <summary>2 files</summary>

  - `bun.lock`
  - `package.json`

  </details>

## [6.6.6] - 2026-10-04

### Changed
- Generate release notes with typed sections and per-file details, sync version references, and document the release workflow (`AGENTS.md`, `CONTRIBUTING.md`).

## [6.6.5] - 2026-10-04

### Documentation

- **.vitepress:** update documentation in 4 files
  <details>
  <summary>4 files</summary>

  - `docs/.vitepress/config.ts`
  - `docs/public/images/hero-logo.avif`
  - `src/core/services/http.service.ts`
  - `src/infrastructure/dom/dom.service.ts`

  </details>

## [6.6.4] - 2026-10-04

### Documentation

- **README.md:** update documentation in 5 files
  <details>
  <summary>5 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>

## [6.6.3] - 2026-10-04

### Documentation

- **AGENTS.md:** update documentation in 2 files
  <details>
  <summary>2 files</summary>

  - `AGENTS.md`
  - `package.json`

  </details>
- docs guidelines and scripts on package.json updated
  <details>
  <summary>5 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>

## [6.6.2] - 2026-10-04

### Documentation

- **AGENTS.md:** update documentation in 2 files
  <details>
  <summary>2 files</summary>

  - `AGENTS.md`
  - `package.json`

  </details>
- **README.md:** update documentation in 7 files
  <details>
  <summary>7 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`
  - `tsconfig.examples.json`
  - `tsconfig.examples.solid.json`

  </details>

## [6.6.1] - 2026-10-04

### Documentation

- **AGENTS.md:** update documentation in 6 files
  <details>
  <summary>6 files</summary>

  - `AGENTS.md`
  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>

## [6.6.0] - 2026-10-04

### Documentation

- **AGENTS.md:** update documentation in 7 files
  <details>
  <summary>7 files</summary>

  - `AGENTS.md`
  - `CHANGELOG.md`
  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>

## [6.5.1] - 2026-10-04

### Security

- **Secret management hardening** — removed real Cloudflare API tokens from `.env` (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_SECURITY_TOKEN` commented out); added "Secret Management" section to `AGENTS.md` and `CONTRIBUTING.md` documenting best practices for handling secrets (empty local `.env`, `.env.example` template only, CI secrets for real values).

### Changed

- **TypeScript strictness** — enabled `isolatedModules: true` in `tsconfig.json` for stricter transpilation checks (required by esbuild/SWC and future bundler compatibility).
- **Removed `.github/` directory** — CI release workflows that kept failing with `Deploy failed` were untracked; docs deploy locally with `bun run cf:deploy`.

## [6.5.0] - 2026-10-04

### Added

- **core:** migrate services and adapters to singleton classes
  <details>
  <summary>26 files</summary>

  - `.zcodeignore`
  - `README.md`
  - `docs/guides/architecture.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`
  - `src/adapters/express/server.ts`
  - `src/adapters/insforge/insforge.service.ts`
  - `src/adapters/notion/notion.service.ts`
  - `src/adapters/telegram/telegram.service.ts`
  - `src/adapters/wordpress/wordpress.service.ts`
  - `src/core/services/access.service.ts`
  - `src/core/services/agent.service.ts`
  - `src/core/services/assistant.service.ts`
  - `src/core/services/dates.service.ts`
  - `src/core/services/http.service.ts`
  - `src/core/services/logger.service.ts`
  - `src/core/services/query.service.ts`
  - `src/core/services/utils.service.ts`
  - `src/core/services/validation.service.ts`
  - `src/infrastructure/decorators/cache.decorator.ts`
  - `src/infrastructure/decorators/index.ts`
  - `src/infrastructure/decorators/logger.decorator.ts`
  - `src/infrastructure/decorators/retry.decorator.ts`
  - `src/infrastructure/index.ts`

  </details>

### Changed

- move CI release workflows and release notes to docs
  <details>
  <summary>12 files</summary>

  - `.github/workflows/ci.yml`
  - `.github/workflows/release.yml`
  - `AGENTS.md`
  - `CONTRIBUTING.md`
  - `README.md`
  - `RELEASE-DRAFT.md`
  - `docs/guides/architecture.md`
  - `docs/release-draft-patterns.md`
  - `src/infrastructure/decorators/cache.decorator.ts`
  - `src/infrastructure/decorators/logger.decorator.ts`
  - `src/infrastructure/decorators/retry.decorator.ts`
  - `tsconfig.json`

  </details>

### Documentation

- **.gitignore:** update documentation in 2 files
  <details>
  <summary>2 files</summary>

  - `.gitignore`
  - `docs/release-draft-patterns.md`

  </details>

## [6.4.6] - 2026-10-03

### Documentation

- **README.md:** update documentation in 5 files
  <details>
  <summary>5 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>

## [6.4.5] - 2026-10-03

### Documentation

- **AGENTS.md:** update documentation in 674 files
  <details>
  <summary>674 files</summary>

  - `AGENTS.md`
  - `CHANGELOG.md`
  - `CONTRIBUTING.md`
  - `README.md`
  - `bun.lock`
  - `docs/.vitepress/config.ts`
  - `docs/.vitepress/theme/components/HyperUiShowcase.vue`
  - `docs/index.md`
  - `docs/public/component.css`
  - `docs/public/component.js`
  - `docs/public/hyperui/.version.json`
  - `docs/public/hyperui/application/accordions/1-dark.html`
  - `docs/public/hyperui/application/accordions/1.html`
  - `docs/public/hyperui/application/accordions/2-dark.html`
  - `docs/public/hyperui/application/accordions/2.html`
  - `docs/public/hyperui/application/accordions/3-dark.html`
  - `docs/public/hyperui/application/accordions/3.html`
  - `docs/public/hyperui/application/accordions/4-dark.html`
  - `docs/public/hyperui/application/accordions/4.html`
  - `docs/public/hyperui/application/accordions/5-dark.html`
  - `docs/public/hyperui/application/accordions/5.html`
  - `docs/public/hyperui/application/accordions/index.html`
  - `docs/public/hyperui/application/badges/2-dark.html`
  - `docs/public/hyperui/application/badges/2.html`
  - `docs/public/hyperui/application/badges/3-dark.html`
  - `docs/public/hyperui/application/badges/3.html`
  - `docs/public/hyperui/application/badges/4-dark.html`
  - `docs/public/hyperui/application/badges/4.html`
  - `docs/public/hyperui/application/badges/5-dark.html`
  - `docs/public/hyperui/application/badges/5.html`
  - `docs/public/hyperui/application/badges/index.html`
  - `docs/public/hyperui/application/breadcrumbs/1-dark.html`
  - `docs/public/hyperui/application/breadcrumbs/1.html`
  - `docs/public/hyperui/application/breadcrumbs/2-dark.html`
  - `docs/public/hyperui/application/breadcrumbs/2.html`
  - `docs/public/hyperui/application/breadcrumbs/3-dark.html`
  - `docs/public/hyperui/application/breadcrumbs/3.html`
  - `docs/public/hyperui/application/breadcrumbs/4-dark.html`
  - `docs/public/hyperui/application/breadcrumbs/4.html`
  - `docs/public/hyperui/application/breadcrumbs/5-dark.html`
  - `docs/public/hyperui/application/breadcrumbs/5.html`
  - `docs/public/hyperui/application/breadcrumbs/index.html`
  - `docs/public/hyperui/application/button-groups/1-dark.html`
  - `docs/public/hyperui/application/button-groups/1.html`
  - `docs/public/hyperui/application/button-groups/2-dark.html`
  - `docs/public/hyperui/application/button-groups/2.html`
  - `docs/public/hyperui/application/button-groups/3-dark.html`
  - `docs/public/hyperui/application/button-groups/3.html`
  - `docs/public/hyperui/application/button-groups/4-dark.html`
  - `docs/public/hyperui/application/button-groups/4.html`
  - `docs/public/hyperui/application/button-groups/5-dark.html`
  - `docs/public/hyperui/application/button-groups/5.html`
  - `docs/public/hyperui/application/button-groups/index.html`
  - `docs/public/hyperui/application/charts/1-dark.html`
  - `docs/public/hyperui/application/charts/1.html`
  - `docs/public/hyperui/application/charts/10-dark.html`
  - `docs/public/hyperui/application/charts/10.html`
  - `docs/public/hyperui/application/charts/11-dark.html`
  - `docs/public/hyperui/application/charts/11.html`
  - `docs/public/hyperui/application/charts/2-dark.html`
  - `docs/public/hyperui/application/charts/2.html`
  - `docs/public/hyperui/application/charts/3-dark.html`
  - `docs/public/hyperui/application/charts/3.html`
  - `docs/public/hyperui/application/charts/4-dark.html`
  - `docs/public/hyperui/application/charts/4.html`
  - `docs/public/hyperui/application/charts/5-dark.html`
  - `docs/public/hyperui/application/charts/5.html`
  - `docs/public/hyperui/application/charts/6-dark.html`
  - `docs/public/hyperui/application/charts/6.html`
  - `docs/public/hyperui/application/charts/7-dark.html`
  - `docs/public/hyperui/application/charts/7.html`
  - `docs/public/hyperui/application/charts/8-dark.html`
  - `docs/public/hyperui/application/charts/8.html`
  - `docs/public/hyperui/application/charts/9-dark.html`
  - `docs/public/hyperui/application/charts/9.html`
  - `docs/public/hyperui/application/charts/index.html`
  - `docs/public/hyperui/application/checkboxes/1-dark.html`
  - `docs/public/hyperui/application/checkboxes/1.html`
  - `docs/public/hyperui/application/checkboxes/2-dark.html`
  - `docs/public/hyperui/application/checkboxes/2.html`
  - `docs/public/hyperui/application/checkboxes/3-dark.html`
  - `docs/public/hyperui/application/checkboxes/3.html`
  - `docs/public/hyperui/application/checkboxes/index.html`
  - `docs/public/hyperui/application/details-list/1-dark.html`
  - `docs/public/hyperui/application/details-list/1.html`
  - `docs/public/hyperui/application/details-list/2-dark.html`
  - `docs/public/hyperui/application/details-list/2.html`
  - `docs/public/hyperui/application/details-list/3-dark.html`
  - `docs/public/hyperui/application/details-list/3.html`
  - `docs/public/hyperui/application/details-list/4-dark.html`
  - `docs/public/hyperui/application/details-list/4.html`
  - `docs/public/hyperui/application/details-list/index.html`
  - `docs/public/hyperui/application/dividers/1-dark.html`
  - `docs/public/hyperui/application/dividers/1.html`
  - `docs/public/hyperui/application/dividers/2-dark.html`
  - `docs/public/hyperui/application/dividers/2.html`
  - `docs/public/hyperui/application/dividers/3-dark.html`
  - `docs/public/hyperui/application/dividers/3.html`
  - `docs/public/hyperui/application/dividers/4-dark.html`
  - `docs/public/hyperui/application/dividers/4.html`
  - `docs/public/hyperui/application/dividers/5-dark.html`
  - `docs/public/hyperui/application/dividers/5.html`
  - `docs/public/hyperui/application/dividers/6-dark.html`
  - `docs/public/hyperui/application/dividers/6.html`
  - `docs/public/hyperui/application/dividers/index.html`
  - `docs/public/hyperui/application/dropdown/1-dark.html`
  - `docs/public/hyperui/application/dropdown/1.html`
  - `docs/public/hyperui/application/dropdown/2-dark.html`
  - `docs/public/hyperui/application/dropdown/2.html`
  - `docs/public/hyperui/application/dropdown/3-dark.html`
  - `docs/public/hyperui/application/dropdown/3.html`
  - `docs/public/hyperui/application/dropdown/index.html`
  - `docs/public/hyperui/application/empty-states/1-dark.html`
  - `docs/public/hyperui/application/empty-states/1.html`
  - `docs/public/hyperui/application/empty-states/2-dark.html`
  - `docs/public/hyperui/application/empty-states/2.html`
  - `docs/public/hyperui/application/empty-states/3-dark.html`
  - `docs/public/hyperui/application/empty-states/3.html`
  - `docs/public/hyperui/application/empty-states/4-dark.html`
  - `docs/public/hyperui/application/empty-states/4.html`
  - `docs/public/hyperui/application/empty-states/5-dark.html`
  - `docs/public/hyperui/application/empty-states/5.html`
  - `docs/public/hyperui/application/empty-states/index.html`
  - `docs/public/hyperui/application/file-uploaders/1-dark.html`
  - `docs/public/hyperui/application/file-uploaders/1.html`
  - `docs/public/hyperui/application/file-uploaders/2-dark.html`
  - `docs/public/hyperui/application/file-uploaders/2.html`
  - `docs/public/hyperui/application/file-uploaders/index.html`
  - `docs/public/hyperui/application/filters/1-dark.html`
  - `docs/public/hyperui/application/filters/1.html`
  - `docs/public/hyperui/application/filters/2-dark.html`
  - `docs/public/hyperui/application/filters/2.html`
  - `docs/public/hyperui/application/filters/index.html`
  - `docs/public/hyperui/application/grids/1.html`
  - `docs/public/hyperui/application/grids/10.html`
  - `docs/public/hyperui/application/grids/2.html`
  - `docs/public/hyperui/application/grids/3.html`
  - `docs/public/hyperui/application/grids/4.html`
  - `docs/public/hyperui/application/grids/5.html`
  - `docs/public/hyperui/application/grids/6.html`
  - `docs/public/hyperui/application/grids/7.html`
  - `docs/public/hyperui/application/grids/8.html`
  - `docs/public/hyperui/application/grids/9.html`
  - `docs/public/hyperui/application/grids/index.html`
  - `docs/public/hyperui/application/index.html`
  - `docs/public/hyperui/application/inputs/1-dark.html`
  - `docs/public/hyperui/application/inputs/1.html`
  - `docs/public/hyperui/application/inputs/2-dark.html`
  - `docs/public/hyperui/application/inputs/2.html`
  - `docs/public/hyperui/application/inputs/3-dark.html`
  - `docs/public/hyperui/application/inputs/3.html`
  - `docs/public/hyperui/application/inputs/4-dark.html`
  - `docs/public/hyperui/application/inputs/4.html`
  - `docs/public/hyperui/application/inputs/index.html`
  - `docs/public/hyperui/application/loaders/1-dark.html`
  - `docs/public/hyperui/application/loaders/1.html`
  - `docs/public/hyperui/application/loaders/2-dark.html`
  - `docs/public/hyperui/application/loaders/2.html`
  - `docs/public/hyperui/application/loaders/3-dark.html`
  - `docs/public/hyperui/application/loaders/3.html`
  - `docs/public/hyperui/application/loaders/4-dark.html`
  - `docs/public/hyperui/application/loaders/4.html`
  - `docs/public/hyperui/application/loaders/5-dark.html`
  - `docs/public/hyperui/application/loaders/5.html`
  - `docs/public/hyperui/application/loaders/6-dark.html`
  - `docs/public/hyperui/application/loaders/6.html`
  - `docs/public/hyperui/application/loaders/7-dark.html`
  - `docs/public/hyperui/application/loaders/7.html`
  - `docs/public/hyperui/application/loaders/index.html`
  - `docs/public/hyperui/application/media/1.html`
  - `docs/public/hyperui/application/media/2.html`
  - `docs/public/hyperui/application/media/3.html`
  - `docs/public/hyperui/application/media/4.html`
  - `docs/public/hyperui/application/media/5.html`
  - `docs/public/hyperui/application/media/6.html`
  - `docs/public/hyperui/application/media/7.html`
  - `docs/public/hyperui/application/media/8.html`
  - `docs/public/hyperui/application/media/index.html`
  - `docs/public/hyperui/application/modals/1-dark.html`
  - `docs/public/hyperui/application/modals/1.html`
  - `docs/public/hyperui/application/modals/2-dark.html`
  - `docs/public/hyperui/application/modals/2.html`
  - `docs/public/hyperui/application/modals/3-dark.html`
  - `docs/public/hyperui/application/modals/3.html`
  - `docs/public/hyperui/application/modals/4-dark.html`
  - `docs/public/hyperui/application/modals/4.html`
  - `docs/public/hyperui/application/modals/5-dark.html`
  - `docs/public/hyperui/application/modals/5.html`
  - `docs/public/hyperui/application/modals/6-dark.html`
  - `docs/public/hyperui/application/modals/6.html`
  - `docs/public/hyperui/application/modals/index.html`
  - `docs/public/hyperui/application/pagination/1-dark.html`
  - `docs/public/hyperui/application/pagination/1.html`
  - `docs/public/hyperui/application/pagination/2-dark.html`
  - `docs/public/hyperui/application/pagination/2.html`
  - `docs/public/hyperui/application/pagination/3-dark.html`
  - `docs/public/hyperui/application/pagination/3.html`
  - `docs/public/hyperui/application/pagination/index.html`
  - `docs/public/hyperui/application/progress-bars/1.html`
  - `docs/public/hyperui/application/progress-bars/2.html`
  - `docs/public/hyperui/application/progress-bars/3.html`
  - `docs/public/hyperui/application/progress-bars/4.html`
  - `docs/public/hyperui/application/progress-bars/index.html`
  - `docs/public/hyperui/application/quantity-inputs/1-dark.html`
  - `docs/public/hyperui/application/quantity-inputs/1.html`
  - `docs/public/hyperui/application/quantity-inputs/2-dark.html`
  - `docs/public/hyperui/application/quantity-inputs/2.html`
  - `docs/public/hyperui/application/quantity-inputs/3-dark.html`
  - `docs/public/hyperui/application/quantity-inputs/3.html`
  - `docs/public/hyperui/application/quantity-inputs/4-dark.html`
  - `docs/public/hyperui/application/quantity-inputs/4.html`
  - `docs/public/hyperui/application/quantity-inputs/index.html`
  - `docs/public/hyperui/application/radio-groups/1-dark.html`
  - `docs/public/hyperui/application/radio-groups/1.html`
  - `docs/public/hyperui/application/radio-groups/2-dark.html`
  - `docs/public/hyperui/application/radio-groups/2.html`
  - `docs/public/hyperui/application/radio-groups/3.html`
  - `docs/public/hyperui/application/radio-groups/index.html`
  - `docs/public/hyperui/application/range-inputs/1.html`
  - `docs/public/hyperui/application/range-inputs/2.html`
  - `docs/public/hyperui/application/range-inputs/3.html`
  - `docs/public/hyperui/application/range-inputs/4.html`
  - `docs/public/hyperui/application/range-inputs/5.html`
  - `docs/public/hyperui/application/range-inputs/index.html`
  - `docs/public/hyperui/application/selects/1-dark.html`
  - `docs/public/hyperui/application/selects/1.html`
  - `docs/public/hyperui/application/selects/2-dark.html`
  - `docs/public/hyperui/application/selects/2.html`
  - `docs/public/hyperui/application/selects/3-dark.html`
  - `docs/public/hyperui/application/selects/3.html`
  - `docs/public/hyperui/application/selects/index.html`
  - `docs/public/hyperui/application/side-menu/1-dark.html`
  - `docs/public/hyperui/application/side-menu/1.html`
  - `docs/public/hyperui/application/side-menu/2-dark.html`
  - `docs/public/hyperui/application/side-menu/2.html`
  - `docs/public/hyperui/application/side-menu/index.html`
  - `docs/public/hyperui/application/skip-links/1.html`
  - `docs/public/hyperui/application/skip-links/2.html`
  - `docs/public/hyperui/application/skip-links/3.html`
  - `docs/public/hyperui/application/skip-links/index.html`
  - `docs/public/hyperui/application/stats/1-dark.html`
  - `docs/public/hyperui/application/stats/1.html`
  - `docs/public/hyperui/application/stats/2-dark.html`
  - `docs/public/hyperui/application/stats/2.html`
  - `docs/public/hyperui/application/stats/3-dark.html`
  - `docs/public/hyperui/application/stats/3.html`
  - `docs/public/hyperui/application/stats/4-dark.html`
  - `docs/public/hyperui/application/stats/4.html`
  - `docs/public/hyperui/application/stats/5-dark.html`
  - `docs/public/hyperui/application/stats/5.html`
  - `docs/public/hyperui/application/stats/6-dark.html`
  - `docs/public/hyperui/application/stats/6.html`
  - `docs/public/hyperui/application/stats/index.html`
  - `docs/public/hyperui/application/steps/1-dark.html`
  - `docs/public/hyperui/application/steps/1.html`
  - `docs/public/hyperui/application/steps/2-dark.html`
  - `docs/public/hyperui/application/steps/2.html`
  - `docs/public/hyperui/application/steps/3-dark.html`
  - `docs/public/hyperui/application/steps/3.html`
  - `docs/public/hyperui/application/steps/4-dark.html`
  - `docs/public/hyperui/application/steps/4.html`
  - `docs/public/hyperui/application/steps/5-dark.html`
  - `docs/public/hyperui/application/steps/5.html`
  - `docs/public/hyperui/application/steps/index.html`
  - `docs/public/hyperui/application/tables/1-dark.html`
  - `docs/public/hyperui/application/tables/1.html`
  - `docs/public/hyperui/application/tables/2-dark.html`
  - `docs/public/hyperui/application/tables/2.html`
  - `docs/public/hyperui/application/tables/3-dark.html`
  - `docs/public/hyperui/application/tables/3.html`
  - `docs/public/hyperui/application/tables/4-dark.html`
  - `docs/public/hyperui/application/tables/4.html`
  - `docs/public/hyperui/application/tables/5-dark.html`
  - `docs/public/hyperui/application/tables/5.html`
  - `docs/public/hyperui/application/tables/index.html`
  - `docs/public/hyperui/application/tabs/1-dark.html`
  - `docs/public/hyperui/application/tabs/1.html`
  - `docs/public/hyperui/application/tabs/2-dark.html`
  - `docs/public/hyperui/application/tabs/2.html`
  - `docs/public/hyperui/application/tabs/3-dark.html`
  - `docs/public/hyperui/application/tabs/3.html`
  - `docs/public/hyperui/application/tabs/4-dark.html`
  - `docs/public/hyperui/application/tabs/4.html`
  - `docs/public/hyperui/application/tabs/5-dark.html`
  - `docs/public/hyperui/application/tabs/5.html`
  - `docs/public/hyperui/application/tabs/index.html`
  - `docs/public/hyperui/application/textareas/1-dark.html`
  - `docs/public/hyperui/application/textareas/1.html`
  - `docs/public/hyperui/application/textareas/2-dark.html`
  - `docs/public/hyperui/application/textareas/2.html`
  - `docs/public/hyperui/application/textareas/3-dark.html`
  - `docs/public/hyperui/application/textareas/3.html`
  - `docs/public/hyperui/application/textareas/index.html`
  - `docs/public/hyperui/application/timelines/1-dark.html`
  - `docs/public/hyperui/application/timelines/1.html`
  - `docs/public/hyperui/application/timelines/2-dark.html`
  - `docs/public/hyperui/application/timelines/2.html`
  - `docs/public/hyperui/application/timelines/3-dark.html`
  - `docs/public/hyperui/application/timelines/3.html`
  - `docs/public/hyperui/application/timelines/index.html`
  - `docs/public/hyperui/application/toasts/1-dark.html`
  - `docs/public/hyperui/application/toasts/1.html`
  - `docs/public/hyperui/application/toasts/2-dark.html`
  - `docs/public/hyperui/application/toasts/2.html`
  - `docs/public/hyperui/application/toasts/3-dark.html`
  - `docs/public/hyperui/application/toasts/3.html`
  - `docs/public/hyperui/application/toasts/4-dark.html`
  - `docs/public/hyperui/application/toasts/4.html`
  - `docs/public/hyperui/application/toasts/5-dark.html`
  - `docs/public/hyperui/application/toasts/5.html`
  - `docs/public/hyperui/application/toasts/6-dark.html`
  - `docs/public/hyperui/application/toasts/6.html`
  - `docs/public/hyperui/application/toasts/index.html`
  - `docs/public/hyperui/application/toggles/1-dark.html`
  - `docs/public/hyperui/application/toggles/1.html`
  - `docs/public/hyperui/application/toggles/2-dark.html`
  - `docs/public/hyperui/application/toggles/2.html`
  - `docs/public/hyperui/application/toggles/3-dark.html`
  - `docs/public/hyperui/application/toggles/3.html`
  - `docs/public/hyperui/application/toggles/4-dark.html`
  - `docs/public/hyperui/application/toggles/4.html`
  - `docs/public/hyperui/application/toggles/index.html`
  - `docs/public/hyperui/application/vertical-menu/1-dark.html`
  - `docs/public/hyperui/application/vertical-menu/1.html`
  - `docs/public/hyperui/application/vertical-menu/2-dark.html`
  - `docs/public/hyperui/application/vertical-menu/2.html`
  - `docs/public/hyperui/application/vertical-menu/3-dark.html`
  - `docs/public/hyperui/application/vertical-menu/3.html`
  - `docs/public/hyperui/application/vertical-menu/4-dark.html`
  - `docs/public/hyperui/application/vertical-menu/4.html`
  - `docs/public/hyperui/application/vertical-menu/5-dark.html`
  - `docs/public/hyperui/application/vertical-menu/5.html`
  - `docs/public/hyperui/application/vertical-menu/6-dark.html`
  - `docs/public/hyperui/application/vertical-menu/6.html`
  - `docs/public/hyperui/application/vertical-menu/7-dark.html`
  - `docs/public/hyperui/application/vertical-menu/7.html`
  - `docs/public/hyperui/application/vertical-menu/8-dark.html`
  - `docs/public/hyperui/application/vertical-menu/8.html`
  - `docs/public/hyperui/application/vertical-menu/index.html`
  - `docs/public/hyperui/blog/animate-duration-delay/1.html`
  - `docs/public/hyperui/blog/animate-duration-delay/index.html`
  - `docs/public/hyperui/blog/index.html`
  - `docs/public/hyperui/blog/remove-number-input-spinners/1.html`
  - `docs/public/hyperui/blog/remove-number-input-spinners/index.html`
  - `docs/public/hyperui/index.html`
  - `docs/public/hyperui/marketing/announcements/1-dark.html`
  - `docs/public/hyperui/marketing/announcements/1.html`
  - `docs/public/hyperui/marketing/announcements/2-dark.html`
  - `docs/public/hyperui/marketing/announcements/2.html`
  - `docs/public/hyperui/marketing/announcements/3-dark.html`
  - `docs/public/hyperui/marketing/announcements/3.html`
  - `docs/public/hyperui/marketing/announcements/4-dark.html`
  - `docs/public/hyperui/marketing/announcements/4.html`
  - `docs/public/hyperui/marketing/announcements/5-dark.html`
  - `docs/public/hyperui/marketing/announcements/5.html`
  - `docs/public/hyperui/marketing/announcements/6-dark.html`
  - `docs/public/hyperui/marketing/announcements/6.html`
  - `docs/public/hyperui/marketing/announcements/index.html`
  - `docs/public/hyperui/marketing/banners/1-dark.html`
  - `docs/public/hyperui/marketing/banners/1.html`
  - `docs/public/hyperui/marketing/banners/2-dark.html`
  - `docs/public/hyperui/marketing/banners/2.html`
  - `docs/public/hyperui/marketing/banners/3-dark.html`
  - `docs/public/hyperui/marketing/banners/3.html`
  - `docs/public/hyperui/marketing/banners/index.html`
  - `docs/public/hyperui/marketing/blog-cards/1-dark.html`
  - `docs/public/hyperui/marketing/blog-cards/1.html`
  - `docs/public/hyperui/marketing/blog-cards/2-dark.html`
  - `docs/public/hyperui/marketing/blog-cards/2.html`
  - `docs/public/hyperui/marketing/blog-cards/3-dark.html`
  - `docs/public/hyperui/marketing/blog-cards/3.html`
  - `docs/public/hyperui/marketing/blog-cards/4-dark.html`
  - `docs/public/hyperui/marketing/blog-cards/4.html`
  - `docs/public/hyperui/marketing/blog-cards/5-dark.html`
  - `docs/public/hyperui/marketing/blog-cards/5.html`
  - `docs/public/hyperui/marketing/blog-cards/6-dark.html`
  - `docs/public/hyperui/marketing/blog-cards/6.html`
  - `docs/public/hyperui/marketing/blog-cards/7.html`
  - `docs/public/hyperui/marketing/blog-cards/index.html`
  - `docs/public/hyperui/marketing/buttons/2-dark.html`
  - `docs/public/hyperui/marketing/buttons/2.html`
  - `docs/public/hyperui/marketing/buttons/3-dark.html`
  - `docs/public/hyperui/marketing/buttons/3.html`
  - `docs/public/hyperui/marketing/buttons/4-dark.html`
  - `docs/public/hyperui/marketing/buttons/4.html`
  - `docs/public/hyperui/marketing/buttons/5-dark.html`
  - `docs/public/hyperui/marketing/buttons/5.html`
  - `docs/public/hyperui/marketing/buttons/index.html`
  - `docs/public/hyperui/marketing/cards/1.html`
  - `docs/public/hyperui/marketing/cards/2.html`
  - `docs/public/hyperui/marketing/cards/3.html`
  - `docs/public/hyperui/marketing/cards/4.html`
  - `docs/public/hyperui/marketing/cards/5.html`
  - `docs/public/hyperui/marketing/cards/6.html`
  - `docs/public/hyperui/marketing/cards/7.html`
  - `docs/public/hyperui/marketing/cards/8.html`
  - `docs/public/hyperui/marketing/cards/9.html`
  - `docs/public/hyperui/marketing/cards/index.html`
  - `docs/public/hyperui/marketing/carts/1-dark.html`
  - `docs/public/hyperui/marketing/carts/1.html`
  - `docs/public/hyperui/marketing/carts/2-dark.html`
  - `docs/public/hyperui/marketing/carts/2.html`
  - `docs/public/hyperui/marketing/carts/3-dark.html`
  - `docs/public/hyperui/marketing/carts/3.html`
  - `docs/public/hyperui/marketing/carts/index.html`
  - `docs/public/hyperui/marketing/contact-forms/1-dark.html`
  - `docs/public/hyperui/marketing/contact-forms/1.html`
  - `docs/public/hyperui/marketing/contact-forms/2-dark.html`
  - `docs/public/hyperui/marketing/contact-forms/2.html`
  - `docs/public/hyperui/marketing/contact-forms/3-dark.html`
  - `docs/public/hyperui/marketing/contact-forms/3.html`
  - `docs/public/hyperui/marketing/contact-forms/4-dark.html`
  - `docs/public/hyperui/marketing/contact-forms/4.html`
  - `docs/public/hyperui/marketing/contact-forms/5-dark.html`
  - `docs/public/hyperui/marketing/contact-forms/5.html`
  - `docs/public/hyperui/marketing/contact-forms/index.html`
  - `docs/public/hyperui/marketing/ctas/2-dark.html`
  - `docs/public/hyperui/marketing/ctas/2.html`
  - `docs/public/hyperui/marketing/ctas/3-dark.html`
  - `docs/public/hyperui/marketing/ctas/3.html`
  - `docs/public/hyperui/marketing/ctas/4-dark.html`
  - `docs/public/hyperui/marketing/ctas/4.html`
  - `docs/public/hyperui/marketing/ctas/index.html`
  - `docs/public/hyperui/marketing/empty-content/1-dark.html`
  - `docs/public/hyperui/marketing/empty-content/1.html`
  - `docs/public/hyperui/marketing/empty-content/2-dark.html`
  - `docs/public/hyperui/marketing/empty-content/2.html`
  - `docs/public/hyperui/marketing/empty-content/3-dark.html`
  - `docs/public/hyperui/marketing/empty-content/3.html`
  - `docs/public/hyperui/marketing/empty-content/4-dark.html`
  - `docs/public/hyperui/marketing/empty-content/4.html`
  - `docs/public/hyperui/marketing/empty-content/5-dark.html`
  - `docs/public/hyperui/marketing/empty-content/5.html`
  - `docs/public/hyperui/marketing/empty-content/index.html`
  - `docs/public/hyperui/marketing/faqs/1-dark.html`
  - `docs/public/hyperui/marketing/faqs/1.html`
  - `docs/public/hyperui/marketing/faqs/2-dark.html`
  - `docs/public/hyperui/marketing/faqs/2.html`
  - `docs/public/hyperui/marketing/faqs/3-dark.html`
  - `docs/public/hyperui/marketing/faqs/3.html`
  - `docs/public/hyperui/marketing/faqs/index.html`
  - `docs/public/hyperui/marketing/feature-grids/1-dark.html`
  - `docs/public/hyperui/marketing/feature-grids/1.html`
  - `docs/public/hyperui/marketing/feature-grids/2-dark.html`
  - `docs/public/hyperui/marketing/feature-grids/2.html`
  - `docs/public/hyperui/marketing/feature-grids/3-dark.html`
  - `docs/public/hyperui/marketing/feature-grids/3.html`
  - `docs/public/hyperui/marketing/feature-grids/4-dark.html`
  - `docs/public/hyperui/marketing/feature-grids/4.html`
  - `docs/public/hyperui/marketing/feature-grids/index.html`
  - `docs/public/hyperui/marketing/footers/1-dark.html`
  - `docs/public/hyperui/marketing/footers/1.html`
  - `docs/public/hyperui/marketing/footers/10-dark.html`
  - `docs/public/hyperui/marketing/footers/10.html`
  - `docs/public/hyperui/marketing/footers/11-dark.html`
  - `docs/public/hyperui/marketing/footers/11.html`
  - `docs/public/hyperui/marketing/footers/12-dark.html`
  - `docs/public/hyperui/marketing/footers/12.html`
  - `docs/public/hyperui/marketing/footers/2-dark.html`
  - `docs/public/hyperui/marketing/footers/2.html`
  - `docs/public/hyperui/marketing/footers/3-dark.html`
  - `docs/public/hyperui/marketing/footers/3.html`
  - `docs/public/hyperui/marketing/footers/4-dark.html`
  - `docs/public/hyperui/marketing/footers/4.html`
  - `docs/public/hyperui/marketing/footers/5-dark.html`
  - `docs/public/hyperui/marketing/footers/5.html`
  - `docs/public/hyperui/marketing/footers/6-dark.html`
  - `docs/public/hyperui/marketing/footers/6.html`
  - `docs/public/hyperui/marketing/footers/7-dark.html`
  - `docs/public/hyperui/marketing/footers/7.html`
  - `docs/public/hyperui/marketing/footers/8-dark.html`
  - `docs/public/hyperui/marketing/footers/8.html`
  - `docs/public/hyperui/marketing/footers/9-dark.html`
  - `docs/public/hyperui/marketing/footers/9.html`
  - `docs/public/hyperui/marketing/footers/index.html`
  - `docs/public/hyperui/marketing/headers/1-dark.html`
  - `docs/public/hyperui/marketing/headers/1.html`
  - `docs/public/hyperui/marketing/headers/2-dark.html`
  - `docs/public/hyperui/marketing/headers/2.html`
  - `docs/public/hyperui/marketing/headers/3-dark.html`
  - `docs/public/hyperui/marketing/headers/3.html`
  - `docs/public/hyperui/marketing/headers/4-dark.html`
  - `docs/public/hyperui/marketing/headers/4.html`
  - `docs/public/hyperui/marketing/headers/index.html`
  - `docs/public/hyperui/marketing/index.html`
  - `docs/public/hyperui/marketing/logo-clouds/1.html`
  - `docs/public/hyperui/marketing/logo-clouds/2.html`
  - `docs/public/hyperui/marketing/logo-clouds/3.html`
  - `docs/public/hyperui/marketing/logo-clouds/4.html`
  - `docs/public/hyperui/marketing/logo-clouds/index.html`
  - `docs/public/hyperui/marketing/newsletter-signup/1-dark.html`
  - `docs/public/hyperui/marketing/newsletter-signup/1.html`
  - `docs/public/hyperui/marketing/newsletter-signup/2-dark.html`
  - `docs/public/hyperui/marketing/newsletter-signup/2.html`
  - `docs/public/hyperui/marketing/newsletter-signup/index.html`
  - `docs/public/hyperui/marketing/polls/1-dark.html`
  - `docs/public/hyperui/marketing/polls/1.html`
  - `docs/public/hyperui/marketing/polls/2-dark.html`
  - `docs/public/hyperui/marketing/polls/2.html`
  - `docs/public/hyperui/marketing/polls/3-dark.html`
  - `docs/public/hyperui/marketing/polls/3.html`
  - `docs/public/hyperui/marketing/polls/index.html`
  - `docs/public/hyperui/marketing/pricing/1.html`
  - `docs/public/hyperui/marketing/pricing/2.html`
  - `docs/public/hyperui/marketing/pricing/index.html`
  - `docs/public/hyperui/marketing/product-cards/1.html`
  - `docs/public/hyperui/marketing/product-cards/2.html`
  - `docs/public/hyperui/marketing/product-cards/3.html`
  - `docs/public/hyperui/marketing/product-cards/4.html`
  - `docs/public/hyperui/marketing/product-cards/5.html`
  - `docs/public/hyperui/marketing/product-cards/6.html`
  - `docs/public/hyperui/marketing/product-cards/7.html`
  - `docs/public/hyperui/marketing/product-cards/8.html`
  - `docs/public/hyperui/marketing/product-cards/index.html`
  - `docs/public/hyperui/marketing/product-collections/1.html`
  - `docs/public/hyperui/marketing/product-collections/2.html`
  - `docs/public/hyperui/marketing/product-collections/3.html`
  - `docs/public/hyperui/marketing/product-collections/4.html`
  - `docs/public/hyperui/marketing/product-collections/index.html`
  - `docs/public/hyperui/marketing/sections/1.html`
  - `docs/public/hyperui/marketing/sections/2.html`
  - `docs/public/hyperui/marketing/sections/3.html`
  - `docs/public/hyperui/marketing/sections/4.html`
  - `docs/public/hyperui/marketing/sections/index.html`
  - `docs/public/hyperui/marketing/stats/1-dark.html`
  - `docs/public/hyperui/marketing/stats/1.html`
  - `docs/public/hyperui/marketing/stats/2-dark.html`
  - `docs/public/hyperui/marketing/stats/2.html`
  - `docs/public/hyperui/marketing/stats/3-dark.html`
  - `docs/public/hyperui/marketing/stats/3.html`
  - `docs/public/hyperui/marketing/stats/index.html`
  - `docs/public/hyperui/marketing/team-sections/1-dark.html`
  - `docs/public/hyperui/marketing/team-sections/1.html`
  - `docs/public/hyperui/marketing/team-sections/2-dark.html`
  - `docs/public/hyperui/marketing/team-sections/2.html`
  - `docs/public/hyperui/marketing/team-sections/3-dark.html`
  - `docs/public/hyperui/marketing/team-sections/3.html`
  - `docs/public/hyperui/marketing/team-sections/index.html`
  - `docs/public/hyperui/marketing/testimonials/1.html`
  - `docs/public/hyperui/marketing/testimonials/2.html`
  - `docs/public/hyperui/marketing/testimonials/3.html`
  - `docs/public/hyperui/marketing/testimonials/index.html`
  - `docs/public/hyperui/neobrutalism/accordions/1-dark.html`
  - `docs/public/hyperui/neobrutalism/accordions/1.html`
  - `docs/public/hyperui/neobrutalism/accordions/2-dark.html`
  - `docs/public/hyperui/neobrutalism/accordions/2.html`
  - `docs/public/hyperui/neobrutalism/accordions/3-dark.html`
  - `docs/public/hyperui/neobrutalism/accordions/3.html`
  - `docs/public/hyperui/neobrutalism/accordions/index.html`
  - `docs/public/hyperui/neobrutalism/alerts/1-dark.html`
  - `docs/public/hyperui/neobrutalism/alerts/1.html`
  - `docs/public/hyperui/neobrutalism/alerts/2-dark.html`
  - `docs/public/hyperui/neobrutalism/alerts/2.html`
  - `docs/public/hyperui/neobrutalism/alerts/3-dark.html`
  - `docs/public/hyperui/neobrutalism/alerts/3.html`
  - `docs/public/hyperui/neobrutalism/alerts/index.html`
  - `docs/public/hyperui/neobrutalism/badges/1-dark.html`
  - `docs/public/hyperui/neobrutalism/badges/1.html`
  - `docs/public/hyperui/neobrutalism/badges/2-dark.html`
  - `docs/public/hyperui/neobrutalism/badges/2.html`
  - `docs/public/hyperui/neobrutalism/badges/3-dark.html`
  - `docs/public/hyperui/neobrutalism/badges/3.html`
  - `docs/public/hyperui/neobrutalism/badges/index.html`
  - `docs/public/hyperui/neobrutalism/buttons/2-dark.html`
  - `docs/public/hyperui/neobrutalism/buttons/2.html`
  - `docs/public/hyperui/neobrutalism/buttons/3-dark.html`
  - `docs/public/hyperui/neobrutalism/buttons/3.html`
  - `docs/public/hyperui/neobrutalism/buttons/4-dark.html`
  - `docs/public/hyperui/neobrutalism/buttons/4.html`
  - `docs/public/hyperui/neobrutalism/buttons/5-dark.html`
  - `docs/public/hyperui/neobrutalism/buttons/5.html`
  - `docs/public/hyperui/neobrutalism/buttons/index.html`
  - `docs/public/hyperui/neobrutalism/cards/1-dark.html`
  - `docs/public/hyperui/neobrutalism/cards/1.html`
  - `docs/public/hyperui/neobrutalism/cards/2-dark.html`
  - `docs/public/hyperui/neobrutalism/cards/2.html`
  - `docs/public/hyperui/neobrutalism/cards/3-dark.html`
  - `docs/public/hyperui/neobrutalism/cards/3.html`
  - `docs/public/hyperui/neobrutalism/cards/4-dark.html`
  - `docs/public/hyperui/neobrutalism/cards/4.html`
  - `docs/public/hyperui/neobrutalism/cards/index.html`
  - `docs/public/hyperui/neobrutalism/checkboxes/1-dark.html`
  - `docs/public/hyperui/neobrutalism/checkboxes/1.html`
  - `docs/public/hyperui/neobrutalism/checkboxes/2-dark.html`
  - `docs/public/hyperui/neobrutalism/checkboxes/2.html`
  - `docs/public/hyperui/neobrutalism/checkboxes/3-dark.html`
  - `docs/public/hyperui/neobrutalism/checkboxes/3.html`
  - `docs/public/hyperui/neobrutalism/checkboxes/index.html`
  - `docs/public/hyperui/neobrutalism/index.html`
  - `docs/public/hyperui/neobrutalism/inputs/1-dark.html`
  - `docs/public/hyperui/neobrutalism/inputs/1.html`
  - `docs/public/hyperui/neobrutalism/inputs/2-dark.html`
  - `docs/public/hyperui/neobrutalism/inputs/2.html`
  - `docs/public/hyperui/neobrutalism/inputs/3-dark.html`
  - `docs/public/hyperui/neobrutalism/inputs/3.html`
  - `docs/public/hyperui/neobrutalism/inputs/index.html`
  - `docs/public/hyperui/neobrutalism/progress-bars/1-dark.html`
  - `docs/public/hyperui/neobrutalism/progress-bars/1.html`
  - `docs/public/hyperui/neobrutalism/progress-bars/2-dark.html`
  - `docs/public/hyperui/neobrutalism/progress-bars/2.html`
  - `docs/public/hyperui/neobrutalism/progress-bars/3-dark.html`
  - `docs/public/hyperui/neobrutalism/progress-bars/3.html`
  - `docs/public/hyperui/neobrutalism/progress-bars/index.html`
  - `docs/public/hyperui/neobrutalism/selects/1-dark.html`
  - `docs/public/hyperui/neobrutalism/selects/1.html`
  - `docs/public/hyperui/neobrutalism/selects/2-dark.html`
  - `docs/public/hyperui/neobrutalism/selects/2.html`
  - `docs/public/hyperui/neobrutalism/selects/3-dark.html`
  - `docs/public/hyperui/neobrutalism/selects/3.html`
  - `docs/public/hyperui/neobrutalism/selects/index.html`
  - `docs/public/hyperui/neobrutalism/tabs/1-dark.html`
  - `docs/public/hyperui/neobrutalism/tabs/1.html`
  - `docs/public/hyperui/neobrutalism/tabs/2-dark.html`
  - `docs/public/hyperui/neobrutalism/tabs/2.html`
  - `docs/public/hyperui/neobrutalism/tabs/3-dark.html`
  - `docs/public/hyperui/neobrutalism/tabs/3.html`
  - `docs/public/hyperui/neobrutalism/tabs/4-dark.html`
  - `docs/public/hyperui/neobrutalism/tabs/4.html`
  - `docs/public/hyperui/neobrutalism/tabs/index.html`
  - `docs/public/hyperui/neobrutalism/textareas/1-dark.html`
  - `docs/public/hyperui/neobrutalism/textareas/1.html`
  - `docs/public/hyperui/neobrutalism/textareas/2-dark.html`
  - `docs/public/hyperui/neobrutalism/textareas/2.html`
  - `docs/public/hyperui/neobrutalism/textareas/3-dark.html`
  - `docs/public/hyperui/neobrutalism/textareas/3.html`
  - `docs/public/hyperui/neobrutalism/textareas/index.html`
  - `docs/public/hyperui/templates/analytics-dashboard/1.html`
  - `docs/public/hyperui/templates/analytics-dashboard/2.html`
  - `docs/public/hyperui/templates/analytics-dashboard/3.html`
  - `docs/public/hyperui/templates/analytics-dashboard/4.html`
  - `docs/public/hyperui/templates/analytics-dashboard/5.html`
  - `docs/public/hyperui/templates/analytics-dashboard/index.html`
  - `docs/public/hyperui/templates/index.html`
  - `docs/public/hyperui/templates/portfolio/1.html`
  - `docs/public/hyperui/templates/portfolio/2.html`
  - `docs/public/hyperui/templates/portfolio/index.html`
  - `docs/public/hyperui/templates/saas-landing-page/1.html`
  - `docs/public/hyperui/templates/saas-landing-page/index.html`
  - `docs/public/hyperui/templates/storefront/1.html`
  - `docs/public/hyperui/templates/storefront/2.html`
  - `docs/public/hyperui/templates/storefront/index.html`
  - `docs/public/hyperui/templates/support-inbox/1.html`
  - `docs/public/hyperui/templates/support-inbox/2.html`
  - `docs/public/hyperui/templates/support-inbox/index.html`
  - `docs/ui-kit/architecture.md`
  - `docs/ui-kit/components/badge.md`
  - `docs/ui-kit/css/core/apply.md`
  - `docs/ui-kit/css/core/breakpoints.md`
  - `docs/ui-kit/css/core/colors.md`
  - `docs/ui-kit/css/core/dark-mode.md`
  - `docs/ui-kit/css/core/tokens.md`
  - `docs/ui-kit/css/getting-started.md`
  - `docs/ui-kit/css/index.md`
  - `docs/ui-kit/css/reference/api-reference.md`
  - `docs/ui-kit/css/utilities/colors-extended.md`
  - `docs/ui-kit/css/utilities/container.md`
  - `docs/ui-kit/hyperui.md`
  - `docs/ui-kit/index.md`
  - `docs/ui-kit/roadmap.md`
  - `package.json`
  - `packages/ui/README.md`
  - `packages/ui/package.json`
  - `packages/ui/scripts/concat-css.mjs`
  - `packages/ui/src/styles/index.scss`
  - `scripts/sync-hyperui.mjs`
  - `scss/_flags.scss`
  - `scss/_functions.scss`
  - `scss/_mixins.scss`
  - `scss/_reset.scss`
  - `scss/_utilities.scss`
  - `scss/_variables.scss`
  - `scss/components/_index.scss`
  - `scss/demo.scss`
  - `scss/main.scss`

  </details>

## [6.4.4] - 2026-10-03

### Documentation

- **README.md:** update documentation in 5 files
  <details>
  <summary>5 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>

## [6.4.3] - 2026-10-03

### Added

- **docs:** resolve panel emojis from scope and keywords — `scripts/docs-prepare.mjs`
- **adapters:** add Better Auth adapter with Safe Result helpers
  <details>
  <summary>7 files</summary>

  - `bun.lock`
  - `package.json`
  - `src/adapters/better-auth/better-auth.service.ts`
  - `src/adapters/better-auth/client.ts`
  - `src/adapters/better-auth/index.ts`
  - `src/adapters/index.ts`
  - `tests/better-auth.service.test.ts`

  </details>
- **docs:** summarize the last 6 releases in the what's-new panel
  <details>
  <summary>4 files</summary>

  - `docs/.vitepress/theme/components/WhatNew.vue`
  - `docs/.vitepress/theme/signals.ts`
  - `docs/.vitepress/theme/style.css`
  - `scripts/docs-prepare.mjs`

  </details>
- **adapters:** add PhotoSwipe adapter with DOM-selector options
  <details>
  <summary>6 files</summary>

  - `bun.lock`
  - `package.json`
  - `src/adapters/index.ts`
  - `src/adapters/photoswipe/index.ts`
  - `src/adapters/photoswipe/photoswipe.service.ts`
  - `tests/photoswipe.service.test.ts`

  </details>

### Documentation

- document the new adapters and refresh stale command references
  <details>
  <summary>10 files</summary>

  - `AGENTS.md`
  - `CONTRIBUTING.md`
  - `README.md`
  - `docs/.vitepress/config.ts`
  - `docs/guides/architecture.md`
  - `docs/guides/better-auth.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `docs/index.md`

  </details>
- **guides:** document the PhotoSwipe adapter
  <details>
  <summary>2 files</summary>

  - `docs/.vitepress/config.ts`
  - `docs/guides/photoswipe.md`

  </details>

### CI

- **workflows:** update pipeline configuration in 22 files
  <details>
  <summary>22 files</summary>

  - `.github/workflows/ci.yml`
  - `.github/workflows/release.yml`
  - `.gitignore`
  - `.husky/pre-commit`
  - `.vscode/extensions.json`
  - `.vscode/settings.json`
  - `bun.lock`
  - `docs/.vitepress/config.ts`
  - `docs/.vitepress/theme/components/HyperUiShowcase.vue`
  - `docs/.vitepress/theme/hyperui.css`
  - `docs/.vitepress/theme/index.ts`
  - `docs/.vitepress/theme/style.css`
  - `docs/public/hyperui/application/badges/1-dark.html`
  - `docs/public/hyperui/application/badges/1.html`
  - `docs/public/hyperui/marketing/buttons/1-dark.html`
  - `docs/public/hyperui/marketing/buttons/1.html`
  - `docs/public/hyperui/marketing/ctas/1-dark.html`
  - `docs/public/hyperui/marketing/ctas/1.html`
  - `docs/public/hyperui/neobrutalism/buttons/1-dark.html`
  - `docs/public/hyperui/neobrutalism/buttons/1.html`
  - `docs/ui-kit/hyperui.md`
  - `package.json`

  </details>

### Chores

- **repo:** restore CI workflows, husky pre-commit and editor settings
  <details>
  <summary>6 files</summary>

  - `.github/workflows/ci.yml`
  - `.github/workflows/release.yml`
  - `.gitignore`
  - `.husky/pre-commit`
  - `.vscode/extensions.json`
  - `.vscode/settings.json`

  </details>

## [6.4.2] - 2026-10-03

### Added

- **docs:** resolve panel emojis from scope and keywords — `scripts/docs-prepare.mjs`
- **adapters:** add Better Auth adapter with Safe Result helpers
  <details>
  <summary>7 files</summary>

  - `bun.lock`
  - `package.json`
  - `src/adapters/better-auth/better-auth.service.ts`
  - `src/adapters/better-auth/client.ts`
  - `src/adapters/better-auth/index.ts`
  - `src/adapters/index.ts`
  - `tests/better-auth.service.test.ts`

  </details>
- **docs:** summarize the last 6 releases in the what's-new panel
  <details>
  <summary>4 files</summary>

  - `docs/.vitepress/theme/components/WhatNew.vue`
  - `docs/.vitepress/theme/signals.ts`
  - `docs/.vitepress/theme/style.css`
  - `scripts/docs-prepare.mjs`

  </details>
- **adapters:** add PhotoSwipe adapter with DOM-selector options
  <details>
  <summary>6 files</summary>

  - `bun.lock`
  - `package.json`
  - `src/adapters/index.ts`
  - `src/adapters/photoswipe/index.ts`
  - `src/adapters/photoswipe/photoswipe.service.ts`
  - `tests/photoswipe.service.test.ts`

  </details>

### Documentation

- document the new adapters and refresh stale command references
  <details>
  <summary>10 files</summary>

  - `AGENTS.md`
  - `CONTRIBUTING.md`
  - `README.md`
  - `docs/.vitepress/config.ts`
  - `docs/guides/architecture.md`
  - `docs/guides/better-auth.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `docs/index.md`

  </details>
- **guides:** document the PhotoSwipe adapter
  <details>
  <summary>2 files</summary>

  - `docs/.vitepress/config.ts`
  - `docs/guides/photoswipe.md`

  </details>

### CI

- **workflows:** update pipeline configuration in 22 files
  <details>
  <summary>22 files</summary>

  - `.github/workflows/ci.yml`
  - `.github/workflows/release.yml`
  - `.gitignore`
  - `.husky/pre-commit`
  - `.vscode/extensions.json`
  - `.vscode/settings.json`
  - `bun.lock`
  - `docs/.vitepress/config.ts`
  - `docs/.vitepress/theme/components/HyperUiShowcase.vue`
  - `docs/.vitepress/theme/hyperui.css`
  - `docs/.vitepress/theme/index.ts`
  - `docs/.vitepress/theme/style.css`
  - `docs/public/hyperui/application/badges/1-dark.html`
  - `docs/public/hyperui/application/badges/1.html`
  - `docs/public/hyperui/marketing/buttons/1-dark.html`
  - `docs/public/hyperui/marketing/buttons/1.html`
  - `docs/public/hyperui/marketing/ctas/1-dark.html`
  - `docs/public/hyperui/marketing/ctas/1.html`
  - `docs/public/hyperui/neobrutalism/buttons/1-dark.html`
  - `docs/public/hyperui/neobrutalism/buttons/1.html`
  - `docs/ui-kit/hyperui.md`
  - `package.json`

  </details>

## [6.4.1] - 2026-10-03

### Build

- **bun.lock:** update dependencies or build settings in bun.lock — `bun.lock`

## [6.4.0] - 2026-10-03

### Added

- **docs:** navbar stars, version pill, new badges and what's-new panel
  <details>
  <summary>11 files</summary>

  - `.gitignore`
  - `docs/.vitepress/config.ts`
  - `docs/.vitepress/theme/Layout.vue`
  - `docs/.vitepress/theme/components/GitHubStars.vue`
  - `docs/.vitepress/theme/components/SiteVersion.vue`
  - `docs/.vitepress/theme/components/WhatNew.vue`
  - `docs/.vitepress/theme/index.ts`
  - `docs/.vitepress/theme/newBadges.ts`
  - `docs/.vitepress/theme/signals.ts`
  - `docs/.vitepress/theme/style.css`
  - `scripts/docs-prepare.mjs`

  </details>

### Documentation

- **api:** drop @deprecated symbols from the API reference
  <details>
  <summary>3 files</summary>

  - `scripts/typedoc-drop-deprecated.mjs`
  - `src/config/seo.service.ts`
  - `typedoc.json`

  </details>

### Chores

- **release:** sync version refs to v6.3.1
  <details>
  <summary>4 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`

  </details>
- **scripts:** unify dev, build and docs behind pre/post lifecycle hooks
  <details>
  <summary>6 files</summary>

  - `AGENTS.md`
  - `CONTRIBUTING.md`
  - `docs/guides/architecture.md`
  - `package.json`
  - `scripts/docs.mjs`
  - `scripts/setup-cloudflare.mjs`

  </details>
- **changelog:** repair shell-quoting artifacts in release sections — `CHANGELOG.md`

## [6.3.1] - 2026-10-03

### Documentation

- **README.md:** update documentation in 5 files
  <details>
  <summary>5 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>

## [6.3.0] - 2026-10-03

### Documentation

- **.vitepress:** keep a single UI Kit nav entry — `docs/.vitepress/config.ts`
- **agents:** document the lint gate and flat-config rule — `AGENTS.md`

### Chores

- **release:** sync version refs to v6.2.0
  <details>
  <summary>5 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>
- **tooling:** gate commits with husky and lint-staged
  <details>
  <summary>4 files</summary>

  - `.gitignore`
  - `.husky/pre-commit`
  - `bun.lock`
  - `package.json`

  </details>

## [6.2.0] - 2026-10-03

### Documentation

- **.vitepress:** merge UI Kit and katanakit-css into one nav dropdown — `docs/.vitepress/config.ts`

### CI

- **release:** drop the dist-tag job OIDC cannot authenticate — `.github/workflows/release.yml`
- **release:** add a remove-dist-tag maintenance job — `.github/workflows/release.yml`
- **release:** retry backfill publishes without provenance on tlog conflicts — `.github/workflows/release.yml`
- **release:** normalize legacy package metadata for backfill publishes — `.github/workflows/release.yml`
- **release:** unblock backfill publishes on legacy tags — `.github/workflows/release.yml`
- **release:** pin backfill publishes to the tag name — `.github/workflows/release.yml`
- **release:** backfill an existing tag through the publish-tag input — `.github/workflows/release.yml`

### Chores

- **release:** sync version refs to v6.1.0
  <details>
  <summary>5 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>

## [6.1.0] - 2026-10-03

### Documentation

- **guides:** add per-major upgrade guides
  <details>
  <summary>7 files</summary>

  - `docs/.vitepress/config.ts`
  - `docs/guides/upgrade-to/index.md`
  - `docs/guides/upgrade-to/v2.md`
  - `docs/guides/upgrade-to/v3.md`
  - `docs/guides/upgrade-to/v4.md`
  - `docs/guides/upgrade-to/v5.md`
  - `docs/guides/upgrade-to/v6.md`

  </details>
- **CHANGELOG:** add missing 6.0.5 release entry — `CHANGELOG.md`
- **CHANGELOG.md:** update documentation in 8 files
  <details>
  <summary>8 files</summary>

  - `CHANGELOG.md`
  - `README.md`
  - `docs/.vitepress/config.ts`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `docs/index.md`
  - `package.json`

  </details>

## [6.0.6] - 2026-09-27

### Documentation

- **README.md:** update documentation in 5 files
  <details>
  <summary>5 files</summary>

  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>
- **.vitepress:** update documentation in 39 files
  <details>
  <summary>39 files</summary>

  - `docs/.vitepress/config.ts`
  - `docs/ui-kit/css/core/apply.md`
  - `docs/ui-kit/css/core/breakpoints.md`
  - `docs/ui-kit/css/core/colors.md`
  - `docs/ui-kit/css/core/dark-mode.md`
  - `docs/ui-kit/css/core/tokens.md`
  - `docs/ui-kit/css/getting-started.md`
  - `docs/ui-kit/css/index.md`
  - `docs/ui-kit/css/mixins/flex.md`
  - `docs/ui-kit/css/mixins/grid.md`
  - `docs/ui-kit/css/reference/api-reference.md`
  - `docs/ui-kit/css/reference/architecture.md`
  - `docs/ui-kit/css/reference/functions.md`
  - `docs/ui-kit/css/utilities/aspect-ratio.md`
  - `docs/ui-kit/css/utilities/border-style.md`
  - `docs/ui-kit/css/utilities/colors-extended.md`
  - `docs/ui-kit/css/utilities/container.md`
  - `docs/ui-kit/css/utilities/cursor.md`
  - `docs/ui-kit/css/utilities/display.md`
  - `docs/ui-kit/css/utilities/effects.md`
  - `docs/ui-kit/css/utilities/flex-classes.md`
  - `docs/ui-kit/css/utilities/float.md`
  - `docs/ui-kit/css/utilities/font-family.md`
  - `docs/ui-kit/css/utilities/gap.md`
  - `docs/ui-kit/css/utilities/grid-classes.md`
  - `docs/ui-kit/css/utilities/interactivity.md`
  - `docs/ui-kit/css/utilities/line-height.md`
  - `docs/ui-kit/css/utilities/list-style.md`
  - `docs/ui-kit/css/utilities/margin.md`
  - `docs/ui-kit/css/utilities/object.md`
  - `docs/ui-kit/css/utilities/overflow-direction.md`
  - `docs/ui-kit/css/utilities/padding.md`
  - `docs/ui-kit/css/utilities/position-values.md`
  - `docs/ui-kit/css/utilities/tables.md`
  - `docs/ui-kit/css/utilities/text-decoration.md`
  - `docs/ui-kit/css/utilities/text-transform.md`
  - `docs/ui-kit/css/utilities/typography.md`
  - `docs/ui-kit/css/utilities/visibility.md`
  - `docs/ui-kit/index.md`

  </details>

## [6.0.5] - 2026-09-27

### Documentation

- **CHANGELOG.md:** update documentation in 6 files
  <details>
  <summary>6 files</summary>

  - `CHANGELOG.md`
  - `README.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`

  </details>

## [6.0.4] - 2026-09-27

### Documentation

- **AGENTS.md:** update documentation in 10 files
  <details>
  <summary>10 files</summary>

  - `AGENTS.md`
  - `CHANGELOG.md`
  - `CONTRIBUTING.md`
  - `README.md`
  - `docs/guides/architecture.md`
  - `docs/guides/filesystem.md`
  - `docs/guides/getting-started.md`
  - `docs/guides/roadmap.md`
  - `package.json`
  - `scripts/generate-release-notes.mjs`

  </details>

## [6.0.3] - 2026-09-27

### Changed

- **Release pipeline simplified** — `scripts/bump-version.mjs` and the `bump:patch|minor|major|sync` scripts are gone. Versioning is plain `npm version`, and `generate-release-notes.mjs` now carries the two things the old script did: `--write` inserts the `[X.Y.Z] - date` section from the commits since the previous tag, and `--sync-versions` refreshes every version pinned in prose.
- **`bun run build` refreshes every version reference** — it ends in `--sync-versions`, so `package.json`, the CDN pins in the README and Getting Started, the roadmap heading and the filesystem guide always name the newest tag. The call is idempotent: unchanged files are not rewritten.
- **`release:minor` and `release:major` removed** — `useGit release create` already computes the bump level from Conventional Commits, so one `release` script (build → changelog → publish) covers the whole path.
- **`release.yml` rebuilt on `npm version`** — the workflow no longer needs the deleted script; it versions, writes the changelog, publishes with OIDC and creates the GitHub release.
- **`.github/workflows/deploy.yml` untracked** — it kept failing with `Deploy failed`. Docs deploy locally with `bun run cf:deploy`; `ci.yml` and `release.yml` stay.

## [6.0.2] - 2026-09-27

### Added

- **`dummyJsonApiConfig`** — the dummyjson.com API definition exported as plain data, so importing the module runs nothing. Register it with `defineApiConfig(dummyJsonApiConfig)` before any `useDummyJson*` handler.

### Breaking

- **`useInitDummyJson()` removed** — it took no arguments and did exactly one thing: call `useInitApis` with a fixed preset. A function you configure by calling it with nothing was noise, and it delegated to an already-deprecated API. The definition is now data you pass to `defineApiConfig`, which is the pattern the rest of the library uses:

  ```ts
  import { defineApiConfig } from "katanakit-js";
  import { dummyJsonApiConfig, useDummyJsonProducts } from "katanakit-js/adapters/bun";

  defineApiConfig(dummyJsonApiConfig);
  ```

  Migration is a rename: `useInitDummyJson()` → `defineApiConfig(dummyJsonApiConfig)`. Updated in `src/adapters/bun/main.ts`, `server.ts` JSDoc, `tests/bun.adapter.test.ts` and the Bun adapter guide.

## [6.0.1] - 2026-09-27

### Added

- **`useFetch` takes URL options at the top level** — `params`, `query` and `ignoreDefaultQuery` now sit next to `method`/`headers`/`body`, the same shape as `useGet`, `useRequest` and Nuxt's `useFetch`, so nothing has to be nested:

  ```ts
  useFetch("api", "byId", { method: "GET", params: { id: 25 }, query: { limit: 2 } });
  ```

  The old `urlOptions: { … }` nest keeps working; when both are given the flat keys override it **key by key**, so a flat `params` and a legacy `query` combine instead of one replacing the other. `FetchOptions` did gain a type parameter for `transform`: it defaults to `any` (not `unknown`) precisely so a bare `FetchOptions` — or one stored in a variable and passed through a wrapper — stays assignable to `FetchOptions<T>` and existing callers keep compiling.

- **`useFetch` `transform` option** — maps the parsed response body to `T` before it is returned (`(input) => T | Promise<T>`). It runs on successful responses only, and a failing transform comes back as a `Transform Error` Safe Result instead of escaping `useFetch`, so the never-throws contract holds.

### Changed

- **`FetchOptions.urlOptions` deprecated** — pass `params`/`query`/`ignoreDefaultQuery` at the top level instead. The nest is now only a compatibility shim and is scheduled for removal in the next major; every call site inside the library (adapters, DummyJson, `useGet`/`usePost`/…) already uses the flat form.

- **`useBuildApiUrl` deprecated in favour of `useBuildUrl`** — it was a behaviourally identical wrapper with zero real usage, and the Getting Started guide had its deprecation comment backwards (it marked `useBuildUrl` as legacy while the README, the examples and all three tests use it). The guide now teaches `useBuildUrl`, and its JSDoc was rewritten to lead with the answer to *when do I use this*: it is `useFetch` minus the fetch — same registry, same `:param` and `query` handling, but it returns a string instead of requesting. It also documents why it throws rather than returning a Safe Result (it is synchronous and never leaves the process).

## [6.0.0] - 2026-09-27

### Added

- **`define*Config` config-file entry points** — every service that takes configuration can now be declared in one call that registers it and hands it back, Nuxt/Astro `defineNuxtConfig`-style, with no second `useInit*` step:

  ```ts
  // katanakit.config.ts
  export default defineApiConfig({
    pokeapi: { baseUri: "…", endpoints: { users: "/users" } }, // props
    debug: true, // booleans
    getPokemon: async function () {
      // methods — `function`, never arrows
      return useFetch("pokeapi", "byId", { params: { id: 25 } });
    },
  });
  ```

  The call returns a facade — `config` carries the props and flags, and your methods sit next to it, so `import api from "./katanakit.config.js"` registers the config on import and `await api.getPokemon()` chains your methods. Inside them `this.config` resolves to the same object (declare them with `function`: arrow functions have no `this`, and TypeScript reports it).

  - `defineApiConfig` (main barrel), `defineNotionConfig`, `defineWordPressConfig`, `defineInsforgeConfig` also accept consumer-declared methods.
  - `defineTelegramConfig`, `defineWhatsAppConfig` are config-only: they accept their config type and nothing else, so a method there is a compile error.
  - For `defineApiConfig` only entries shaped like `{ baseUri, endpoints }` reach the registry — boolean flags stay on `config` for your methods to read, and any other object throws a typed error instead of registering garbage.
  - Shared types `ConfigFacade`/`ConfigData`/`ConfigMethod`/`ConfigValues`/`ApiConfigValue` and the runtime helper `useSplitConfig` live in `src/types/index.ts` and `src/core/services/utils.service.ts`. No new files were added; each `define*Config` sits next to the `useInit*` it replaces.

### Breaking

- **`useInit*` replaced by `define*Config` as the public configuration API** — this is the 5.2.0 → 6.0.0 jump. Every config entry point (`useInit`, `useInitApis`, `useInitNotion`, `useInitWordPress`, `useInitTelegram`, `useInitWhatsApp`, `useInitInsforge`) now has a `define*Config` counterpart that registers the config **and** returns it in one call, so a whole file can be `export default define*Config({ … })` with no second step.

  The old names are still exported and marked `@deprecated`, so existing call sites keep compiling — but they are no longer the documented API, and their "not configured" errors now point at the `define*Config` replacement. Code written against 5.2.x should move to `define*Config` before the aliases are removed in the next major.

  - `IFetchApiManager`, `INotionService` and `IWordPressService` carry the same `@deprecated` marks on their `useInit*` members.

## [5.2.0] - 2026-09-26

### Added

- **File hash helpers** (`useHashFile`, `useVerifyFileHash`) — streaming md5/sha1/sha256/sha512 checksums with Safe Results, plus the Zod-inferred `FileHashAlgorithm` type.
- **Safe Result helpers** — generic `SafeResult<T, E>` type (now the base of `FilesystemResult`, `AstroServiceResult`, `AiResult` and `RssResult`), plus `useAttempt()` (runs sync/async operations and normalizes any throw into `{ data, error, ok }`; its error mapper defaults to `useErrorNormalize()`), `useTryJsonParse()` (non-throwing JSON) and `useErrorNormalize()` (coerces SDK errors, `Error` instances and strings into `ApiError`, reading `message`/`status`/`statusCode`/`details`). Ad-hoc `try/catch` was removed or centralized across the library: the nested storage `getItem` guard, the duplicated HTTP body reader, the dead guards in reactive storage signals, the Notion config throw (now a null-config Safe Result), all ten InsForge boundaries (collapsed into a single internal `run()` helper) and the Notion/WordPress fetch boundaries (now `useAttempt` + one local `apiError()` helper each). Guarded error payloads: HTTP error bodies are capped at 32 KB, string error `details` at 2000 chars, JSON-parse messages at 300, and InsForge only exposes a sanitized `{ name, message, statusCode }` clone instead of the live SDK error object.
- **Docs build hardening** — new `scripts/docs.mjs` runner (`docs:dev`/`docs:build`/`docs:gh`/`docs:clean`) takes an exclusive lock in `.cache/docs.lock.json`, clears stale locks, purges `.vitepress/.temp` before builds and fails with actionable guidance when the VitePress dev server and a build would otherwise race over the shared temp directory (the old `Cannot find module '…/.vitepress/.temp/…'` failure). `docs:prepare` uses the local TypeDoc binary (no unpinned `bunx` download), validates the generated sidebar in its cache check and writes the changelog page atomically; `docs-publish` preflights the dist directory and distinguishes a missing `gh-pages` branch from auth failures. `.gitignore` now covers `.vitepress/.temp`, the stray root `.vitepress/`, `.codegraph/`, `.wrangler/` and `.dev.vars`.
- **Error Handling guide** — new `docs/guides/errors.md` documenting the Safe Result contract, `useAttempt`/`useTryJsonParse`/`useErrorNormalize`, the normalization rules and when *not* to use them, linked from the sidebar, architecture, getting-started and the home page.
- **Katana UI foundations (`@katanakit/ui`, private workspace)** — framework-agnostic `useButton`/`useButtonClass`, `useInput`, `useCard`, `useBadge` and `useAlert` (variants, sizes, loading state, accessible label/help/error wiring and dismissal) styled with `katanakit-css` tokens and `data-theme` dark mode. The package ships a self-contained `@katanakit/ui/styles.css` build, VitePress pages with live demos under UI Kit → Components, and jsdom tests. Not published to npm yet.

### Changed

- **Docs site migrated to VitePress** — sources live in `docs/` and are served at `docs.senseikatana.com/*` (old `/docs/*` links redirect via `_redirects`). The API reference is TypeDoc-generated (`docs/api/` + sidebar JSON) and the changelog page is materialized from `CHANGELOG.md` by `scripts/docs-prepare.mjs`, which skips TypeDoc when `src/` is unchanged. Pages keep YAML frontmatter (`title`, `description`) so Obsidian reads them as properties; JS/TS is embedded with `<script setup lang="ts">` (Vue-in-Markdown — VitePress has no MDX).
- **Repository cleanup** — removed the `playground/` workspace, the intermediate MkDocs tooling (`mkdocs.yml`, `hooks/`, Python) and the stale `content/` tree; the repo now has a single docs site and no extra workspaces. Deploy, CI, `setup-cloudflare.mjs` and docs were updated accordingly; the manual `bun run docs:gh` command keeps an Action-free gh-pages preview.

## [5.1.1] - 2026-09-26

### Added

- **Filesystem service (Node/Bun)** (`useReadFile`, `useReadFileBuffer`, `useWriteFile`, `useAppendFile`, `useReadJsonFile`, `useWriteJsonFile`, `useReadDir`, `useEnsureDir`, `useFileExists`, `useGetFileStats`, `useCopyFile`, `useMoveFile`, `useRemoveFile`, `useRemoveDir`) plus path helpers (`useGetDirname`, `useResolvePath`, `useJoinPath`, `useGetRelativePath`, `useGetBasename`, `useGetFileExtension`, `useGetCwd`, `useIsNode`) and module-relative readers (`useReadModuleFile`, `useReadModuleJson`, the `__dirname` pattern without `__dirname`). `node:fs/promises`/`node:path` load through dynamic `import()`, every fallible call returns a Safe Result with the native errno `code` (`ENOENT`, `EACCES`, …), and browsers/Workers get `ERR_FS_UNAVAILABLE` instead of a crash. `useReadJsonFile`/`useReadModuleJson` accept an optional Zod schema for boundary validation.
- **Faker service** (`useFakeUuid`, `useFakeEmail`, `useFakeFullName`, `useFakeFirstName`, `useFakeLastName`, `useFakePhone`, `useFakeCompanyName`, `useFakeUrl`, `useFakeText`, `useFakeNumber`, `useFakeBoolean`, `useFakeDate`, `useFakeVehicle`, `useFakeList`, `useFakeSeed`, `useFakeSetDefaultRefDate`) — generic fake data for tests, seeds and forms. `useFakeSeed(seed?)` sets (or rolls and returns) a seed, `useFakeSetDefaultRefDate()` pins relative dates, and `useFakeList(factory, count)` passes the index for relations. `@faker-js/faker` is an **optional peer dependency** loaded through dynamic `import()`, so it never enters the initial bundle.

## [5.1.0] - 2026-09-24

### Added

- **SmartVideo media service** (`useParseMediaSource`, `useBuildVideoEmbed`, `useGetYoutubeVideoId`, nocookie embed + thumbnail builders) — one `src` renders native `<video>` for direct files or a click-to-play facade `<figure>` for YouTube/Vimeo, plus `useEnhanceVideoFacades` hydration in infrastructure.
- **YouTube channel service** (`useInitYoutube`, `useGetChannelVideos`, `useGetVideoDetails`, `useGetUploadsPlaylistId`) — quota-cheap listing via `channels` → `playlistItems` (never `search.list`), and keyless RSS fallback (`useGetChannelVideosRss`, `useParseYoutubeRss`). One GCP project serves every repo; call server/build-time and cache.
- **Zod validation, framework-agnostic** (`zod` dependency, `katanakit-js/schemas` subpath) — runtime schemas for media, YouTube, RSS, AI wire shapes and common unions/errors; `src/types/` now infers via `z.infer` so consumer imports don't change. New `useValidate()` returns a Safe Result instead of throwing, and the YouTube service validates every API response at the boundary (malformed payloads → typed `502`, not garbage data).
- **Zod coverage across the whole library** — schemas now also cover core data shapes (geometry, viewport, currency, dates, agent/assistant payloads), access control (roles, capabilities, subjects) and both REST adapters. Every inferable data type in `src/types/` is now derived from a schema; contracts with methods, generics and callbacks intentionally stay as interfaces.
- **WordPress and Notion runtime validation** — responses are validated with loose schemas (extra keys like `_links`/`_embedded` are preserved), inputs are validated before any network call (`400`), malformed payloads return a typed `502` with per-field `details`, and update payloads support WP partial responses via response variants.
- **InsForge adapter** (`katanakit-js/adapters/insforge`, optional `@insforge/sdk` peer) — database fallback with `useIfSelect`/`useIfInsert`/`useIfUpdate`/`useIfDelete`/`useIfRpc`, storage (`useIfUpload`, `useIfDownload`, `useIfRemove`, `useIfListObjects`, `useIfGetPublicUrl`) and edge functions (`useIfInvokeFunction`). Mass writes are refused (update/delete require non-empty filters), inputs are Zod-validated, and the whole surface returns Safe Results.

### Changed

- **WordPress `WpEmbedded["wp:featuredmedia"]`** is now a loose partial shape instead of `WpMedia[]` (embedded media never nests `_embedded`); this breaks the runtime Zod schema cycle while keeping `source_url`/`id`/`title` typed.

### Fixed

- **SEO `SiteConfig` errors name the missing field** — `useSeoTag`, `useGenerateMetaTags`, `useHeadTags`, `useRssHeadLink` and `useSeoMeta` defaults now throw `[Seo] SiteConfig.seo is required` / `[Seo] SiteConfig.rss is required` (with the caller name) instead of `Cannot read properties of undefined (reading 'noindex')`. `nav` stays optional.

## [5.0.1] - 2026-09-22

### Changed

- **Docs build maintenance** — dependency/build update in the docs workspace; published to npm as 5.0.1.

## [5.0.0] - 2026-09-22

Version alignment release (GitHub tag only; superseded by 5.0.1).

## [4.0.4] - 2026-09-22

Version-only release. No functional changes vs 4.0.3.

## [4.0.3]

### Changed

- **Query layer now runs on TanStack Query Core** — `@tanstack/query-core` ships as a dependency (no separate install). The full engine is re-exported from `katanakit-js` (`QueryClient`, `QueryObserver`, `MutationObserver`, `focusManager`, `onlineManager`, `dehydrate`/`hydrate`, `keepPreviousData`, and every type), and the framework adapters (`useQuery`/`useMutation` for React, Vue, Solid, Svelte and Angular) are now thin bindings over it, returning TanStack's native result object — `isPending`, `isFetching`, `isSuccess`, `isError`, `data`, `error`, `status`, `fetchStatus`, `refetch`, `mutate`, `reset`. This replaces the hand-rolled `QueryClient`/`QueryCache`, which had correctness gaps (no-op `invalidateQueries`, blocking refetch instead of stale-while-revalidate, dead `refetchOnWindowFocus`/`refetchOnReconnect`, incomplete cancellation) and lacked infinite queries, optimistic updates, SSR hydration and devtools.

### Added

- **Framework-free query adapter** (`katanakit-js/adapters/vanilla`) — pure TypeScript with no framework. Returns the raw `QueryObserver` / `MutationObserver` so you own the subscribe/render loop (DOM, canvas, CLI, worker). The framework adapters are the same plus a reactivity bridge.
- **Query examples** — `examples/query/` ships a runnable vanilla walkthrough (`bun run examples/query/vanilla.ts`) plus React, Vue, Solid, Svelte and Angular demos, and a README explaining every helper (`useQuery`, `useMutation`, `useSafeQueryFn`, `useQueryClient`, `useInitQueryClient`, `useCreateQueryClient`).
- Every adapter subpath now also re-exports the client helpers (`useQueryClient`, `useInitQueryClient`, `useCreateQueryClient`, `useSafeQueryFn`), so each framework is a complete, independent entry point.
- **`useSafeQueryFn` helper** — bridges KatanaKit's Safe Result (`useGetApi`/`useFetch`) into TanStack's throw-on-error `queryFn`. It receives TanStack's `QueryFunctionContext`, so `signal` can be forwarded for real request cancellation.
- **`useCreateQueryClient` helper** — creates a fresh `QueryClient` per call. Use it on the server (SSR) to keep one cache per request instead of the module-level singleton (`useQueryClient()` stays the browser default).

### Security

- `useSafeQueryFn` now throws a real `Error` carrying only `message` + `status`; the upstream response body (`ApiError.details`) is no longer attached to the error or persisted in the query cache.
- `useInitQueryClient` clears the previous client's caches before swapping the singleton.
- `@tanstack/query-core` is pinned to an exact version.

## [4.0.2] - 2026-09-22

Version-only re-release. No functional changes vs 4.0.1.

## [4.0.1]

### Added

- **Bun server adapter** (`katanakit-js/adapters/bun`) — a Bun-native alternative to Express built on `Bun.serve` with the `routes` API (Bun v1.2.3+). Ships a dummyjson.com demo: typed route table (`useBuildDummyJsonRoutes`), HTTP handlers over the core `useFetch` (`useDummyJsonProducts`, `useDummyJsonProductById`, `useDummyJsonProductSearch`, `useDummyJsonUsers`, `useDummyJsonPosts`, `useDummyJsonRandomQuote`, …), offline seed data (`useGetDummyJsonSeed`), and a singleton server facade (`useBunCreate`/`useBunStart`/`useBunGetServer`/`useBunStop`). Run locally with `bun run bun:dev`.

### Breaking

- **Logger API simplified** — `useLogger` now takes `(message, data?, level?)` with levels reduced to `log | warn | error` (removed `info`/`debug`). The Strategy abstraction (`LogStrategy`, `ConsoleStrategy`, `useSetLogLevel`, `useSetStrategy`) and `useLog` were removed; logging maps directly onto the native `console`.

### Changed

- **Renamed `docs/` → `guides/`** — the Docusaurus site is now the `guides` workspace (`katanakit-guides`); deployment paths, scripts, `sync-docs-releases.mjs` and the Docusaurus config (`path: "content"`, TypeDoc `out`) were updated.
- **Prettier + ESLint as lint/format** — added `.vscode/settings.json` + `extensions.json` (Prettier default formatter, Biome disabled), formatted the whole codebase, removed stale `biome-ignore` comments and the redundant `eslint-config-prettier`.
- **Reduced `package.json` scripts** — removed broken/redundant scripts (`bump:all`, `assistant:demo`, `api:demo`, `notes`, `dev:adapters`) and dropped husky/lint-staged (the pre-commit hook could not find `.git` in the monorepo).

### Fixed

- **`invalidateQueries` prefix matching** — now matches query keys by array prefix instead of serialized string, so invalidating `["users"]` correctly invalidates `["users", 1]`.
- **XSS hardening in `useSetAttribute`** — `srcdoc` is now rejected outright (a regex cannot safely sanitize entity-encoded HTML); `data:` URIs are restricted to raster images (`png|jpg|gif|webp`).
- **Pagination caps** — `useWpListAllPosts`, `useNotionListAllBlockChildren` and `useNotionListAllDatabasePages` now default to `maxItems = 1000`.
- **Express `app` export is now lazy** — importing `katanakit-js/adapters/express` no longer builds the app as a side effect.
- **Restored CI + release workflows** — `.github/workflows/ci.yml` and `release.yml` (OIDC trusted publishing) were recreated.
- **Removed dead code** — the broken `ErrorService` singleton and the Astro re-export from the main barrel.

## [4.0.0] - 2026-09-20

### Added

- **Framework adapters for React, Solid, Svelte and Angular** — new optional subpaths (`katanakit-js/adapters/react`, `katanakit-js/adapters/solid`, `katanakit-js/adapters/svelte`, `katanakit-js/adapters/angular`) exposing `useQuery`, `useMutation`, `useRequest`, and `useWatch` over the core `QueryClient` and HTTP layer, each with the framework's native reactivity: React hooks (`useState`/`useEffect`), Solid signals, Svelte readable stores, and Angular signals (injection-context aware via `DestroyRef`). All adapters share the global query cache, so data is shared across frameworks.
- **`useRequest` renamed from `useKatanaFetch`** — the Vue reactive-fetch composable is now `useRequest` for brevity and consistency across adapters. `useKatanaFetch` remains as a deprecated alias.
- **Interactive playground** — Vue 3 + Vite dev environment (`playground/`) for testing library features in-browser. Run with `pnpm playground:dev`. Includes demos for `useRequest`, `useQuery`, `useWatch`, and `useBuildUrl` with real API calls (PokeAPI, JSONPlaceholder).
- **Notion REST API adapter** (`katanakit-js/adapters/notion`) — typed client for the Notion API with `useInitNotion` for token registration. Covers Pages (get, create, update, archive), Blocks (get, get children, append, update, delete), Databases (get schema, query, create, update), Users (get, list), and Search. Includes auto-pagination helpers: `useNotionListAllBlockChildren` and `useNotionListAllDatabasePages` that handle cursor-based pagination automatically. All functions return `FetchResult<T>` (safe result pattern).
- **WordPress REST API adapter** (`katanakit-js/adapters/wordpress`) — typed client for the WordPress REST API with `useInitWordPress` supporting Application Passwords, JWT, Basic Auth, and nonce-based authentication. Covers Posts, Pages, Media (with file upload via `useWpUploadMedia`), Categories, Tags, Comments, Users, and Custom Post Types with full CRUD operations. Includes batch operations (`useWpBatch`), auto-pagination (`useWpListAllPosts`), search (`useWpSearchAllPosts`), and slug-based routing (`useWpFindPostBySlug`). All functions return `FetchResult<T>`.
- **WordPress `_fields` support** — new `WpQueryParams._fields` parameter to limit response fields, reducing payload by 60-80% for list views. Supports nested field selection: `"id,title,link"` or `"id,title.rendered,acf.hero_image"`.
- **WordPress `_embed` as string** — `WpQueryParams._embed` now accepts `boolean | string` for selective resource embedding: `"_embed: author,wp:featuredmedia"` embeds only author and featured media. Typed `WpEmbedded` interface for `_embedded` responses with proper `author[]`, `wp:featuredmedia[]`, `wp:term[][]`, and `replies[][]` types.
- **WordPress ACF (Advanced Custom Fields) support** — `WpAcfFields` type for ACF field data on posts, pages, media, taxonomies, users, and options. ACF fields are accessible via `post.acf?.field_name` when using `_fields: "id,acf"`.
- **WordPress `media_details` complete types** — added `filesize`, `image_meta` (EXIF data), and complete `sizes` structure with `file`, `mime_type`, and `filesize` per size.
- **Vue and Nuxt framework examples** — SFC examples for blog listings and dynamic `[slug]` routes using `useQuery` (Vue) and `useAsyncData` (Nuxt) with SSR support.
- **Framework examples** — Astro and Next.js (React) demos for both adapters showing real-world usage: blog listings, dynamic `[slug]` routes, database queries, block rendering, media uploads, and taxonomy management. Examples live in `examples/notion/` and `examples/wordpress/`.

### Changed

- **npm v12 security hardening** — added `.npmrc` with `allow-scripts=` to block dependency lifecycle scripts (npm v12 default). Added `.github/workflows/release.yml` with OIDC trusted publishing for automated releases without long-lived NPM_TOKEN. Updated AGENTS.md with new release workflow and security notes.
- **Improved documentation** — expanded `useBuildUrl` section with real-world use cases (navigation links, image URLs, third-party libraries, debugging, SSR), updated `CONTRIBUTING.md` to reflect current tooling (pnpm), added contribution invitation to README.
- **Kitt AI assistant documentation** — added "When to use Kitt" and "When to use alternatives" comparison table with links to Vercel AI SDK, LangChain, CrewAI, and Botpress.

### Fixed

- **Query cache** — `fetchQuery` no longer reuses the placeholder `queryFn` from `subscribe()` (which returned empty data); the error state is no longer corrupted to `[object Object]`; `cancelQueries` now actually cancels.
- **SSRF** — `useFetch` fails closed on redirects (`redirect: "error"`).
- **DOM sanitizer** — blocks `data:`, `vbscript:` and control-character scheme bypasses.
- **Prisma subpath** — importing `katanakit-js/prisma` no longer throws without `DATABASE_URL` (lazy client).
- **Notion/WordPress** — return Safe Results when unconfigured; WordPress nonce auth now sends the cookie.
- **SSR guards** — `useCopyToClipboard` and storage access are now SSR-safe.

## [3.1.0] - 2026-09-14

### Added

- **Generic `useKatanaWatch` / `useWatch` composables** — watcher in `katanakit-js/adapters/vue` (re-exported from `katanakit-js/adapters/nuxt`) wrapping the native Vue `watch` with `deep: true` by default. Props (`WatchSource`, `WatchCallback`, `WatchOptions`, `WatchStopHandle`) are taken from the native `watch` and live in `src/types/`; the callback accepts any internal function (sync/async, with or without args). Accepts a ref, reactive object, getter function or array of sources, stops automatically on unmount, and powers use cases like revalidating a form (`safeParse` with Zod, Valibot, Standard Schema or custom validators) on every nested change. Schema-agnostic types (`FieldErrors`, `ValidationSchema`) also live in `src/types/`.

## [3.0.1] - 2026-09-13

### Fixed

- **`express-rate-limit` was imported by the assistant adapter but never declared** — the published package crashed with `ERR_MODULE_NOT_FOUND` for consumers of `katanakit-js/adapters/assistant`. It is now a runtime dependency (`8.7.0`, which ships its own types); the deprecated `@types/express-rate-limit` stub was removed.
- **Prisma client was initialized eagerly on import** — `src/prisma/use-prisma.ts` exported a module-level `prisma` instance that threw on import when `DATABASE_URL` was missing, breaking any app that imported `katanakit-js/prisma` and making the documented `usePrismaClient(url)` override unusable. The eager export was removed (it was not re-exported from any barrel, so this is non-breaking).
- **Release cards never badged `major`** — the version regex in `scripts/sync-docs-releases.mjs` was double-escaped, so `x.0.0` releases rendered as `Minor release`. Fixed and regenerated.

### Changed

- **Migrated the repository from Yarn 4 to pnpm 12** — `packageManager` pinned to `pnpm@12.4.1`, `pnpm-lock.yaml` replaces `yarn.lock`, workspace declared in `pnpm-workspace.yaml` (replacing the `workspaces` field), Yarn `resolutions` moved to pnpm `overrides`, CI uses `pnpm/action-setup` + `pnpm install --frozen-lockfile`, Husky pre-commit runs `pnpm lint-staged`, and all docs/config/scripts references updated. Release bumping now goes through `scripts/bump-version.mjs` (pnpm's `version` refuses a dirty working tree).
- **`.gitignore` now ignores all `.env*` variants** (previously only the exact `.env`), with `.env.example` still tracked.

## [3.0.0] - 2026-09-13

### Breaking

- **Prisma model `User` renamed to `Account`** (`@@map("accounts")`); `Post.author` now points to `Account`. Consumers of `katanakit-js/prisma` must switch `db.public.User` to `db.public.Account`. Table rename `users` → `accounts` requires a migration on live databases.

### Added

- **Access-control service** — pure role/capability registry in `src/core/services/access.service.ts` with hierarchy-based inheritance: `owner` > `admin` > `editor` > `author` > `member` > `guest`. Exposes `useCan`, `useHasRole`, `useCapabilitiesFor`, `useRegisterRole`, `useRoles` and `useResetRoles`. Types (`AccessRole`, `AccessCapability`, `AccessRoleDefinition`, `AccessSubject`, `IAccessService`) live in `src/types/`.
- **Express access guard** — `useRequireCapability(capability, resolveSubject)` in `katanakit-js/adapters/express` builds a `RequestHandler` that returns 401 for anonymous requests and 403 when the capability is missing. Plugs into the existing `guard` seam of the assistant router; unwired by default.

### Changed

- **Docs releases automated** — `scripts/sync-docs-releases.mjs` generates the homepage release cards, the docs changelog and the navbar Releases dropdown from git tags + Conventional Commits. `yarn docs:build` syncs first; CI runs `yarn docs:check` and fails on drift. The navbar now lists the latest 8 release tags with direct links to GitHub.
- **Merge-into-dev-first workflow** — feature branches must be merged into `dev` (`git checkout dev && git merge <branch>`) before any PR; PRs to `main` come only from `dev`. Documented in `AGENTS.md`.

## [2.15.0] - 2026-09-13

### Added

- **QueryClient** — `QueryClient` + `QueryCache` built on the reactive kernel. Features: cache with GC, query keys, stale-while-revalidate, retry with exponential backoff, deduplication, invalidation, refetch-on-window-focus, and `prefetchQuery`. Integrates with the existing API manager (`useFetch`, `useGetApi`) and Safe Results pattern.
- **Vue `useQuery` / `useMutation` composables** — reactive composables in `katanakit-js/adapters/vue` that wrap the QueryClient with Vue 3 reactivity (`data`, `error`, `isLoading`, `status`, `refetch`, `mutate`).
- **Husky + lint-staged pre-commit hook** — runs `eslint --fix` on staged `src/**/*.ts` files before every commit (installed via `yarn install`). Prevents lint failures from reaching CI.
- **`AGENTS.md`** — compact instruction file for AI agents (commands, architecture, git/CI workflow, Prisma skills).

### Added (Tests)

- 13 new tests for QueryClient (`tests/query.service.test.ts`) — 127 tests total.

### Changed

- **Replaced Biome with ESLint + Prettier** — migrated linting and formatting from Biome 2.5.12 (Rust, 38ms) to ESLint 10 + Prettier 3.9 (JS, ~4.3s). Same rules enforced: tabs, double quotes, semicolons, trailing commas, import sorting (`eslint-plugin-simple-import-sort`), recommended lint rules. TypeScript 7.0 has no compiler API; aliased `typescript` to `@typescript/typescript6@6.0.2` for type-aware linting. `tsc6` replaces `tsc` for type checking.
- **CI matrix `fail-fast: false`** — the Node 22/24 jobs now run to completion even if one version fails, so a failure on one version no longer cancels the other.

## [2.14.2] - 2026-09-13

### Added

- **Katana UI documentation** — new docs section describing the planned framework-agnostic UI kit: vision, layered architecture, full inventory (dashboards, e-commerce, apps, auth, blocks, layouts, interactions, charts and themes), LLM files strategy and delivery roadmap.
- **Navbar theme switch** — the docs site replaces the default color mode button with a checkbox switch (swizzled `ColorModeToggle`) with keyboard focus, reduced-motion support and pre-hydration styling.

### Changed

- Docs sidebar includes a UI Kit category, and the toolkit roadmap links to it.

## [2.14.1] - 2026-09-10

### Changed

- **Pinned all dependency versions** to exact (removed `^`/`~` ranges) for deterministic installs and supply chain safety.
- Added `resolutions` for transitive floating deps: `pathe@2.0.3`, `jsbi@4.3.2`.

### Removed

- Removed unused `@types/bun` dev dependency.

### Added

- Added `socket.yml` for Socket.dev supply chain security configuration.

## [2.14.0] - 2026-09-10

### Added

- **Kitt AI agent system** — OpenAI-compatible provider with tool-calling loop, session management, and conversation store. Built on a generic `AgentService` that handles system prompts, tool registration, and iterative LLM interaction until task completion.
- **REST assistant adapter** (`katanakit-js/adapters/assistant`) — `POST /chat` for sending messages, `GET /sessions` for listing conversations, `DELETE /sessions/:id` for cleanup. Includes auth guard, per-session context, and conversation persistence.
- **Telegram adapter** (`katanakit-js/adapters/telegram`) — long-polling bot via `getUpdates`, `sendMessage` reply with Markdown formatting, BotFather integration guide. Configurable polling interval and error handling.
- **WhatsApp adapter** (`katanakit-js/adapters/whatsapp`) — Meta Cloud API webhook receiver, HMAC signature verification (`X-Hub-Signature-256`), rate limiting (60 req/min), and async message processing with `messages.update` / `messages.received` event types.
- **Prisma conversation store** — `Conversation` + `Message` models in `prisma/schema.prisma` with session tracking, timestamps, and message history. New `assistant.store.ts` service for create/list/get/delete operations.
- **GitHub Actions CI** — `.github/workflows/ci.yml` runs lint, typecheck, build, and 114 tests on Node 22 and 24.
- **Rate limiting** — `express-rate-limit` on assistant routes (20 req/min) and WhatsApp webhook (60 req/min) with standard rate-limit headers.
- **`examples/assistant/`** — full demo with knowledge base, system prompt, and session management.
- **`examples/agent/`** — agent demo showing tool-calling loop with multiple registered tools.
- New test suites: `agent.service.test.ts`, `assistant.service.test.ts`, `telegram.service.test.ts`, `whatsapp.service.test.ts`, `express.server.test.ts` — 114 tests total.

### Changed

- **Express server restructured** — idempotent `create()`/`finalize()` pattern prevents double-initialization; `rawBody` capture via `verify` callback for signature verification; route ordering fix so static paths match before parameterized routes.
- **Type definitions expanded** — new agent, assistant, and adapter types in `src/types/index.ts` covering `AgentConfig`, `ToolDefinition`, `SessionMessage`, `AssistantConfig`, `TelegramConfig`, `WhatsAppConfig`, and webhook event types.
- **Prisma schema updated** — new `Conversation` and `Message` models; schema types regenerated.

### Fixed

- **Timing-safe HMAC comparison** — WhatsApp signature verification uses `crypto.timingSafeEqual` instead of string `===` to prevent timing attacks.
- **HTTPS enforcement** — WhatsApp webhook rejects non-HTTPS requests in production.
- **Path confinement** — file operations in storage service restricted to project root to prevent directory traversal.
- **Per-tool error capture** — agent tool failures are captured individually without crashing the entire tool-calling loop.
- **Build output directory** — `outDir` in `tsconfig.json` corrected; `yarn clean` ensures clean builds before each release.

## [2.0.0] - 2026-09-03

Developed and published as `katanakit-dev`.

### Added

- **Reorganized the project** with hexagonal architecture into `types/`, `core/services/`, `infrastructure/`, `adapters/`, `config/`, and `prisma/`.
- Exposed the public API through barrel files (`src/index.ts` and per-layer `index.ts`).
- Added Vitest unit tests for the HTTP client, logger, storage, DOM, and reactive services.
- Added English documentation (`README.md`, `CONTRIBUTING.md`, `docs/`, `SECURITY.md`).

### Fixed

- Fixed TypeScript compile errors: broken imports, broken singleton guards (`TimingService` and `ViewportService`), the `FIND_ENTRY` scope bug in `AstroService`, and Express `Request`/`Response` typing.
- Removed all side effects on import (top-level `fetch` to dummyjson.com, `console.log` calls, storage writes and timers).
- Fixed the Express server: `listen` now uses the configured port/host, the user router is mounted, and handler `(req, res)` argument order is correct.
- Fixed the logger call sites (level is now the first argument of `useLog`).

### Removed

- Removed duplicate type definitions (unified in `src/types/`).
- Dead code, empty files and the broken signals draft.
- Moved demos to `examples/` and dropped the obsolete `wiki/` documentation.

## License

MIT
