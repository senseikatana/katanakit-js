---
title: Roadmap
description: What is planned for KatanaKit. Contributions welcome.
---

A living list of what is planned for KatanaKit (`katanakit-js`). Contributions
are welcome — pick something and open a pull request.

Legend: `[x]` done · `[ ]` planned.

## Shipped (as of 5.2.0)

### Architecture and packaging

- [x] Hexagonal reorganization into `types/`, `core/services/`,
      `infrastructure/`, `adapters/`, `config/`.
- [x] Pure ESM: relative imports with explicit `.js` extensions,
      `module: nodenext`, `"type": "module"` and an `exports` map with subpaths
      (`katanakit-js/adapters/express`, `katanakit-js/adapters/nuxt`).
- [x] `use*` method convention across every service (only `getInstance()` is
      exempt).
- [x] Destructured, tree-shakeable exports from Singleton facades.
- [x] Single source of truth for contracts and domain types in `src/types/`.
- [x] No side effects on import; SSR-safe infrastructure adapters.
- [x] Removed TypeScript errors, import-time side effects and duplicate types.
- [x] Dependency restructure: only `@js-temporal/polyfill` as a runtime
      dependency; `express`, `cors`, `dotenv` and `vue` as
      optional peer dependencies.
- [x] Package renamed for publication as `katanakit-js` (previously developed
      as `katanakit-dev`).

### Services and adapters

- [x] Core services: HTTP client, logger, formatter, converter, errors,
      generator, dates (Temporal), geometry, timing, data/system utilities and
      the reactive signals kernel.
- [x] Infrastructure adapters: DOM, storage, viewport, sensors, observer
      (+ lazy loader), worker (+ pools) and theme.
- [x] Astro adapter (`AstroService`) for `getStaticPaths`.
- [x] RSS service (`RssService`) with raw XML generation and Astro `GET`
      endpoints — no external dependencies.
- [x] Site config (`SiteConfig`/`siteConfig`) and SEO module
      (`useHeadTags`, `useGenerateMetaTags`, `useTitle`, `useRssHeadLink`).
- [x] Nuxt adapter (`katanakit-js/adapters/nuxt`): `useUnwrap`,
      `useSafeResponse`, `useEventResponse`.
- [x] Vue adapter (`katanakit-js/adapters/vue`): `useRequest` composable
      (`data`, `error`, `loading`, `refetch`).
- [x] Express reference server (`katanakit-js/adapters/express`) with CORS
      restriction defaults and hardened headers.
- [x] Worker pool concurrency fixed by correlating tasks with a `taskId` echo.
- [x] `useEncrypt` generates a random salt when none is provided.

### Quality and tooling

- [x] Vitest suite (36+ files, 270+ tests) with the `@/` alias; jsdom coverage
      for the UI kit foundations.
- [x] ESLint gate (`check` = eslint + `tsc6` typecheck + vitest; `fix` auto-fixes).
- [x] Releases through GitHub Actions with npm OIDC trusted publishing
      (`.github/workflows/release.yml`) plus local `release[:minor|:major]` fallback.
- [x] English documentation: README, Getting Started, Architecture, API
      Reference, Roadmap, CONTRIBUTING, SECURITY, CHANGELOG.
- [x] Security fixes applied: URL scheme validation, DOM `on*` attribute block,
      JSON-LD `</script>` escaping, worker cleanup, generic server errors.
- [x] CI pipeline (GitHub Actions) running `check`, `build` and `examples:check`
      on push/PR to `main` and `dev`, plus a docs deploy workflow to Cloudflare.
- [x] `QueryClient` (TanStack Query Core): cache with GC, stale-while-revalidate,
      retry with backoff, deduplication, invalidation and prefetch.

## Next

- [ ] HTTP client: request interceptors and per-request cancellation plumbing
      in `FetchApiManager` (the query layer already forwards `AbortSignal`).
- [ ] Reactive: automatic dependency tracking for
      `useCreateEffect`/`useCreateMemo` (today signals are listed explicitly).
- [ ] Structured/JSON logger strategy.
- [ ] Add Vitest coverage reporting to CI.

## Later

- [ ] UI kit (Katana UI): foundations shipped (button, input, card, badge,
      alert); shells, blocks, layouts and app pages remain.
      See the [UI Kit roadmap](../ui-kit/roadmap.md).
- [ ] Deno / Cloudflare Workers compatibility pass.
- [ ] More geometry (3D solids) and unit-system conversions.
- [ ] i18n and relative-time output for `DatesService.useDiff`.
- [ ] E2E tests for the Express adapter.
- [ ] AbortController support in `useInterval`/timeout helpers.
