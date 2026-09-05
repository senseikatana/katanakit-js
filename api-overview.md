# API Overview

Complete reference for katanakit-js services and adapters.

This page provides an overview of every public service in `katanakit-js`. All
methods are importable from the main barrel unless noted otherwise.

## HttpClient — `FetchApiManager`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useInit` | `(apis: Record<string, ApiConfig>) => void` | Register API definitions |
| `useGetApis` | `() => Record<string, ApiConfig>` | Get registered APIs |
| `useBuildUrl` | `(api, endpoint, opts?) => string` | Build a safe URL with params |
| `useFetch` | `(url, opts?) => Promise<FetchResult<T>>` | Generic fetch with Safe Result |
| `useGet` | `(api, endpoint, opts?) => Promise<FetchResult<T>>` | GET request |
| `usePost` | `(api, endpoint, body?, opts?) => Promise<FetchResult<T>>` | POST request |
| `usePut` | `(api, endpoint, body?, opts?) => Promise<FetchResult<T>>` | PUT request |
| `useDelete` | `(api, endpoint, opts?) => Promise<FetchResult<T>>` | DELETE request |

## Logger — `LoggerService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useLog` | `(level?, message, data?) => void` | Log a message |
| `useError` | `(message, data?) => void` | Log at error level |
| `useClear` | `() => void` | Clear log history |
| `useTable` | `(data, columns?) => void` | Console table output |
| `useSetStrategy` | `(strategy: LogStrategy) => void` | Swap output strategy |

## Storage — `StorageService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useGetStorage` | `<T>(key) => T \| null` | Get a value |
| `useSetStorage` | `(key, value) => void` | Set a value |
| `useRemoveStorage` | `(key) => void` | Remove a value |
| `useClearStorage` | `() => void` | Clear all values |

## DOM — `DomService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useQuerySelector` | `<T>(selector) => T \| null` | Query a single element |
| `useQuerySelectorAll` | `<T>(selector) => T[]` | Query all matching elements |
| `useAddClass` | `(el, ...classes) => void` | Add CSS classes |
| `useRemoveClass` | `(el, ...classes) => void` | Remove CSS classes |
| `useToggleClass` | `(el, className) => boolean` | Toggle a CSS class |
| `useOn` | `(el, event, handler) => () => void` | Add event listener (returns unsubscribe) |
| `useSetText` | `(el, text) => void` | Set text content |
| `useSetHtml` | `(el, html) => void` | Set innerHTML |
| `useGetRoot` | `() => Element \| null` | Get document root |

## Reactive — `ReactiveService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useCreateSignal` | `<T>(initial) => [Accessor, Setter]` | Create a reactive signal |
| `useCreateEffect` | `(fn) => void` | Run a side effect on dependency change |
| `useCreateMemo` | `<T>(fn) => Accessor<T>` | Create a memoized derived value |
| `useCreateToggle` | `(initial?) => [Accessor, Toggle]` | Boolean toggle signal |
| `useCreateStorageSignal` | `(key, initial) => [Accessor, Setter]` | Signal persisted to storage |
| `useCreateDebouncedSignal` | `<T>(initial, delay) => [Accessor, Setter]` | Debounced signal |
| `useCreateBatch` | `() => Batch` | Batch multiple signal updates |

## Formatter — `FormatterService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useFormatNumber` | `(value, locale?, opts?) => string` | Format a number |
| `useFormatCurrency` | `(value, currency, locale?) => string` | Format currency |
| `useFormatDate` | `(date, locale?, opts?) => string` | Format a date |
| `useCapitalize` | `(str) => string` | Capitalize first letter |
| `useUpperCase` | `(str) => string` | Convert to uppercase |
| `useJsonStringify` | `(data, indent?) => string` | JSON stringify |

## Converter — `ConverterService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useToCelsius` | `(fahrenheit) => number` | Fahrenheit to Celsius |
| `useToFahrenheit` | `(celsius) => number` | Celsius to Fahrenheit |
| `useToMiles` | `(km) => number` | Kilometers to miles |
| `useToKilos` | `(miles) => number` | Miles to kilometers |
| `useToRem` | `(px, base?) => number` | Pixels to rem |
| `useToPx` | `(rem, base?) => number` | Rem to pixels |

## Errors — `ErrorFactoryService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useBadRequest` | `(message?) => AppError` | 400 error |
| `useUnauthorized` | `(message?) => AppError` | 401 error |
| `useForbidden` | `(message?) => AppError` | 403 error |
| `useNotFound` | `(message?) => AppError` | 404 error |
| `useInternal` | `(message?) => AppError` | 500 error |
| `useCustom` | `(status, message) => AppError` | Custom error |

## Generator — `GeneratorService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useUuid` | `() => string` | Generate a UUID |
| `useSlugify` | `(str) => string` | Generate a URL slug |
| `useNumericId` | `() => number` | Generate a numeric ID |
| `useToken` | `(length?) => string` | Generate a random token |
| `useEncrypt` | `(data, salt?) => Promise<string>` | Encrypt data |

## Dates — `DatesService`

Uses the Temporal API via `@js-temporal/polyfill`.

| Method | Signature | Description |
|--------|-----------|-------------|
| `useNow` | `() => Temporal.Instant` | Current timestamp |
| `useFormat` | `(date, format?) => string` | Format a date |
| `useAddDays` | `(date, days) => Temporal.PlainDate` | Add days |
| `useIsBefore` | `(a, b) => boolean` | Compare dates |
| `useDiff` | `(a, b) => Temporal.Duration` | Difference between dates |
| `useLastDayOfMonth` | `(date) => number` | Last day of the month |

## Geometry — `GeometryUtils`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useCircle` | `(radius) => { area, perimeter }` | Circle calculations |
| `useSphere` | `(radius) => { area, volume }` | Sphere calculations |
| `useDistance` | `(a, b) => number` | Distance between points |
| `useIntersect` | `(a, b) => boolean` | Rectangle intersection |

## Timing — `TimingService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useDelay` | `(ms) => Promise<void>` | Sleep/delay |
| `useSetTimeout` | `(fn, ms) => () => void` | Set timeout (returns cancel) |
| `useInterval` | `(fn, ms) => () => void` | Set interval (returns cancel) |
| `useDebounce` | `(fn, ms) => Function` | Debounce a function |
| `useThrottle` | `(fn, ms) => Function` | Throttle a function |
| `useRepeat` | `(fn, ms, count) => () => void` | Repeat N times |
| `useRace` | `(fns) => Promise<any>` | Race multiple async functions |

## Viewport — `ViewportService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useBreakpoint` | `(name) => boolean` | Check breakpoint |
| `useScrollTo` | `(target, opts?) => void` | Scroll to element |
| `usePrefersReducedMotion` | `() => boolean` | Check reduced motion preference |

## Observer — `ObserverService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useCreate` | `(config) => IntersectionObserver` | Create an observer |
| `useObserve` | `(el, callback) => () => void` | Observe a single element |
| `useObserveAll` | `(selector, callback) => () => void` | Observe all matching elements |
| `useDisconnect` | `() => void` | Disconnect all observers |

## Worker — `WorkerService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useRun` | `(script, data?) => Promise<any>` | Run a one-shot worker |
| `useCreatePool` | `(size) => WorkerPool` | Create a worker pool |
| `useRunPool` | `(pool, script, data?) => Promise<any>` | Run via pool |
| `useTerminate` | `() => void` | Terminate all workers |

## Theme — `ThemeService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useInitTheme` | `(opts?) => void` | Initialize theme |
| `useSetThemeMode` | `(mode) => void` | Set light/dark mode |
| `useToggleTheme` | `() => void` | Toggle theme |
| `useResetTheme` | `() => void` | Reset to system preference |

## Astro — `AstroService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useGetStaticPaths` | `(getCollection, name, opts) => Promise<SafeResult>` | Convert collections to getStaticPaths |
| `usePathsFrom` | `(items, opts) => SafeResult` | Generate paths from items |
| `useFindEntry` | `(collection, slug) => SafeResult` | Find a collection entry |
| `useGeneratePagination` | `(items, pageSize) => SafeResult` | Generate pagination |

## RSS — `RssService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `useGenerateRss` | `(config) => SafeResult<string>` | Generate RSS XML |
| `useRssLinkTag` | `(config) => string` | Generate `<link>` tag |
| `useCreateRssEndpoint` | `(config) => GET handler` | Create Astro GET endpoint |
| `useCreateRssEndpointFromConfig` | `(siteConfig, items) => GET handler` | Endpoint from SiteConfig |

## SEO — `useHeadTags` and friends

| Method | Signature | Description |
|--------|-----------|-------------|
| `useHeadTags` | `(config, meta) => string` | All `<head>` tags |
| `useGenerateMetaTags` | `(config, meta) => string` | Meta tags only |
| `useTitle` | `(title, siteName?) => string` | Format page title |
| `useRssHeadLink` | `(config) => string` | RSS `<link>` tag |

## Framework adapters

### Nuxt — `katanakit-js/adapters/nuxt`

| Function | Description |
|----------|-------------|
| `useUnwrap(result, context?)` | Unwrap Safe Result or throw H3-compatible error |
| `useSafeResponse(result)` | Shape result as JSON response |
| `useEventResponse(event, result)` | Set H3 status code and return data |

### Vue — `katanakit-js/adapters/vue`

| Composable | Description |
|------------|-------------|
| `useKatanaFetch(api, endpoint, opts?)` | Reactive fetch with `data`, `error`, `loading`, `refetch` |

### Express — `katanakit-js/adapters/express`

| Export | Description |
|--------|-------------|
| `ServerExpress` | Reference Express server (Singleton) |
| `router` | Demo router |
| `ProductController` | Demo controller |
