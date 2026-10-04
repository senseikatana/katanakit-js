# Draft release notes — design-pattern refactoring

**Proposed version:** `6.5.0` (minor — new public APIs, no breaking changes; current `package.json` is `6.4.6`)
**Date:** _TBD — filled by `scripts/generate-release-notes.mjs` on release_

> Draft only. This file is **not** `CHANGELOG.md`; the real changelog section is generated
> from Conventional Commits by `bun run release`.

## Refactor

- **refactor(core)**: migrate 13 stateful services to Singleton classes with backward-compatible `use*` wrapper functions — `LoggerService`, `DatesService`, `UtilsService`, `ValidationService`, `FetchApiManager` (http), `AssistantService`, `QueryService`.
- **refactor(adapters)**: migrate `ExpressService`, `TelegramService`, `WordPressService`, `NotionService` and `InsForgeService` to the same Singleton + `use*` wrapper pattern.

Each service now exposes `getInstance()` for direct class access and `use*` methods that own its state; the module-level `use*` functions delegate to the singleton, so existing imports keep working unchanged.

## Features

- **feat(access)**: Strategy Pattern for authorization — `AccessService` now supports swappable strategies: `HierarchicalAccessStrategy` (default) and `FlatAccessStrategy`. Swap at runtime with `AccessService.getInstance().useSetStrategy(new FlatAccessStrategy())`, or create an isolated instance with `AccessService.create(strategy)` (handy in tests).
- **feat(agent)**: Strategy Pattern for AI providers — `AgentService` delegates HTTP calls to an `IAiProviderStrategy`, with `OpenAiCompatibleStrategy` as the default. Swap via `useSetStrategy()` or create isolated instances with `AgentService.create(strategy)`.
- **feat(infrastructure)**: new Decorator Pattern directory `src/infrastructure/decorators/`, re-exported from the infrastructure barrel:
  - `RetryDecorator(fn, retries?, delayMs?)` — re-runs a failing async function with a fixed delay before propagating the last error.
  - `CacheDecorator(fn, { ttlMs?, keyFn? })` — TTL memoization by argument key; the decorated function also exposes `useClearCache()` and `useCacheSize()`.
  - `LoggerDecorator(fn, label?, level?)` — traces start/ok/error with duration for sync and async functions.
  - Composable: `RetryDecorator(LoggerDecorator(flakyRequest, "flaky"), 2)`.
- **feat(query)**: Factory Pattern — `QueryClientFactory` creates per-request `QueryClient` instances for SSR (`QueryClientFactory.create()` / `createShared()`), alongside the existing `QueryService` singleton for the browser.

## Docs

- **docs(architecture)**: update `docs/guides/architecture.md` with a design-patterns table (Singleton / Strategy / Factory / Decorator), the "how the patterns fit together" section, updated conventions, and a reworked infrastructure layer section covering `decorators/`.

## Backward compatibility

All public `use*` functions keep their exact signatures and behavior — they are now thin wrappers over the singleton classes, so existing consumer code continues to work without changes. New class-based access (`getInstance()`, `create(strategy)`) and the decorators are purely additive. No breaking changes.

All gates pass: `eslint` + `tsc6 --noEmit` + `vitest` (364 tests) + `bun run build` + `bun run examples:check`.
