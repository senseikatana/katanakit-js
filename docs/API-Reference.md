# API Reference

Everything below is importable from the main barrel KatanaKit (or the `@/`
alias when developing). The Express server lives under
`katanakit/adapters/express`.

## HTTP client — `FetchApiManager`

Register APIs once, then build URLs and fetch with a Safe Result.

### `INIT(apis: ApisConfig): void`

Registers (merges) API definitions. Call once at startup.

```ts
INIT({
  api: {
    baseUri: "https://example.com", // string | URL
    endpoints: { user: "/users/:id" },
    defaultQueryParams: { user: { limit: 10 } },
  },
});
```

### `BUILD_URL(apiName, endpointName, options?): string`

Builds a URL, substituting `:param` placeholders with `encodeURIComponent` and
merging query params. Throws if the API or endpoint is not registered.

### `FETCH / GET / POST / PUT / DELETE`

Wrappers around `fetch` returning a `FetchResult<T>`.

```ts
type FetchResult<T> =
  | { data: T; error: null; url: string; status: number; ok: true }
  | { data: null; error: ApiError; url: string; status: number; ok: false };
```

### Types

- `ApisConfig = Record<string, ApiEntry>`
- `ApiEntry { baseUri: string | URL; endpoints: Record<string, string>; defaultQueryParams? }`
- `UrlOptions { params?; query?; ignoreDefaultQuery? }`
- `FetchOptions extends RequestInit { urlOptions?: UrlOptions }`
- `ApiError { message: string; status: number; details?: unknown }`

## Logger — `LoggerService`

### Destructured exports

- `LOGGER(message, data?)` / `LOGGER(level, message, data?)` — log a message.
- `LOGGER_ERROR(message, data?)` — error level.
- `LOGGER_CLEAR()` / `LOGGER_TABLE(data)`.

### `LogStrategy` and `ConsoleStrategy`

Swap the output strategy at runtime via `LoggerService.getInstance().setStrategy(strategy)`.

## Storage — `StorageService`

### Destructured exports

- `GET_STORAGE<T>(key, target?)` — read a value (`localStorage` by default).
- `SET_STORAGE(key, value, target?)` — write a value (JSON-serialized).
- `REMOVE_STORAGE(key, target?)` / `CLEAR_STORAGE(target?)`.

### Strategies

`LocalStorageStrategy`, `SessionStorageStrategy`, `MemoryStorageStrategy` (SSR
fallback). `StorageTarget = "localStorage" | "sessionStorage"`.

## DOM — `DomService`

### Destructured exports

- `IS_BROWSER()`, `GET_ROOT()`, `GET_BODY()`.
- `QUERY_SELECTOR(selector)`, `QUERY_SELECTOR_ALL(selector)`.
- `ADD_CLASS(target, className)`, `REMOVE_CLASS`, `TOGGLE_CLASS`, `HAS_CLASS`.
- `GET_ATTRIBUTE` / `SET_ATTRIBUTE` / `REMOVE_ATTRIBUTE`.
- `GET_DATA_ATTRIBUTE` / `SET_DATA_ATTRIBUTE`.
- `ON(target, event, callback, options?)` — returns an unsubscribe function.
- `CREATE_ELEMENT`, `SET_HTML`, `SET_TEXT`, `APPEND`, `REMOVE`.

All methods are SSR-safe (return `null`/`[]`/`false` when `document` is absent).

## Astro — `AstroService`

Adapter for Astro `getStaticPaths`.

### Methods

- `PATHS_FROM(items, options?)` — map items to `{ params, props }`.
- `GET_STATIC_PATHS(getCollectionFn, collectionName, options?)` — async, Safe Result.
- `FIND_ENTRY(items, value, keyFrom?)` — find an item by slug/id.
- `GENERATE_PAGINATION(items, pageSize?, param?)` — paginate items.
- `PATHS_FROM_VALUES(values, param?)` — build paths from raw values.
- `EXTRACT_UNIQUE_VALUES(items, keyFrom)` — dedupe values.

### Types

`CollectionEntryLike`, `PathsOptions`, `AstroPath`, `PaginationProps`,
`AstroServiceResult`, `IAstroService`.

## Other services

| Service              | Key exports                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `FormatterService`   | `FORMAT_NUMBER`, `FORMAT_CURRENCY`, `UPPER_CASE`, `JSON_STRINGIFY`, ...   |
| `ConverterService`   | `TO_CELSIUS`, `TO_FAHRENHEIT`, `TO_KILOMETERS`, `TO_MILES`, ...           |
| `ErrorFactoryService`| `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INTERNAL`, `CUSTOM` |
| `GeneratorService`   | `UUID`, `SLUGIFY`, `NUMERIC_ID`, `TOKEN`, `ENCRYPT`                       |
| `DatesService`       | `FORMAT`, `NOW`, `NOW_DATE_TIME`, `ADD_DAYS`, `IS_BEFORE`, ...            |
| `TimingService`      | `DELAY`, `SET_TIMEOUT`, `INTERVAL`, `DEBOUNCE`, `THROTTLE`, ...           |
| `ReactiveService`    | `CREATE_SIGNAL`, `CREATE_EFFECT`, `CREATE_MEMO`, `CREATE_STORAGE_SIGNAL`, ... |
| `DataUtils`/`SystemUtils`/`AppUtils` | `UNIQUE`, `CHUNK`, `GROUP_BY`, `RETRY`, `COPY_TO_CLIPBOARD`, ... |
| `ViewportService`    | `getViewportSize`, `scrollToTop`, `prefersReducedMotion`, ...             |
| `SensorsUtils`       | `getGeolocation`, `getMediaStream`, `vibrate`, ...                        |
| `ObserverService`    | `create`, `observe`, `observeAll`, `disconnect`, ...                      |
| `LazyLoaderService`  | `init`, `stop`, `stopAll`                                                 |
| `WorkerService`      | `RUN`, `CREATE_POOL`, `RUN_POOL`, `TERMINATE`                             |
| `ThemeService`       | `INIT_THEME`, `SET_THEME_MODE`, `TOGGLE_THEME`, ...                       |

## Express server (subpath)

`import { ServerExpress, router, ProductController } from "katanakit/adapters/express"`

- `ServerExpress.getInstance().start()` — start on `http://localhost:3000`.
- `ServerExpress.getInstance().getApp()` — the raw Express app.
