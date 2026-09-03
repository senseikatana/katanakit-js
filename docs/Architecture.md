# Architecture

KatanaKit follows **hexagonal architecture** (ports and adapters). The goal
is a pure, framework-agnostic core surrounded by adapters that talk to the outside
world (browser APIs, HTTP, frameworks).

## Layers

```
        ┌────────────────────────────────────────────┐
        │                 adapters/                  │   framework adapters
        │        astro/          express/            │
        └───────────────────┬────────────────────────┘
                            │  implements contracts
        ┌───────────────────▼────────────────────────┐
        │             infrastructure/                │   browser/runtime I/O
        │  dom · storage · viewport · sensors        │
        │  observer · worker · theme                 │
        └───────────────────┬────────────────────────┘
                            │  uses contracts
        ┌───────────────────▼────────────────────────┐
        │                  core/                     │   pure (no I/O)
        │    services/ (singleton facades)           │
        └───────────────────┬────────────────────────┘
                            │
        ┌───────────────────▼────────────────────────┐
        │                  types/                    │   single source of truth
        │    contracts · domain types · interfaces   │
        └────────────────────────────────────────────┘
```

### `types/` — the shared kernel

A single source of truth for all contracts and domain types. Every interface
(`LogStrategy`, `IFetchApiManager`, `IFormatterService`, `IReactiveService`,
`IDomService`, `IAstroService`, `IThemeService`, ...) lives here. Services
implement these contracts; adapters consume them.

### `core/` — the pure layer

Contains **services** (pure logic). This layer never touches `window`,
`document`, `fetch`, the filesystem or any framework.

- `services/` — the Singleton facades: `LoggerService`, `FetchApiManager`,
  `FormatterService`, `ErrorFactoryService`, `GeneratorService`, `DatesService`,
  `GeometryUtils`, `TimingService`, `DataUtils`/`SystemUtils`/`AppUtils`,
  `ReactiveService`.

### `infrastructure/` — the adapter layer

Adapters implement contracts and own I/O. Each is browser-safe and falls back in SSR:

- `dom/` — `DomService` wraps `document` (query, classes, attributes, events).
- `storage/` — `StorageService` wraps `localStorage`/`sessionStorage` with an
  in-memory fallback.
- `viewport/`, `sensors/`, `observer/`, `worker/`, `theme/` — window APIs.

### `adapters/` — the framework layer

- `astro/` — `AstroService` builds `getStaticPaths` payloads.
- `express/` — `ServerExpress`, a router and a product controller (optional,
  imported via subpath).

### `prisma/` — database layer (optional)

- `schema.prisma` — the Prisma schema (User, Post models).
- `db.ts` — the database client using the Prisma ORM contract pattern.
- `schema.d.ts` / `schema.json` — generated contract types (do not edit).

## Design patterns in use

| Pattern    | Where                                                          |
| ---------- | -------------------------------------------------------------- |
| Singleton  | every service (`LoggerService`, `FetchApiManager`, ...)        |
| Strategy   | logger output, storage backends, generator crypto/UUID         |
| Factory    | `ErrorFactoryService`, debounce/throttle factories in timing   |
| Observer   | `ReactiveService` signals, `ObserverService`, media-query theme |
| Decorator  | `ConverterService` decorating `FormatterService`               |
| Facade     | `FetchApiManager`, `AstroService`, `DomService`                |

## Conventions

- **`use*` methods** — every public method (except `getInstance`) uses the `use`
  prefix, like React hooks. This makes the API consistent and predictable.
- **`@/` alias** maps to `src/`. Internal imports use it; the public API is
  re-exported through barrel files.
- **Destructured exports** — services expose arrow-function methods and re-export
  them destructured (`useLog`, `useGetStorage`, `useFetch`, ...) for tree-shaking
  and `this`-safe calls.
- **No side effects on import** — a module import never triggers I/O.
- **Safe Result** — asynchronous operations return `{ data, error, ok }` instead
  of throwing.
- **Single source of truth** — all contracts and types live in `src/types/`.
