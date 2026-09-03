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
library gives you all of that as a single, tree-shakeable set of services with a
consistent API — one `INIT` for your APIs, one `FETCH` that returns a Safe Result,
one way to do logging, storage and DOM across every framework.

## ✨ Features

- **Safe URL construction** — build URLs from a JSON-defined API registry using the
  native `URL` API and `encodeURIComponent`; non-http(s) schemes are rejected to
  prevent `javascript:` URLs and SSRF.
- **Safe Result** — every `FETCH` returns a discriminated union
  `{ data, error, ok }` (Astro Actions style) instead of throwing on HTTP errors.
- **Hexagonal architecture** — a pure `core` layer (ports + services), an
  `infrastructure` layer (browser/runtime adapters) and an `adapters` layer
  (Astro + Express), with a single `@/` path alias and barrel exports.
- **Design patterns** — Singleton facades, Strategy (logger, storage, generator),
  Factory (errors), Observer (signals, IntersectionObserver) and more, exposed
  with safe destructured exports.
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
  INIT,
  GET,
  BUILD_URL,
  LOGGER,
  SET_STORAGE,
  GET_STORAGE,
  ADD_CLASS,
  GET_ROOT,
} from "katanakit";
```

### HTTP client (the core)

```ts
import { INIT, GET, POST, BUILD_URL } from "katanakit";

// 1. Register your APIs once.
INIT({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: {
      pokemonById: "/pokemon/:id/",
      pokemons: "/pokemons/",
    },
  },
});

// 2. Build a safe URL.
const url = BUILD_URL("pokeapi", "pokemonById", { params: { id: "pikachu" } });
// => "https://pokeapi.co/api/v2/pokemon/pikachu/"

// 3. Fetch with a Safe Result (no throwing on HTTP errors).
const result = await GET<{ name: string }>("pokeapi", "pokemonById", {
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
  const { GET_STATIC_PATHS } = AstroService.getInstance();
  return GET_STATIC_PATHS(getCollection, "blog", {
    param: "slug",
    valueFrom: (entry) => entry.slug ?? entry.id,
    propsFrom: (entry) => entry.data,
  });
}
```

### Logger, storage and DOM

```ts
import { LOGGER, SET_STORAGE, GET_STORAGE, ADD_CLASS, GET_ROOT } from "katanakit";

LOGGER("Hello", { user: "John" });                 // info level
LOGGER("error", "Something failed", { code: 500 }); // error level

SET_STORAGE("theme", "dark");
const theme = GET_STORAGE<string>("theme");

ADD_CLASS(GET_ROOT()!, "dark-mode");
```

## 🧰 Services at a glance

| Area      | Service              | Highlights                                      |
| --------- | -------------------- | ----------------------------------------------- |
| HTTP      | `FetchApiManager`    | `INIT`, `BUILD_URL`, `FETCH`, `GET`, `POST`...   |
| Logging   | `LoggerService`      | `LOGGER`, `LOGGER_ERROR`, `LogStrategy`          |
| Storage   | `StorageService`     | `GET_STORAGE`, `SET_STORAGE`, `StorageStrategy`  |
| DOM       | `DomService`         | `QUERY_SELECTOR`, `ADD_CLASS`, `ON`...           |
| Reactive  | `ReactiveService`    | `CREATE_SIGNAL`, `CREATE_EFFECT`, `CREATE_MEMO`  |
| Format    | `FormatterService`   | `FORMAT_NUMBER`, `FORMAT_CURRENCY`, `UPPER_CASE` |
| Convert   | `ConverterService`   | `TO_CELSIUS`, `TO_MILES`, `TO_KILOS`...          |
| Errors    | `ErrorFactoryService`| `BAD_REQUEST`, `NOT_FOUND`, `INTERNAL`...        |
| Generate  | `GeneratorService`   | `UUID`, `SLUGIFY`, `TOKEN`, `ENCRYPT`            |
| Dates     | `DatesService`       | `FORMAT`, `NOW`, `ADD_DAYS`, `IS_BEFORE`...      |
| Geometry  | `GeometryUtils`      | area, perimeter, volume                          |
| Timing    | `TimingService`      | `DEBOUNCE`, `THROTTLE`, `SET_TIMEOUT`, `RACE`    |
| Utils     | `DataUtils`/`SystemUtils` | `UNIQUE`, `GROUP_BY`, `RETRY`, `DEEP_CLONE`... |
| Viewport  | `ViewportService`    | scroll, fullscreen, visibility, `prefersReducedMotion` |
| Sensors   | `SensorsUtils`       | geolocation, camera, vibration, battery          |
| Observer  | `ObserverService`    | `IntersectionObserver` + `LazyLoaderService`     |
| Worker    | `WorkerService`      | `RUN`, `CREATE_POOL`, `RUN_POOL`                 |
| Theme     | `ThemeService`       | `INIT_THEME`, `TOGGLE_THEME`, `SET_THEME_MODE`   |
| Astro     | `AstroService`       | `PATHS_FROM`, `GET_STATIC_PATHS`, pagination     |
| Server    | `ServerExpress`      | optional Express adapter (via subpath)           |

## 🧱 Project structure (hexagonal)

```
src/
├── index.ts                # main barrel (public API)
├── types/                  # shared domain types (single source of truth)
├── core/                   # pure layer (no I/O)
│   ├── ports/              #   service contracts (interfaces)
│   └── services/           #   logger, http, formatter, error, generator, ...
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

ServerExpress.getInstance().start(); // http://localhost:3000
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
