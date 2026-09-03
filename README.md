# apify-manager

**Universal API Manager** — a framework-agnostic HTTP client and a collection of
TypeScript service utilities, organized with **hexagonal architecture** and built
on proven design patterns (Singleton, Observer, Factory, Decorator and Strategy).

It ships with an Astro `getStaticPaths` adapter and an optional Express server,
and it works in the browser, in Node.js and in Bun.

## ✨ Features

- **Safe URL construction** — build URLs from a JSON-defined API registry using the
  native `URL` API and `encodeURIComponent`, preventing injection and double-slash
  bugs.
- **Safe Result** — every `FETCH` returns a discriminated union
  `{ data, error, ok }` (Astro Actions style) instead of throwing on HTTP errors.
- **Hexagonal architecture** — a pure `core` layer (ports + services), an
  `infrastructure` layer (browser/runtime adapters) and an `adapters` layer
  (Astro and Express), with a single `@/` path alias and barrel exports.
- **Design patterns** — Singleton facades, Strategy (logger, storage, generator),
  Factory (errors), Observer (signals, IntersectionObserver) and more, all
  exposed with safe destructured exports.
- **Zero side effects on import** — importing any module never triggers network
  calls, timers or storage writes.
- **SSR-safe** — browser-only adapters gracefully fall back (in-memory storage,
  main-thread worker execution) when `window` is unavailable.
- **Fully typed** — strict TypeScript with generated declarations.

## 📦 Installation

```bash
npm install apify-manager
# or
bun add apify-manager
```

### Building from source

```bash
git clone https://github.com/senseikatana/apify-manager.git
cd apify-manager
bun install
bun run build
```

## 🚀 Quick Start

```ts
import {
  INIT,
  BUILD_URL,
  FETCH,
  LOGGER,
  SET_STORAGE,
  GET_STORAGE,
  ADD_CLASS,
  GET_ROOT,
} from "apify-manager";
```

### HTTP client (the core of the library)

```ts
import { INIT, GET, POST, BUILD_URL } from "apify-manager";

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
import { AstroService } from "apify-manager";

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
import { LOGGER, SET_STORAGE, GET_STORAGE, ADD_CLASS, GET_ROOT } from "apify-manager";

LOGGER("Hello", { user: "John" }); // info level
LOGGER("error", "Something failed", { code: 500 });

SET_STORAGE("theme", "dark");
const theme = GET_STORAGE<string>("theme");

ADD_CLASS(GET_ROOT()!, "dark-mode");
```

## 🧱 Project structure (hexagonal)

```
src/
├── index.ts                # main barrel (public API)
├── types/                  # shared domain types (single source of truth)
├── core/                   # pure layer (no I/O)
│   ├── ports/              #   service contracts (interfaces)
│   └── services/           #   logger, http, formatter, error, generator,
│                           #   dates, geometry, timing, utils, reactive
├── infrastructure/         # adapters (browser/runtime I/O)
│   ├── dom/                #   DomService
│   ├── storage/            #   StorageService
│   ├── viewport/           #   ViewportService
│   ├── sensors/            #   SensorsUtils
│   ├── observer/           #   ObserverService + LazyLoaderService
│   ├── worker/             #   WorkerService
│   └── theme/              #   ThemeService
└── adapters/               # framework adapters
    ├── astro/              #   AstroService
    └── express/            #   ServerExpress (optional, via subpath)
```

The Express server is **not** part of the main barrel to avoid forcing Express on
library consumers. Import it explicitly:

```ts
import { ServerExpress } from "apify-manager/adapters/express";

ServerExpress.getInstance().start(); // http://localhost:3000
```

## 📚 Documentation

- [Getting Started](docs/Getting-Started.md)
- [Architecture](docs/Architecture.md)
- [API Reference](docs/API-Reference.md)

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the
development contract, conventions and how to get started.

## 📄 License

[MIT](LICENSE)
