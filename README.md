# KatanaKit

A sharp, framework-agnostic **TypeScript service toolkit**,
organized with hexagonal architecture and built on proven design patterns
(Singleton, Observer, Factory, Decorator and Strategy).

It works in the browser, in Node.js and in Bun, ships with an Astro
`getStaticPaths` adapter and an optional Express server, and never triggers side
effects on import.

## Why

Modern frontend and full-stack apps keep reimplementing the same plumbing:
fetching an API safely, logging, persisting to storage, querying the DOM,
reacting to state changes, generating slugs, formatting dates and money. This
library gives you all of that as a single, tree-shakeable set of `use*` services
with a consistent API — one `useInit` for your APIs, one `useFetch` that returns a
Safe Result, one way to do logging, storage and DOM across every framework.

## ✨ Features

- **Safe URL construction** — build URLs from a JSON-defined API registry using the
  native `URL` API and `encodeURIComponent`; non-http(s) schemes are rejected to
  prevent `javascript:` URLs and SSRF.
- **Safe Result** — every `useFetch` returns a discriminated union
  `{ data, error, ok }` (Astro Actions style) instead of throwing on HTTP errors.
- **Hexagonal architecture** — a pure `core` layer (services), an
  `infrastructure` layer (browser/runtime adapters) and an `adapters` layer
  (Astro + Express), with a single `@/` path alias, barrel exports and a single
  source of truth for types in `src/types/`.
- **Design patterns** — Singleton facades, Strategy (logger, storage, generator),
  Factory (errors), Observer (signals, IntersectionObserver) and more, exposed
  as `use*` methods (like React hooks) with safe destructured exports.
- **Zero side effects on import** — importing a module never triggers network
  calls, timers or storage writes.
- **SSR-safe** — browser-only adapters fall back gracefully (in-memory storage,
  main-thread worker execution) when `window` is unavailable.
- **Fully typed** — strict TypeScript with generated declarations.

## 📦 Installation

```bash
npm install katanakit
# or
bun add katanakit
```

### Building from source

```bash
git clone https://github.com/senseikatana/katanakit.git
cd katanakit
bun install
bun run build
```

## 🚀 Quick Start

```ts
import {
  useInit,
  useGet,
  useBuildUrl,
  useLog,
  useSetStorage,
  useGetStorage,
  useAddClass,
  useGetRoot,
} from "katanakit";
```

### HTTP client (the core)

```ts
import { useInit, useGet, usePost, useBuildUrl } from "katanakit";

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

// 2. Build a safe URL.
const url = useBuildUrl("pokeapi", "pokemonById", { params: { id: "pikachu" } });
// => "https://pokeapi.co/api/v2/pokemon/pikachu/"

// 3. Fetch with a Safe Result (no throwing on HTTP errors).
const result = await useGet<{ name: string }>("pokeapi", "pokemonById", {
  params: { id: 1 },
});

if (result.ok) {
  console.log(result.data.name);
} else {
  console.error(result.error.message, result.error.status);
}
```

### Astro adapter

```ts
// src/pages/blog/[slug].astro
import { AstroService } from "katanakit";

export async function getStaticPaths() {
  const { useGetStaticPaths } = AstroService.getInstance();
  return useGetStaticPaths(getCollection, "blog", {
    param: "slug",
    valueFrom: (entry) => entry.slug ?? entry.id,
    propsFrom: (entry) => entry.data,
  });
}
```

### Logger, storage and DOM

```ts
import { useLog, useSetStorage, useGetStorage, useAddClass, useGetRoot } from "katanakit";

useLog("Hello", { user: "John" });                 // info level
useLog("error", "Something failed", { code: 500 }); // error level

useSetStorage("theme", "dark");
const theme = useGetStorage<string>("theme");

useAddClass(useGetRoot()!, "dark-mode");
```

## 🧰 Services at a glance

| Area      | Service              | Highlights                                            |
| --------- | -------------------- | ----------------------------------------------------- |
| HTTP      | `FetchApiManager`    | `useInit`, `useBuildUrl`, `useFetch`, `useGet`...     |
| Logging   | `LoggerService`      | `useLog`, `useError`, `LogStrategy`                   |
| Storage   | `StorageService`     | `useGetStorage`, `useSetStorage`, `StorageStrategy`   |
| DOM       | `DomService`         | `useQuerySelector`, `useAddClass`, `useOn`...         |
| Reactive  | `ReactiveService`    | `useCreateSignal`, `useCreateEffect`, `useCreateMemo` |
| Format    | `FormatterService`   | `useFormatNumber`, `useFormatCurrency`, `useUpperCase` |
| Convert   | `ConverterService`   | `useToCelsius`, `useToMiles`, `useToKilos`...         |
| Errors    | `ErrorFactoryService`| `useBadRequest`, `useNotFound`, `useInternal`...      |
| Generate  | `GeneratorService`   | `useUuid`, `useSlugify`, `useToken`, `useEncrypt`     |
| Dates     | `DatesService`       | `useFormat`, `useNow`, `useAddDays`, `useIsBefore`... |
| Geometry  | `GeometryUtils`      | `useRectangle`, `useCircle`, `useSphere`...           |
| Timing    | `TimingService`      | `useDebounce`, `useThrottle`, `useSetTimeout`, `useRace` |
| Utils     | `DataUtils`/`SystemUtils` | `useUnique`, `useGroupBy`, `useRetry`, `useDeepClone`... |
| Viewport  | `ViewportService`    | scroll, fullscreen, visibility, `usePrefersReducedMotion` |
| Sensors   | `SensorsUtils`       | geolocation, camera, vibration, battery               |
| Observer  | `ObserverService`    | `useCreate`, `useObserve`, `useObserveAll`            |
| Worker    | `WorkerService`      | `useRun`, `useCreatePool`, `useRunPool`               |
| Theme     | `ThemeService`       | `useInitTheme`, `useToggleTheme`, `useSetThemeMode`   |
| Astro     | `AstroService`       | `usePathsFrom`, `useGetStaticPaths`, pagination       |
| Server    | `ServerExpress`      | optional Express adapter (via subpath)                |

## 🧱 Project structure (hexagonal)

```
src/
├── index.ts                # main barrel (public API)
├── types/                  # single source of truth for all types & contracts
├── core/
│   └── services/           # logger, http, formatter, error, generator, ...
├── infrastructure/         # adapters (browser/runtime I/O)
│   ├── dom/  storage/  viewport/  sensors/  observer/  worker/  theme/
└── adapters/               # framework adapters
    ├── astro/              #   AstroService
    └── express/            #   ServerExpress (optional, via subpath)
```

The Express server is **not** part of the main barrel to avoid forcing Express on
library consumers. Import it explicitly:

```ts
import { ServerExpress } from "katanakit/adapters/express";

ServerExpress.getInstance().useStart(); // http://localhost:3000
```

## 📚 Documentation

- [Getting Started](docs/Getting-Started.md)
- [Architecture](docs/Architecture.md)
- [API Reference](docs/API-Reference.md)
- [Security](SECURITY.md)
- [Roadmap](docs/Roadmap.md)

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the
development contract, conventions and how to get started.

## 📄 License

[MIT](LICENSE)
