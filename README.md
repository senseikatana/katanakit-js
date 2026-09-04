# KatanaKit (`katanakit-js`)

KatanaKit is a sharp, framework-agnostic **TypeScript service toolkit** organized
with **hexagonal architecture** and built on proven design patterns (Singleton,
Observer, Factory, Strategy, Facade and Adapter).

It runs in the browser, in Node.js (>= 22.18) and in Bun, ships with an Astro
`getStaticPaths` adapter, an RSS 2.0 generator, a site-config/SEO module, an
optional Express server reference and a Nuxt (Nitro/H3) adapter. Importing a
module never triggers side effects, and every async operation returns a **Safe
Result** instead of throwing.

- **Version:** 2.1.4
- **npm package:** `katanakit-js`
- **Repository:** [senseikatana/katanakit](https://github.com/senseikatana/katanakit)
  (development happens on the `dev` branch)
- **License:** MIT

## Why

Modern frontend and full-stack apps keep reimplementing the same plumbing:
fetching an API safely, logging, persisting to storage, querying the DOM,
reacting to state changes, generating slugs, formatting dates and money,
building RSS/SEO output. KatanaKit provides all of that as a single, typed and
tree-shakeable set of `use*` services with a consistent API: one `useInit` for
your APIs, one `useFetch` that returns a Safe Result, one way to do logging,
storage and DOM across every framework.

## Features

- **Safe URL construction** — builds URLs from a JSON-defined API registry using
  the native `URL` API and `encodeURIComponent`; only `http:`/`https:` schemes
  are allowed (prevents `javascript:` URLs and SSRF).
- **Safe Result** — every `useFetch` returns a discriminated union
  `{ data, error, url, status, ok }` (Astro Actions style) instead of throwing
  on HTTP errors.
- **Hexagonal architecture** — a pure `core` layer (services), an
  `infrastructure` layer (browser/runtime adapters), an `adapters` layer
  (Astro, Express, Nuxt), a `config` layer (site config + SEO) and a single
  source of truth for contracts and types in `src/types/`.
- **Design patterns** — Singleton facades, Strategy (logger, storage,
  crypto/UUID), Factory (errors, debounce/throttle), Observer (signals,
  IntersectionObserver, media queries), Facade and Adapter, all exposed as
  `use*` methods (like React hooks) with safe destructured exports.
- **Consistent `use*` API** — every public method is prefixed with `use`
  (`useInit`, `useFetch`, `useLog`, `useCreateSignal`, ...); the only exception
  is `getInstance()`.
- **Pure ESM** — relative imports use explicit `.js` extensions and
  `module: nodenext`; bundlers and Node resolve the package cleanly.
- **Zero side effects on import** — importing a module never triggers network
  calls, timers, storage writes or DOM mutations.
- **SSR-safe** — browser-only adapters guard or fall back gracefully
  (in-memory storage, main-thread worker execution) when `window` is
  unavailable.
- **Optional heavy dependencies** — only `@js-temporal/polyfill` is a runtime
  dependency; `express`, `cors`, `dotenv` and `@prisma/orm-postgres` are
  optional peer dependencies.
- **Fully typed** — strict TypeScript with generated `.d.ts` declarations.

## Installation

```bash
npm install katanakit-js
# or
bun add katanakit-js
```

Requirements: **Node.js >= 22.18.0** (pure ESM package). TypeScript consumers
should use `moduleResolution: "nodenext"` (or `"bundler"`).

### Framework adapters

The root import is framework-agnostic. Framework-specific entry points are
published as package **subpaths** of the same `katanakit-js` package:

```ts
// Nuxt / Nitro adapter helpers (no extra dependency; h3 ships with Nuxt)
import { useUnwrap } from "katanakit-js/adapters/nuxt";

// Express reference server (requires express as a peer dependency)
import { ServerExpress } from "katanakit-js/adapters/express";
```

`express`, `cors`, `dotenv` and `@prisma/orm-postgres` are **optional peer
dependencies** — install them only if you use the Express adapter or the Prisma
layer.

### Building from source

```bash
git clone https://github.com/senseikatana/katanakit.git
cd katanakit
bun install
bun run build       # outputs to dist/
```

## Quick Start

Everything below is importable from the main barrel `katanakit-js`.

### HTTP client

```ts
import { useInit, useGet, usePost, useBuildUrl } from "katanakit-js";

// 1. Register your APIs once.
useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: {
      pokemonById: "/pokemon/:id/",
      pokemons: "/pokemons/",
    },
  },
});

// 2. Build a safe URL (path params encoded, query params merged).
const url = useBuildUrl("pokeapi", "pokemonById", {
  params: { id: "pikachu" },
});
// => "https://pokeapi.co/api/v2/pokemon/pikachu/"

// 3. Fetch with a Safe Result (no throwing on HTTP errors).
const result = await useGet<{ name: string }>("pokeapi", "pokemonById", {
  params: { id: 25 },
});

if (result.ok) {
  console.log(result.data.name);
} else {
  console.error(result.error.message, result.error.status);
}

// 4. POST JSON.
await usePost("pokeapi", "pokemons", { name: "charmander" });
```

### Logger, storage and DOM

```ts
import {
  useLog,
  useSetStorage,
  useGetStorage,
  useRemoveStorage,
  useAddClass,
  useGetRoot,
} from "katanakit-js";

useLog("Hello", { user: "John" });                  // info level
useLog("error", "Something failed", { code: 500 }); // error level

useSetStorage("theme", "dark");
const theme = useGetStorage<string>("theme");       // "dark"
useRemoveStorage("theme");

useAddClass(useGetRoot()!, "dark-mode");
```

Storage is SSR-safe: when `window` is unavailable an in-memory fallback is used
automatically, so imports never crash in Node/Bun.

## Astro adapter

KatanaKit converts arbitrary collections into the payload Astro's
`getStaticPaths` expects, wrapped in a Safe Result.

```ts
// src/pages/blog/[slug].astro
import { AstroService } from "katanakit-js";

export async function getStaticPaths() {
  const { useGetStaticPaths } = AstroService.getInstance();

  return useGetStaticPaths(getCollection, "blog", {
    param: "slug",
    valueFrom: (entry) => entry.slug ?? entry.id,
    propsFrom: (entry) => entry.data,
  });
}
```

Also available: `usePathsFrom`, `useFindEntry`, `useGeneratePagination`,
`usePathsFromValues` and `useExtractUniqueValues`. See the
[API Reference](docs/API-Reference.md#astro--astroservice).

## RSS feeds for Astro

`RssService` generates pure RSS 2.0 XML with **no external dependencies**
(`@astrojs/rss` is not required).

```ts
// src/pages/rss.xml.ts
import { RssService } from "katanakit-js";
import { getCollection } from "astro:content";

const { useCreateRssEndpoint } = RssService.getInstance();

export const GET = useCreateRssEndpoint({
  title: "My Blog",
  description: "Posts about TypeScript",
  site: "https://example.com",
  items: async () => {
    const posts = await getCollection("blog");
    return posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      description: post.data.description,
    }));
  },
});
```

Add the feed `<link>` tag to your layout's `<head>`:

```astro
---
import { useRssLinkTag } from "katanakit-js";
---
<head>
  <Fragment set:html={useRssLinkTag({ title: "My Blog" })} />
</head>
```

`useCreateRssEndpointFromConfig(siteConfig, items)` builds the same endpoint
from your `SiteConfig`. See the [API Reference](docs/API-Reference.md#rss--rssservice).

## Site config and SEO

Centralize your site metadata in a typed `SiteConfig` and derive every `<head>`
tag from it.

```ts
// src/config/site.config.ts
import { type SiteConfig } from "katanakit-js";

export const siteConfig: SiteConfig = {
  site: "https://myblog.com",
  title: "My Blog",
  description: "A blog about TypeScript and Astro",
  lang: "en",
  author: "John Doe",
  ogImage: "/og-default.png",
  twitter: "johndoe",
  rss: { enabled: true, path: "/rss.xml", limit: 20 },
  seo: { noindex: false, canonical: true, openGraph: true, twitterCard: true, jsonLd: true },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "GitHub", href: "https://github.com/senseikatana/katanakit", external: true },
  ],
};
```

Then inject complete meta tags (title, description, canonical, Open Graph,
Twitter Card and JSON-LD) in your layout:

```astro
---
// src/layouts/BaseLayout.astro
import { siteConfig } from "@/config/site.config";
import { useHeadTags } from "katanakit-js";

interface Props {
  title: string;
  description?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
}

const { title, description, ogType, publishedTime } = Astro.props;
const headTags = useHeadTags(siteConfig, {
  title,
  description,
  url: new URL(Astro.url.pathname, siteConfig.site).href,
  ogType,
  publishedTime,
});
---
<html lang={siteConfig.lang}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <Fragment set:html={headTags} />
</head>
<body>
  <slot />
</body>
</html>
```

The RSS endpoint consumes the same config:

```ts
// src/pages/rss.xml.ts
import { RssService } from "katanakit-js";
import { siteConfig } from "@/config/site.config";
import { getCollection } from "astro:content";

const { useCreateRssEndpointFromConfig } = RssService.getInstance();

export const GET = useCreateRssEndpointFromConfig(siteConfig, async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    link: `/blog/${post.slug}/`,
    description: post.data.description,
  }));
});
```

## Nuxt adapter

New in 2.1.4. Three pure helper functions bridge KatanaKit's Safe Results to
Nuxt/Nitro server routes. They are **not** singleton services — just exported
functions — and they avoid a hard dependency on `h3` (it ships with Nuxt).

```ts
import { useInit, useGet } from "katanakit-js";
import { useUnwrap } from "katanakit-js/adapters/nuxt";

// server/plugins/api.ts — register your APIs once
useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});
```

```ts
// server/api/pokemon/[id].ts
import { useGet } from "katanakit-js";
import { useUnwrap } from "katanakit-js/adapters/nuxt";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const result = await useGet("pokeapi", "pokemonById", { params: { id } });
  return useUnwrap(result, `Pokemon ${id}`); // returns data, or throws an H3-compatible error
});
```

The other helpers are `useSafeResponse(result)` (shape the result as a clean
JSON response object) and `useEventResponse(event, result)` (set the H3 event
status code and return data/error). See the
[API Reference](docs/API-Reference.md#nuxt-adapter--katanakit-jsadaptersnuxt).

## Express server (optional)

The Express reference adapter is exposed only through its own subpath so it
never bloats the main bundle:

```ts
import { ServerExpress } from "katanakit-js/adapters/express";

ServerExpress.getInstance().useStart(); // http://localhost:3000
```

It expects `express` (and `cors`/`dotenv` if used) to be installed in your
project. A `ProductController` and a demo `router` are also exported.

## Services at a glance

| Area      | Service / module            | Highlights                                                          |
| --------- | --------------------------- | ------------------------------------------------------------------- |
| HTTP      | `FetchApiManager`           | `useInit`, `useGetApis`, `useBuildUrl`, `useFetch`, `useGet`, `usePost`, `usePut`, `useDelete` |
| Logging   | `LoggerService`             | `useLog`, `useError`, `useClear`, `useTable`, pluggable `LogStrategy` |
| Storage   | `StorageService`            | `useGetStorage`, `useSetStorage`, `useRemoveStorage`, `useClearStorage` (SSR-safe) |
| DOM       | `DomService`                | `useQuerySelector`, `useAddClass`, `useOn`, `useSetText`, ...        |
| Reactive  | `ReactiveService`           | `useCreateSignal`, `useCreateEffect`, `useCreateMemo`, `useCreateToggle`, `useCreateStorageSignal`, `useCreateDebouncedSignal`, `useCreateBatch` |
| Format    | `FormatterService`          | `useFormatNumber`, `useFormatCurrency`, `useJsonStringify`, `useUpperCase`, `useCapitalize`, ... |
| Convert   | `ConverterService`          | `useToCelsius`, `useToFahrenheit`, `useToMiles`, `useToKilos`, ...   |
| Errors    | `ErrorFactoryService`       | `useBadRequest`, `useUnauthorized`, `useForbidden`, `useNotFound`, `useInternal`, `useCustom` |
| Generate  | `GeneratorService`          | `useUuid`, `useSlugify`, `useNumericId`, `useToken`, `useEncrypt`    |
| Dates     | `DatesService`              | `useFormat`, `useNow`, `useAddDays`, `useIsBefore`, `useLastDayOfMonth`, ... (Temporal) |
| Geometry  | `GeometryUtils`             | `area`, `perimeter`, `volume` static helpers (`useCircle`, `useSphere`, ...) |
| Timing    | `TimingService`             | `useDelay`, `useSetTimeout`, `useInterval`, `useDebounce`, `useThrottle`, `useRepeat`, `useRace` |
| Utils     | `DataUtils` / `SystemUtils` | `useUnique`, `useGroupBy`, `useDeepClone`, `useSleep`, `useRetry`, `useRound`, ... |
| Viewport  | `ViewportService`           | scroll, fullscreen, visibility, `usePrefersReducedMotion`            |
| Sensors   | `SensorsUtils`              | `useGetGeolocation`, `useGetMediaStream`, `useVibrate`, `useGetBattery`, ... |
| Observer  | `ObserverService`           | `useCreate`, `useObserve`, `useObserveAll`, `useDisconnect`          |
| LazyLoad  | `LazyLoaderService`         | `useInit`, `useStop`, `useStopAll` for `img[data-src]`               |
| Worker    | `WorkerService`             | `useRun`, `useCreatePool`, `useRunPool`, `useTerminate`              |
| Theme     | `ThemeService`              | `useInitTheme`, `useSetThemeMode`, `useToggleTheme`, `useResetTheme` |
| Astro     | `AstroService`              | `useGetStaticPaths`, `usePathsFrom`, `useGeneratePagination`, ...    |
| RSS       | `RssService`                | `useGenerateRss`, `useRssLinkTag`, `useCreateRssEndpoint`, `useCreateRssEndpointFromConfig` |
| SEO       | `useHeadTags` and friends   | `useGenerateMetaTags`, `useTitle`, `useRssHeadLink` + typed `SiteConfig` |
| Config    | `siteConfig` / `SiteConfig` | single source for site metadata, RSS and SEO defaults                |
| Nuxt      | `katanakit-js/adapters/nuxt`| `useUnwrap`, `useSafeResponse`, `useEventResponse` (pure functions)  |
| Server    | `katanakit-js/adapters/express` | `ServerExpress`, `router`, `ProductController` (optional reference) |

The Astro, RSS, SEO and config modules plus all core/infrastructure services
are re-exported from the main barrel. The Nuxt and Express adapters are only
available through their subpaths.

## Project structure (hexagonal)

```
katanakit/
├── package.json              # name: katanakit-js, ESM, exports map
├── prisma.config.ts          # Prisma ORM config (contract + connection)
├── src/
│   ├── index.ts              # main barrel (public API)
│   ├── types/                # single source of truth: contracts & types
│   ├── core/
│   │   └── services/         # pure services (no I/O): logger, http, ...
│   ├── infrastructure/       # browser/runtime adapters
│   │   ├── dom/  storage/  viewport/  sensors/
│   │   └── observer/  worker/  theme/
│   ├── adapters/             # framework adapters
│   │   ├── astro/            #   AstroService + RssService
│   │   ├── express/          #   ServerExpress reference (subpath export)
│   │   └── nuxt/             #   Nuxt helpers (subpath export)
│   ├── config/               # siteConfig (SiteConfig) + SEO helpers
│   └── prisma/               # Prisma schema, contract types and db client
├── tests/                    # Vitest suite (57 tests across 7 files)
├── examples/                 # runnable demos
├── docs/                     # Getting Started, Architecture, API Reference, Roadmap
├── CONTRIBUTING.md
└── SECURITY.md
```

All internal source imports are relative and carry an explicit `.js` extension
(pure ESM, `module: nodenext`). The `@/` alias (mapped to `src/`) is configured
for the test suite and the examples.

## Documentation

- [Getting Started](docs/Getting-Started.md)
- [Architecture](docs/Architecture.md)
- [API Reference](docs/API-Reference.md)
- [Roadmap](docs/Roadmap.md)
- [Security](SECURITY.md)
- [Changelog](CHANGELOG.md)

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for
the development contract (hexagonal layering, `use*` convention, `.js` ESM
imports, tests, scripts) before opening a pull request.

## License

[MIT](LICENSE)
