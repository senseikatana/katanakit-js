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
                            │  implements ports
        ┌───────────────────▼────────────────────────┐
        │             infrastructure/                │   browser/runtime I/O
        │  dom · storage · viewport · sensors        │
        │  observer · worker · theme                 │
        └───────────────────┬────────────────────────┘
                            │  implements ports
        ┌───────────────────▼────────────────────────┐
        │                  core/                     │   pure (no I/O)
        │    ports/  (interfaces/contracts)          │
        │    services/ (singleton facades)           │
        └────────────────────────────────────────────┘
```

### `core/` — the pure layer

Contains **ports** (contracts/interfaces) and **services** (pure logic). This layer
never touches `window`, `document`, `fetch`, the filesystem or any framework.

- `ports/` — service contracts such as `LogStrategy`, `IFormatterService`,
  `IFetchApiManager`, `IReactiveService`.
- `services/` — the Singleton facades: `LoggerService`, `FetchApiManager`,
  `FormatterService`, `ErrorFactoryService`, `GeneratorService`, `DatesService`,
  `GeometryUtils`, `TimingService`, `DataUtils`/`SystemUtils`/`AppUtils`,
  `ReactiveService`.

### `infrastructure/` — the adapter layer

Adapters implement ports and own I/O. Each is browser-safe and falls back in SSR:

- `dom/` — `DomService` wraps `document` (query, classes, attributes, events).
- `storage/` — `StorageService` wraps `localStorage`/`sessionStorage` with an
  in-memory fallback.
- `viewport/`, `sensors/`, `observer/`, `worker/`, `theme/` — window APIs.

### `adapters/` — the framework layer

- `astro/` — `AstroService` builds `getStaticPaths` payloads.
- `express/` — `ServerExpress`, a router and a product controller (optional,
  imported via subpath).

### `types/` — the shared kernel

A single source of truth for shared domain types (`GeoPosition`, `LogLevel`,
`StorageTarget`, `ApiEntry`, `FetchResult`, ...), eliminating duplication across
layers.

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

- **`@/` alias** maps to `src/`. Internal imports use it; the public API is
  re-exported through barrel files.
- **Destructured exports** — services expose arrow-function methods and re-export
  them destructured (`LOGGER`, `GET_STORAGE`, `FETCH`, ...) for tree-shaking and
  `this`-safe calls.
- **No side effects on import** — a module import never triggers I/O.
- **Safe Result** — asynchronous operations return `{ data, error, ok }` instead
  of throwing.
