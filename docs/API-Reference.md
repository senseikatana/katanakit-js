# API Reference

Everything below is importable from the main barrel KatanaKit (or the `@/`
alias when developing). The Express server lives under
`katanakit/adapters/express`.

## HTTP client — `FetchApiManager`

Register APIs once, then build URLs and fetch with a Safe Result.

### `useInit(apis: ApisConfig): void`

Registers (merges) API definitions. Call once at startup.

```ts
useInit({
  api: {
    baseUri: "https://example.com", // string | URL
    endpoints: { user: "/users/:id" },
    defaultQueryParams: { user: { limit: 10 } },
  },
});
```

### `useBuildUrl(apiName, endpointName, options?): string`

Builds a URL, substituting `:param` placeholders with `encodeURIComponent` and
merging query params. Throws if the API or endpoint is not registered.

### `useFetch / useGet / usePost / usePut / useDelete`

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

- `useLog(message, data?)` / `useLog(level, message, data?)` — log a message.
- `useError(message, data?)` — error level.
- `useClear()` / `useTable(data)`.

### `LogStrategy` and `ConsoleStrategy`

Swap the output strategy at runtime via
`LoggerService.getInstance().useSetStrategy(strategy)`.

## Storage — `StorageService`

### Destructured exports

- `useGetStorage<T>(key, target?)` — read a value (`localStorage` by default).
- `useSetStorage(key, value, target?)` — write a value (JSON-serialized).
- `useRemoveStorage(key, target?)` / `useClearStorage(target?)`.

### Strategies

`LocalStorageStrategy`, `SessionStorageStrategy`, `MemoryStorageStrategy` (SSR
fallback). `StorageTarget = "localStorage" | "sessionStorage"`.

## DOM — `DomService`

### Destructured exports

- `useIsBrowser()`, `useGetRoot()`, `useGetBody()`.
- `useQuerySelector(selector)`, `useQuerySelectorAll(selector)`.
- `useAddClass(target, className)`, `useRemoveClass`, `useToggleClass`, `useHasClass`.
- `useGetAttribute` / `useSetAttribute` / `useRemoveAttribute`.
- `useGetDataAttribute` / `useSetDataAttribute`.
- `useOn(target, event, callback, options?)` — returns an unsubscribe function.
- `useCreateElement`, `useSetHtml`, `useSetText`, `useAppend`, `useRemove`.

All methods are SSR-safe (return `null`/`[]`/`false` when `document` is absent).

## Astro — `AstroService`

Adapter for Astro `getStaticPaths`.

### Methods

- `usePathsFrom(items, options?)` — map items to `{ params, props }`.
- `useGetStaticPaths(getCollectionFn, collectionName, options?)` — async, Safe Result.
- `useFindEntry(items, value, keyFrom?)` — find an item by slug/id.
- `useGeneratePagination(items, pageSize?, param?)` — paginate items.
- `usePathsFromValues(values, param?)` — build paths from raw values.
- `useExtractUniqueValues(items, keyFrom)` — dedupe values.

### Types

`CollectionEntryLike`, `PathsOptions`, `AstroPath`, `PaginationProps`,
`AstroServiceResult`, `IAstroService`.

## Other services

| Service              | Key exports                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `FormatterService`   | `useFormatNumber`, `useFormatCurrency`, `useUpperCase`, `useJsonStringify` |
| `ConverterService`   | `useToCelsius`, `useToFahrenheit`, `useToKilometers`, `useToMiles`, ...   |
| `ErrorFactoryService`| `useBadRequest`, `useUnauthorized`, `useForbidden`, `useNotFound`, ...    |
| `GeneratorService`   | `useUuid`, `useSlugify`, `useNumericId`, `useToken`, `useEncrypt`         |
| `DatesService`       | `useFormat`, `useNow`, `useNowDateTime`, `useAddDays`, `useIsBefore`, ... |
| `TimingService`      | `useDelay`, `useSetTimeout`, `useInterval`, `useDebounce`, `useThrottle`  |
| `ReactiveService`    | `useCreateSignal`, `useCreateEffect`, `useCreateMemo`, ...                |
| `DataUtils`/`SystemUtils`/`AppUtils` | `useUnique`, `useChunk`, `useGroupBy`, `useRetry`, ... |
| `ViewportService`    | `useGetViewportSize`, `useScrollToTop`, `usePrefersReducedMotion`, ...    |
| `SensorsUtils`       | `useGetGeolocation`, `useGetMediaStream`, `useVibrate`, ...               |
| `ObserverService`    | `useCreate`, `useObserve`, `useObserveAll`, `useDisconnect`, ...          |
| `LazyLoaderService`  | `useInit`, `useStop`, `useStopAll`                                        |
| `WorkerService`      | `useRun`, `useCreatePool`, `useRunPool`, `useTerminate`                   |
| `ThemeService`       | `useInitTheme`, `useSetThemeMode`, `useToggleTheme`, ...                  |

## Express server (subpath)

`import { ServerExpress, router, ProductController } from "katanakit/adapters/express"`

- `ServerExpress.getInstance().useStart()` — start on `http://localhost:3000`.
- `ServerExpress.getInstance().useGetApp()` — the raw Express app.
