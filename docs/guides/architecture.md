---
title: Architecture
description: Hexagonal architecture, layer breakdown, design patterns and conventions.
---

KatanaKit follows **hexagonal architecture** (ports and adapters). The goal is a
pure, framework-agnostic core surrounded by adapters that talk to the outside
world (browser APIs, HTTP, frameworks) and a shared kernel of contracts.

The choices behind this shape — and their costs — are recorded as decision
records: [ADR-0004: Hexagonal layout with a pure core](/explanation/decisions/adr-0004-hexagonal-core),
[ADR-0002: Singleton facades](/explanation/decisions/adr-0002-singleton-facades)
and [ADR-0003: Subpath adapters](/explanation/decisions/adr-0003-adapter-subpath-exports).

```
               src/
               │
   ┌───────────▼───────────┐
   │        index.ts       │   main barrel — the public API surface
   └───────────┬───────────┘
               │
   ┌───────────▼───────────┐
   │        types/         │   shared kernel — contracts, domain types,
   │   (single source of   │   facades interfaces (I*), strategy contracts
   │        truth)         │
   └───────────┬───────────┘
               │  implements / consumes contracts
   ┌───────────▼──────────────────────────────────────┐
   │                   core/services/                 │  pure domain services
   │  logger · http · formatter · converter · error   │  (no I/O: no window,
   │  generator · dates · geometry · timing · utils   │   document, fetch, fs)
   │  reactive                                         │
   └───────────┬──────────────────────────────────────┘
               │  owned I/O lives one layer out
   ┌───────────▼──────────────────────────────────────┐
   │              infrastructure/                      │  browser/runtime adapters
   │  dom · storage · viewport · sensors              │  (guard or fall back in SSR)
   │  observer · worker · theme                        │
   └───────────┬──────────────────────────────────────┘
               │  framework-facing entry points
   ┌───────────▼──────────────────────────────────────┐
   │                  adapters/                       │  framework adapters
   │   astro/  (AstroService, RssService)            │
   │   express/ (ServerExpress reference)            │
   │   nuxt/    (pure Nuxt helpers)                  │
   │   vue/     (useRequest composable)          │
   └──────────────────────────────────────────────────┘
   │
   ├── config/   siteConfig (typed SiteConfig) + SEO helpers (seo.service.ts)
   ├── prisma/   Prisma schema, generated contract types, db client
```

## Layer-by-layer

### `types/` — the shared kernel

`src/types/index.ts` is the single source of truth for every contract and domain
type in the library: the strategy contracts (`StorageStrategy`, `ICryptoStrategy`,
`IUuidStrategy`), the facade interfaces (`IFetchApiManager`, `IFormatterService`,
`IRssService`, …) and every shared type (`LogLevel`, `Currency`, `FetchResult`,
`ApiError`, …). The complete inventory lives in the
[API Reference](/api/#interfaces).

Services implement these contracts; adapters consume them. Domain rules never
reach for concrete `window`/`fetch` globals directly.

### `core/services/` — the pure layer

Nineteen service modules with pure logic. This layer never touches `window`,
`document`, `fetch`, the filesystem or any framework, with two pragmatic
exceptions that are clearly documented in code: `http.service.ts` wraps the
global `fetch` (available in Node 18+/Bun/browsers) and `reactive.service.ts`
persists via injected storage functions from `infrastructure`.

| File                   | Exports (public facade)                     |
| ---------------------- | ------------------------------------------- |
| `logger.service.ts`    | `useLogger`, `useLoggerTable`, `useLoggerClear` |
| `http.service.ts`      | `FetchApiManager`                           |
| `formatter.service.ts` | `FormatterService`, `ConverterService`      |
| `error.service.ts`     | `useErrorNormalize`, `useErrorSerialize`, `useErrorCustom`     |
| `result.service.ts`    | `useAttempt`, `useTryJsonParse`             |
| `generator.service.ts` | `GeneratorService`, `LazyNodeCryptoStrategy`, `NativeUuidStrategy` |
| `faker.service.ts`     | `useFake*` helpers (`useFakeEmail`, `useFakeList`, `useFakeSeed`, …) over an optional, lazy-loaded `@faker-js/faker` peer — see [Faker](/guides/faker) |
| `dates.service.ts`     | `DatesService` (Temporal polyfill adapter)  |
| `geometry.service.ts`  | `GeometryUtils` (`area`/`perimeter`/`volume`) |
| `timing.service.ts`    | `TimingService`                             |
| `utils.service.ts`     | `DataUtils`, `SystemUtils`, `AppUtils`      |
| `reactive.service.ts`  | `ReactiveService` (signals kernel)          |

Every service is a **Singleton class** (`getInstance()`) that owns its state and
exposes `use*` methods; the module also exports thin `use*` wrapper functions
that delegate to `getInstance()`. The wrappers keep the public API stable while
the class carries the implementation:

```ts
export class LoggerService {
	private static instance: LoggerService;
	static getInstance(): LoggerService { /* ... */ }
	useLog(message: string, data?: unknown, level: LogLevel = "log"): void { /* ... */ }
}

// backward-compatible wrapper over the singleton
export function useLogger(message: string, data?: unknown, level: LogLevel = "log"): void {
	LoggerService.getInstance().useLog(message, data, level);
}
```

Some services additionally expose `create()` (or an injectable strategy) for
non-singleton, isolated instances — useful in tests:

### `infrastructure/` — the adapter layer

Adapters that own browser/runtime I/O. Each is SSR-safe: it guards or falls back
gracefully when `window`/`document`/`navigator` is absent.

- `dom/` — `DomService` (query, classes, attributes, events, HTML/text setting)
  plus the `DOM_SERVICE` singleton instance.
- `storage/` — `StorageService` over `localStorage`/`sessionStorage` with
  `LocalStorageStrategy`, `SessionStorageStrategy` and an in-memory
  `MemoryStorageStrategy` SSR fallback.
- `filesystem/` — Node/Bun helpers over `node:fs/promises` (read/write/append,
  JSON, directories, stats, copy/move/remove, hashing) plus `path.service.ts`.
  Built-ins load through dynamic `import()`; every fallible call returns a Safe
  Result with the native errno `code`, and non-Node runtimes get
  `ERR_FS_UNAVAILABLE`. `useReadJsonFile`/`useReadModuleJson` accept an optional
  Zod schema. Full surface: [Filesystem](/guides/filesystem).
- `viewport/` — `ViewportService` (dimensions, scroll, media queries,
  fullscreen, visibility, title).
- `sensors/` — `SensorsUtils` (camera/microphone, geolocation, motion,
  vibration, battery) exported as the `sensorsUtils` instance.
- `observer/` — `ObserverService` and `LazyLoaderService` wrappers around
  `IntersectionObserver`.
- `worker/` — `WorkerService` (one-shot workers and worker pools with an
  SSR/main-thread fallback).
- `theme/` — `ThemeService` (mode switching over DOM + storage + a
  media-query listener), exported as `THEME_SERVICE`.
- `decorators/` — composable function decorators (Decorator Pattern) that add
  behaviour without touching the wrapped function:
  - `RetryDecorator(fn, retries?, delayMs?)` — re-runs a failing async function
    with a fixed delay before propagating the last error.
  - `CacheDecorator(fn, { ttlMs?, keyFn? })` — memoizes results by argument key;
    the decorated function also exposes `useClearCache()` / `useCacheSize()`.
  - `LoggerDecorator(fn, label?, level?)` — traces start/ok/error with duration
    for sync and async functions.

  They compose: `RetryDecorator(LoggerDecorator(flakyRequest, "flaky"), 2)`.

  Decorators are exported from the **main barrel** (there is no
  `katanakit-js/infrastructure/*` subpath):

  ```ts
  import { RetryDecorator, CacheDecorator, LoggerDecorator } from "katanakit-js";
  ```

`infrastructure/index.ts` re-exports every module (including the decorators)
and gives stable named exports to the default-exported classes
(`StorageService`, `ViewportService`, `WorkerService`).

### `adapters/` — the framework layer

- `astro/` — `AstroService` (converts collections into `getStaticPaths`
  payloads, Safe Result style), `RssService` (RSS 2.0 XML generation and
  Astro `GET` endpoints), and SEO re-exports (`useSeoTag`, `useHeadTags`,
  …) for Layout frontmatter. Published as `katanakit-js/adapters/astro`
  (Astro + RSS also available from the main barrel).
- `express/` — a reference Express server (`ServerExpress`), a demo
  `ProductController` and a `router`. Published only as the
  `katanakit-js/adapters/express` subpath so the main bundle never pulls in
  Express. Requires the `express` optional peer dependency.
- `nuxt/` — three **pure exported functions**, not singletons:
  `useUnwrap(result, context?)`, `useSafeResponse(result)` and
  `useEventResponse(event, result)`. They bridge KatanaKit `FetchResult` values
  to Nuxt/Nitro server routes without importing `h3`. Published only as the
  `katanakit-js/adapters/nuxt` subpath.
- `vue/` — `useRequest`, a Vue 3 composable that wraps `useGet` with the
  reactivity system (`data`, `error`, `loading`, `refetch`). It imports `vue`
  directly and is published only as the `katanakit-js/adapters/vue` subpath;
  `vue` is an optional peer dependency.
- `photoswipe/` — `usePhotoSwipe(options)` binds a lightbox from CSS
  selectors (`gallery`, `children`, `root`), plus `usePhotoSwipeOpen`,
  `usePhotoSwipeDestroy` and `usePhotoSwipeSupported`. Rebinding is
  idempotent, so late-rendered galleries are safe. Published only as the
  `katanakit-js/adapters/photoswipe` subpath; `photoswipe` is an optional peer.
- `better-auth/` — `useAuthClient({ framework })` creates the Better Auth
  client for vanilla/react/vue/svelte/solid (only that entry is imported), and
  `useAuthSession` / `useAuthHandler` / `useAstroAuthLocals` wrap the server
  calls in Safe Results. Published only as the
  `katanakit-js/adapters/better-auth` subpath; `better-auth` is an optional peer.

### `config/` — site configuration and SEO

- `site.config.ts` — the `SiteConfig` interface and a default `siteConfig`
  instance (site URL, title, description, language, author, RSS options, SEO
  toggles and optional nav). Required vs optional at a glance:
  `seo` required · `rss` required · `nav?` optional · `ogImage?` optional.
  (`UseSeoMetaOptions` keeps `seo`/`rss` partial because the `defaults`
  fill the gaps; a full `SiteConfig` must carry them.)
- `seo.service.ts` — pure Nuxt-inspired `useSeoMeta(input, config?)` flat object
  API (`SeoMetaInput` / `SeoMetaFlat`: OG, Twitter, article, robots, canonical,
  …), plus `useApplySeoTag` (Vanilla), legacy `useSeoTag`, and helpers
  `useGenerateMetaTags`, `useTitle`, `useRssHeadLink`, `useHeadTags`. Prefer
  Nuxt's own head APIs inside Nuxt. `SiteConfig` inputs are validated
  fail-fast (`assertSiteConfigSeo` / `assertSiteConfigRss`): a missing
  `seo`/`rss` throws `[Seo] SiteConfig.seo is required (caller)` /
  `[Seo] SiteConfig.rss is required (caller)`; `nav` is copied by
  reference and never dereferenced, so it stays optional.

Both are re-exported from the main barrel (`import { siteConfig, type
SiteConfig, useSeoMeta } from "katanakit-js"`) and from
`katanakit-js/adapters/astro`.

### `prisma/` — database layer (optional)

- `schema.prisma` — the Prisma schema (`User`, `Post` models,
  Prisma ORM contract-first syntax).
- `schema.json` / `schema.d.ts` — generated contract artifacts
  (**do not edit**; regenerate with `prisma contract emit`).
- `db.ts` — the typed database client built with `@prisma/orm-postgres` from
  the contract and `DATABASE_URL` (read from `dotenv`).
- `prisma.config.ts` (repo root) — Prisma CLI/ORM configuration.

This layer is optional: `@prisma/orm-postgres` is an optional peer dependency
and the client is not exported from the main barrel.

## Package layout and ESM

- **Pure ESM.** `package.json` has `"type": "module"`, `"module":
  "nodenext"` and `"exports"`. Source imports are relative and always carry an
  explicit `.js` extension (e.g. `import { useLogger } from
  "./logger.service.js"`) so the emitted `dist/` resolves identically under
  Node's ESM loader and bundlers.
- **Exports map.**

  | Import specifier                  | What it exposes                               |
  | --------------------------------- | --------------------------------------------- |
  | `katanakit-js`                    | astro (Astro + RSS), config (site + SEO), core, infrastructure, types |
  | `katanakit-js/adapters/astro`     | `AstroService`, `RssService`, SEO re-exports (`useSeoTag`, …) |
  | `katanakit-js/adapters/express`   | Express reference adapter                     |
  | `katanakit-js/adapters/nuxt`      | Nuxt helpers                                  |
  | `katanakit-js/adapters/vue`       | Vue 3 composable                              |
  | `katanakit-js/adapters/photoswipe`| Lightbox bound by CSS selectors                |
  | `katanakit-js/adapters/better-auth` | Auth client factory + session helpers       |

- **`@/` alias** maps to `src/` in `tsconfig.json` and `vitest.config.ts`. It is
  used by the test suite and the examples, not by library source files.
- **No side effects on import.** Barrel files only re-export; strategy
  instantiation happens lazily inside services. `db.ts` is the only module that
  reads the environment, and it is never part of the public barrel.

## Design patterns in use

| Pattern    | Where                                                              |
| ---------- | ------------------------------------------------------------------ |
| Singleton  | every service (`FetchApiManager`, `LoggerService`, `ExpressService`, `TelegramService`, `WordPressService`, `NotionService`, `InsForgeService`, `AssistantService`, `QueryService`, ...) |
| Facade     | `FetchApiManager`, `DomService`, `AstroService`, `RssService`, `AppUtils` |
| Strategy   | `AccessService` (`HierarchicalAccessStrategy` / `FlatAccessStrategy`), `AgentService` (`OpenAiCompatibleStrategy`), storage backends, generator crypto/UUID, worker |
| Factory    | `QueryClientFactory` (per-request `QueryClient` for SSR); debounce/throttle/timeout factories in `TimingService`; crypto strategies in `GeneratorService` |
| Observer   | `ReactiveService` signals, `ObserverService`, theme media query    |
| Decorator  | `RetryDecorator`, `CacheDecorator`, `LoggerDecorator` (`infrastructure/decorators/`); `ConverterService` decorating `FormatterService` |
| Adapter    | `DatesService` (Temporal), infrastructure layer, framework adapters |

### How the patterns fit together

Stateful services follow **Singleton + (Strategy | Decorator | Factory)**:

- **Singleton** — one instance owns the configuration/state
  (`ExpressService`, `TelegramService`, `WordPressService`, `FetchApiManager`,
  `AssistantService`, `QueryService`).
- **Singleton + Strategy** — the singleton delegates a swappable algorithm:
  `AccessService.useSetStrategy(new FlatAccessStrategy())` and
  `AgentService.useSetStrategy(...)` swap implementations at runtime; both also
  expose a static `create(strategy)` for isolated (non-singleton) instances.
- **Singleton + Decorator** — cross-cutting behaviour wraps functions without
  modifying them (`RetryDecorator`, `CacheDecorator`, `LoggerDecorator`).
- **Singleton + Factory** — the singleton fabricates collaborators through a
  single creation point (`QueryClientFactory.create()` for per-request SSR
  clients vs. the shared `QueryService` singleton).

SOLID is preserved because the client only knows the contracts
(`IAccessStrategy`, `IAiProviderStrategy`, `StorageStrategy`, `I*Service`
facades), never the concrete implementations.

## Conventions

- **`use*` methods** — every public method (except `getInstance()` and the
  static factory `create()`) uses the `use` prefix, mirroring React hooks. This
  makes the API consistent and predictable.
- **Singleton class + `use*` wrappers** — each stateful service is a Singleton
  class (`getInstance()`) and the module re-exports thin `use*` wrapper
  functions that delegate to it, so callers keep the functional API
  (`useLogger(...)`, `useFetch(...)`) while the class owns the state. Decorators
  are the exception to the `use*` rule: `RetryDecorator`/`CacheDecorator`/
  `LoggerDecorator` use PascalCase because they are composables, not API
  functions. See [ADR-0002](/explanation/decisions/adr-0002-singleton-facades).
- **Safe Result** — fallible operations return a discriminated union
  `{ data, error, ok }` instead of throwing. The generic `SafeResult<T, E>` is
  the base of `FetchResult<T>`, `FilesystemResult<T>`, `AstroServiceResult<T>`,
  `AiResult<T>` and `RssResult`; see [Error Handling](/guides/errors) and
  [ADR-0001](/explanation/decisions/adr-0001-safe-results).
- **Single source of truth** — all contracts and shared types live in
  `src/types/`.
- **English only** — comments, identifiers and messages are written in English.

## Development tooling

The scripts, the gate (`bun run check`) and the local release flow are part of
the [contributing contract](https://github.com/senseikatana/katanakit-js/blob/dev/CONTRIBUTING.md) —
this page stays about the architecture.
