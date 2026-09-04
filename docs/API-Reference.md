# API Reference

Complete reference for `katanakit-js` **2.1.4**. Every signature in this
document was checked against the source code in `src/`.

Two import entry points exist:

- **Main barrel** — `import { ... } from "katanakit-js"`. Exposes the Astro and
  RSS services, site config and SEO helpers, all `core` services, all
  `infrastructure` services and every shared type.
- **Subpaths** — `katanakit-js/adapters/express` and
  `katanakit-js/adapters/nuxt` (framework-specific, published separately).

Services are Singleton facades. In this document, "destructured export" means
the method is also available as a standalone named export of the module.

---

## HTTP client — `FetchApiManager`

`src/core/services/http.service.ts`. Framework-agnostic HTTP client that builds
URLs from a JSON-defined registry and wraps `fetch` in a Safe Result.

```ts
import {
  FetchApiManager,
  useInit, useGetApis, useBuildUrl,
  useFetch, useGet, usePost, usePut, useDelete,
} from "katanakit-js";
```

| Method | Signature | Notes |
| ------ | --------- | ----- |
| `getInstance` | `static getInstance(): FetchApiManager` | Singleton accessor. |
| `useInit` | `(apis: ApisConfig): void` | Registers (merges) API definitions. Call once at startup. |
| `useGetApis` | `(): ApisConfig` | Returns the current registry. |
| `useBuildUrl` | `(apiName: string, endpointName: string, options?: UrlOptions): string` | Substitutes `:param` placeholders (`encodeURIComponent`), merges default + custom query params, rejects non-`http(s)` schemes. Throws if the API/endpoint is unknown. |
| `useFetch` | `<T = unknown>(apiName: string, endpointName: string, options?: FetchOptions): Promise<FetchResult<T>>` | Low-level fetch. |
| `useGet` | `<T = unknown>(apiName, endpointName, urlOptions?: UrlOptions): Promise<FetchResult<T>>` | `GET` wrapper. |
| `usePost` | `<T = unknown>(apiName, endpointName, body?: unknown, urlOptions?: UrlOptions): Promise<FetchResult<T>>` | `POST` with JSON `Content-Type`; serializes `body` when provided. |
| `usePut` | same as `usePost` | `PUT` wrapper. |
| `useDelete` | `<T = unknown>(apiName, endpointName, urlOptions?: UrlOptions): Promise<FetchResult<T>>` | `DELETE` wrapper. |

All fetch methods are **destructured exports**: `useInit`, `useGetApis`,
`useBuildUrl`, `useFetch`, `useGet`, `usePost`, `usePut`, `useDelete`.

### Shape of the config

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type QueryParams = Record<string, string | number | boolean | undefined | null>;
type PathParams = Record<string, string | number>;

interface UrlOptions {
  params?: PathParams;              // replaces :param placeholders
  query?: QueryParams;              // merged with defaults
  ignoreDefaultQuery?: boolean;     // skip defaultQueryParams when true
}

interface ApiEntry {
  baseUri: string | URL;
  endpoints: Record<string, string>;        // e.g. { userById: "/users/:id" }
  defaultQueryParams?: Record<string, QueryParams>;
}

type ApisConfig = Record<string, ApiEntry>;
interface FetchOptions extends RequestInit { urlOptions?: UrlOptions; }
```

### Safe Result

```ts
type FetchResult<T = unknown> =
  | { data: T; error: null; url: string; status: number; ok: true }
  | { data: null; error: ApiError; url: string; status: number; ok: false };

interface ApiError { message: string; status: number; details?: unknown; }
```

Non-2xx responses resolve to the error branch with the parsed body as
`details`; network failures resolve with `status: 0`. Nothing throws.

---

## Logger — `LoggerService`

`src/core/services/logger.service.ts`.

```ts
import { LoggerService, ConsoleStrategy, type LogStrategy, type LogLevel } from "katanakit-js";
```

| Method | Signature | Notes |
| ------ | --------- | ----- |
| `getInstance` | `static getInstance(): LoggerService` | |
| `useSetStrategy` | `(strategy: LogStrategy): void` | Replaces the output strategy at runtime. |
| `useLog` | `(message: string, data?: unknown): void` **or** `(level: LogLevel, message: string, data?: unknown): void` | Overloaded. Without a level, logs at `"info"`. |
| `useError` | `(message: string, data?: unknown): void` | Logs at `"error"`. |
| `useClear` | `(): void` | `console.clear()`. |
| `useTable` | `(data: unknown): void` | `console.table(data)`. |

Destructured exports: `useLog`, `useError`, `useClear`, `useTable`,
`useSetStrategy`.

```ts
type LogLevel = "log" | "info" | "warn" | "error" | "debug";

// Strategy contract you can implement for your own output backend:
interface LogStrategy {
  useOutput(level: LogLevel, message: string, data?: unknown): void;
}
```

`ConsoleStrategy` (the default) writes `[LEVEL] message` (plus `data`) to the
native console.

---

## Storage — `StorageService`

`src/infrastructure/storage/storage.service.ts`.

```ts
import {
  StorageService,                        // default-exported class, named in barrel
  LocalStorageStrategy,
  SessionStorageStrategy,
  MemoryStorageStrategy,
  useGetStorage, useSetStorage, useRemoveStorage, useClearStorage,
  type StorageTarget, type StorageStrategy,
} from "katanakit-js";
```

| Method | Signature | Notes |
| ------ | --------- | ----- |
| `getInstance` | `static getInstance(): StorageService` | |
| `useGetStorage` | `<T = unknown>(key: string, target?: StorageTarget): T \| null` | Reads and JSON-parses; `target` defaults to `"localStorage"`. |
| `useSetStorage` | `(key: string, value: unknown, target?: StorageTarget): void` | JSON-serializes non-string values. |
| `useRemoveStorage` | `(key: string, target?: StorageTarget): void` | |
| `useClearStorage` | `(target?: StorageTarget): void` | |

Destructured exports: `useGetStorage`, `useSetStorage`, `useRemoveStorage`,
`useClearStorage`.

```ts
type StorageTarget = "localStorage" | "sessionStorage";
interface StorageStrategy {
  useGetItem<T = unknown>(key: string): T | null;
  useSetItem(key: string, value: unknown): void;
  useRemoveItem(key: string): void;
  useClear(): void;
}
```

The strategies implement the same `use*` contract. When `window` is absent
(SSR/Node/Bun) the service silently uses `MemoryStorageStrategy`, so importing
this module never crashes outside the browser.

---

## DOM — `DomService`

`src/infrastructure/dom/dom.service.ts`. SSR-safe facade over `document`.

```ts
import { DomService, DOM_SERVICE, useGetRoot, useAddClass, useOn, /* ... */ } from "katanakit-js";
```

`DOM_SERVICE` is the singleton instance. All methods below are destructured
exports as well. Selectors/targets accept either an `Element`/`HTMLElement` or
a CSS selector `string`.

### Querying

| Method | Signature |
| ------ | --------- |
| `useIsBrowser` | `(): boolean` |
| `useGetRoot` | `(): HTMLElement \| null` |
| `useGetBody` | `(): HTMLBodyElement \| null` |
| `useGetElementById` | `<T extends HTMLElement = HTMLElement>(id: string): T \| null` |
| `useGetElementByClass` | `<T extends HTMLElement = HTMLElement>(className: string): T \| null` (adds a leading `.` if missing) |
| `useQuerySelector` | overloaded: `<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] \| null` and `<E extends Element = HTMLElement>(selector: string): E \| null` |
| `useQuerySelectorAll` | overloaded: tag-name map variant returning arrays, and `<E extends Element = HTMLElement>(selector: string): E[]` |

### Class and attribute helpers

| Method | Signature |
| ------ | --------- |
| `useAddClass` | `(target: Element \| string, className: string): void` |
| `useRemoveClass` | `(target: Element \| string, className: string \| string[]): void` |
| `useToggleClass` | `(target: Element \| string, className: string, force?: boolean): boolean \| undefined` |
| `useHasClass` | `(target: Element \| string, className: string): boolean` |
| `useGetAttribute` | `(target: Element \| string, attr: string): string \| null` |
| `useSetAttribute` | `(target: Element \| string, attr: string, value: string): void` — **throws** for `on*` event attributes (XSS guard); use `useOn` instead |
| `useRemoveAttribute` | `(target: Element \| string, attr: string): void` |
| `useGetDataAttribute` | `(target: HTMLElement \| string, key: string): string \| undefined` |
| `useSetDataAttribute` | `(target: HTMLElement \| string, key: string, value: string): void` |

### Events and mutation

| Method | Signature |
| ------ | --------- |
| `useOn` | `<K extends keyof HTMLElementEventMap>(target: EventTarget \| string, event: K, callback: (event: HTMLElementEventMap[K]) => void, options?: boolean \| AddEventListenerOptions): (() => void) \| null` — returns an unsubscribe function (or `null` when unavailable) |
| `useCreateElement` | `<T extends keyof HTMLElementTagNameMap>(tagName: T, options?: ElementCreationOptions): HTMLElementTagNameMap[T]` — throws outside the browser |
| `useSetHtml` | `(target: Element \| string, html: string): void` — XSS sink, trusted HTML only |
| `useSetText` | `(target: Element \| string, text: string): void` |
| `useAppend` | `(target: Element \| string, child: Element \| string): void` |
| `useRemove` | `(target: Element \| string): void` |

In non-browser environments query methods return `null`/`[]`, `useOn` returns
`null`, and mutations no-op.

---

## Reactive — `ReactiveService`

`src/core/services/reactive.service.ts`. Signals kernel (publisher/subscriber)
with explicit dependency arrays and batching.

```ts
import { ReactiveService, useCreateSignal, useCreateEffect, /* ... */ } from "katanakit-js";
```

| Method | Signature | Behavior |
| ------ | --------- | -------- |
| `useCreateSignal` | `<T>(initialValue: T): [SignalGetter<T>, SignalSetter<T>]` | Getter is callable (`get()`); it also exposes `get.useSubscribe(listener): () => void`. Setter accepts a value or an updater `(prev) => next` and notifies only on change. |
| `useCreateEffect` | `(callback: () => void \| (() => void), signals: Subscribable<unknown>[]): () => void` | Runs immediately, cleans up between runs, returns a stop function. |
| `useCreateMemo` | `<T>(computation: () => T, signals: Subscribable<unknown>[]): SignalGetter<T>` | Cached derived value. |
| `useCreateToggle` | `(initialValue?: boolean): [SignalGetter<boolean>, ToggleSignalSetter]` | Second tuple element: `{ useSet(value), useToggle() }`. |
| `useCreateStorageSignal` | `<T>(key: string, fallbackValue: T, target?: StorageTarget): [SignalGetter<T>, SignalSetter<T>]` | Hydrates from storage; every set also writes to storage. |
| `useCreateDebouncedSignal` | `<T>(initialValue: T, delayMs?: number): [SignalGetter<T>, SignalSetter<T>]` | Setter debounces by `delayMs` (default `300`). |
| `useCreateBatch` | `(): (callback: () => void) => void` | Runs the callback and coalesces all notifications until it returns. |

```ts
type SignalListener<T> = (newValue: T, oldValue: T) => void;
interface Subscribable<T> { useSubscribe(listener: SignalListener<T>): () => void; }
type SignalGetter<T> = Subscribable<T> & (() => T);
type SignalSetter<T> = (newValue: T | ((prev: T) => T)) => void;
interface ToggleSignalSetter { useSet(value: boolean): void; useToggle(): void; }
```

Destructured exports: `useCreateSignal`, `useCreateEffect`, `useCreateMemo`,
`useCreateToggle`, `useCreateStorageSignal`, `useCreateDebouncedSignal`,
`useCreateBatch`.

---

## Formatting — `FormatterService`

`src/core/services/formatter.service.ts`.

| Method | Signature | Notes |
| ------ | --------- | ----- |
| `useFormatNumber` | `(value: number, locale?: Locale, digits?: number): string` | `Intl.NumberFormat`, defaults `locale = "en"`, `digits = 2`. |
| `useFormatCurrency` | `(options: CurrencyFormatOptions): string` | Adds taxes then formats; see below. |
| `useJsonStringify` | `(data: unknown): string` | Pretty-printed with 3-space indent. |
| `useJsonParse` | `<T = unknown>(json: string): T` | |
| `useUpperCase` | `(text: string, locale?: Locale): string` | Trimmed `toLocaleUpperCase`. |
| `useLowerCase` | `(text: string, locale?: Locale): string` | Trimmed `toLocaleLowerCase`. |
| `useCapitalize` | `(text: string, locale?: Locale): string` | First character uppercased. |

Destructured exports: `useFormatCurrency`, `useFormatNumber`,
`useJsonStringify`, `useJsonParse`, `useUpperCase`, `useLowerCase`,
`useCapitalize`.

```ts
type Locale = "en" | "es" | "fr" | "de" | "it" | "pt" | "ja" | "zh";
type Currency = "EUR" | "USD" | "GBP" | "JPY" | "CAD" | "MXN" | "CHF"
              | "AUD" | "BRL" | "CNY" | "ARS" | "COP" | "CLP";

interface CurrencyFormatOptions {
  amount: number;
  currency?: Currency;      // default "USD"
  taxes?: number;           // 21 (percent) or 0.21 (fraction) — default 0
  locale?: Locale;          // default "en"
}
```

---

## Unit conversion — `ConverterService`

`src/core/services/formatter.service.ts` (same module). All methods format the
result with `FormatterService.useFormatNumber`:

```ts
useToCelsius(fahrenheit: number, locale?: Locale, digits?: number): string;   // °F → °C
useToFahrenheit(celsius: number, locale?: Locale, digits?: number): string;   // °C → °F
useToKilometers(miles: number, locale?: Locale, digits?: number): string;     // mi → km
useToMiles(km: number, locale?: Locale, digits?: number): string;             // km → mi
useToInches(cm: number, locale?: Locale, digits?: number): string;            // cm → in
useToCm(inches: number, locale?: Locale, digits?: number): string;            // in → cm
useToKilos(pounds: number, locale?: Locale, digits?: number): string;         // lb → kg
useToPounds(kilos: number, locale?: Locale, digits?: number): string;         // kg → lb
```

Destructured exports include every `useTo*` name above.

---

## Errors — `ErrorFactoryService` and `AppError`

`src/core/services/error.service.ts`.

```ts
import { ErrorFactoryService, AppError, useBadRequest, /* ... */ } from "katanakit-js";
```

| Method | Signature | Status |
| ------ | --------- | ------ |
| `useBadRequest` | `(message?: string): AppError` | 400 (default message `"Bad Request"`) |
| `useUnauthorized` | `(message?: string): AppError` | 401 |
| `useForbidden` | `(message?: string): AppError` | 403 |
| `useNotFound` | `(message?: string): AppError` | 404 |
| `useInternal` | `(message?: string): AppError` | 500 |
| `useCustom` | `(message: string, code: number): AppError` | any code |

Destructured exports: `useBadRequest`, `useUnauthorized`, `useForbidden`,
`useNotFound`, `useInternal`, `useCustom`.

```ts
class AppError extends Error {
  constructor(message?: string, public readonly code?: number); // code default 400
  useToJson(): ISerializedError;                                // { name, message, code }
}

interface ISerializedError { name: string; message: string; code: number; }
```

---

## Generator — `GeneratorService`

`src/core/services/generator.service.ts`.

| Method | Signature | Notes |
| ------ | --------- | ----- |
| `useNumericId` | `(): number` | Incrementing counter starting at 1. |
| `useUuid` | `(): string` | `globalThis.crypto.randomUUID()` with a v4 fallback. |
| `useSlugify` | `(text: string): string` | Normalizes (NFD), lowercases, strips accents, hyphenates. Throws on empty input. |
| `useToken` | `(): number` | 6-digit code from `crypto.getRandomValues` (fallback to `Math.random`). |
| `useEncrypt` | `(plainText: string, salt?: string): Promise<string>` | PBKDF2-SHA512, 100 000 iterations, returns `"salt:hash"`. Random 128-bit salt when none is given. |

Destructured exports: `useSlugify`, `useUuid`, `useNumericId`, `useToken`,
`useEncrypt`. The class also bundles two strategies: `LazyNodeCryptoStrategy`
and `NativeUuidStrategy`.

> `useEncrypt` is a one-way hash **demo**, not a password store — see
> [SECURITY.md](../SECURITY.md).

---

## Dates — `DatesService`

`src/core/services/dates.service.ts`. Adapter over the
`@js-temporal/polyfill` `Temporal` API.

```ts
type TemporalInput =
  | string | number | Date
  | Temporal.PlainDate | Temporal.PlainDateTime
  | Temporal.ZonedDateTime | Temporal.Instant;
```

| Method | Signature | Notes |
| ------ | --------- | ----- |
| `useDiff` | `(start: string \| Temporal.PlainDate, end: string \| Temporal.PlainDate): string` | Human string, e.g. `"1 years, 2 months and 3 days"`. |
| `useFormat` | `(dateInput: TemporalInput, locale?: Locale, options?: Intl.DateTimeFormatOptions): string` | Accepts strings, numbers (epoch ms), `Date`, `Instant`, plain/Zoned types. |
| `useNow` | `(): string` | Today as ISO `YYYY-MM-DD`. |
| `useNowDateTime` | `(): string` | Current local date-time ISO string. |
| `useAddDays` | `(date: string \| Temporal.PlainDate, days: number): string` | ISO result. |
| `useSubtractDays` | `(date: string \| Temporal.PlainDate, days: number): string` | |
| `useIsEqual` | `(date1, date2): boolean` | |
| `useIsBefore` | `(date1, date2): boolean` | |
| `useIsAfter` | `(date1, date2): boolean` | |
| `useFirstDayOfMonth` | `(date?: string \| Temporal.PlainDate): string` | Defaults to today. |
| `useLastDayOfMonth` | `(date?: string \| Temporal.PlainDate): string` | Defaults to today. |

Destructured exports: all of the above (`useDiff`, `useFormat`, `useNow`, ...).

---

## Geometry — `GeometryUtils`

`src/core/services/geometry.service.ts`. `GeometryUtils` groups three static
namespaces, each method returning a localized string via
`GeometryFormatOptions { locale?, digits?, unit? }` (defaults `en`, `2`).

```ts
import { GeometryUtils } from "katanakit-js";
GeometryUtils.area.useCircle(5, { unit: "cm²" });
```

### `GeometryUtils.area` (2D)

`useRectangle(width, height)`, `useSquare(side)`, `useTriangle(base, height)`,
`useCircle(radius)`, `useTrapezoid(parallelSide1, parallelSide2, height)`,
`useHexagon(side)`, `useEllipse(semiMajor, semiMinor)`,
`useParallelogram(base, height)`.

### `GeometryUtils.perimeter` (2D)

`useRectangle(width, height)`, `useSquare(side)`,
`useTriangle(side1, side2, side3)`, `useCircle(radius)`, `useHexagon(side)`,
`useTrapezoid(side1, side2, side3, side4)`, `useEllipse(semiMajor, semiMinor)`
(Ramanujan approximation), `useParallelogram(side1, side2)`.

### `GeometryUtils.volume` (3D)

`useCube(side)`, `useBox(length, width, height)`, `useSphere(radius)`,
`useCylinder(radius, height)`, `useCone(radius, height)`,
`usePyramid(baseArea, height)`.

Every method accepts an optional final `options?: GeometryFormatOptions`.
The standalone classes `GeometryArea`, `GeometryPerimeter` and
`GeometryVolume` are exported too.

---

## Timing — `TimingService`

`src/core/services/timing.service.ts`.

```ts
import { TimingService, useDelay, useSetTimeout, useInterval, /* ... */ } from "katanakit-js";
```

| Method | Signature | Notes |
| ------ | --------- | ----- |
| `useDelay` | `(ms: number): Promise<void>` | Resolves after `ms`. |
| `useSleep` | `(ms: number): Promise<void>` | Alias of `useDelay` (instance method; **not** destructured from `TimingService` — the destructured `useSleep` comes from `SystemUtils`). |
| `useSetTimeout` | `<T>(callback: () => T \| Promise<T>, ms: number): TimeoutControl<T>` | `{ promise, cancel() }`. |
| `useInterval` | `(callback: () => void \| Promise<void>, ms: number, immediate?: boolean): IntervalControl` | `{ pause(), resume(), stop(), isRunning() }`; calls never overlap. |
| `useDebounce` | `<T extends (...args: unknown[]) => unknown>(func: T, delayMs: number): (...args: Parameters<T>) => void` | Trailing debounce. |
| `useDebounceImmediate` | same generic signature | Runs on the leading edge too. |
| `useThrottle` | same generic signature | Leading-edge throttle. |
| `useThrottleTrailing` | same generic signature | Leading edge plus trailing invocation. |
| `useRepeat` | `(callback: (iteration: number) => void \| Promise<void>, iterations: number, delayMs?: number): Promise<void>` | Loops with optional delay between iterations. |
| `useRace` | `<T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T>` | Rejects with `Error(errorMessage)` on timeout. |

```ts
interface TimeoutControl<T> { promise: Promise<T>; cancel(): void; }
interface IntervalControl {
  pause(): void; resume(): void; stop(): void; isRunning(): boolean;
}
```

Destructured exports: `useDelay`, `useSetTimeout`, `useInterval`,
`useDebounce`, `useDebounceImmediate`, `useThrottle`, `useThrottleTrailing`,
`useRepeat`, `useRace`.

---

## Utilities — `DataUtils`, `SystemUtils`, `AppUtils`

`src/core/services/utils.service.ts`.

### `DataUtils`

| Method | Signature |
| ------ | --------- |
| `useUnique` | `<T>(array: T[]): T[]` |
| `useChunk` | `<T>(array: T[], size: number): T[][]` (throws if `size <= 0`) |
| `useGroupBy` | `<T>(array: T[], key: keyof T \| ((item: T) => string)): Record<string, T[]>` |
| `useIsObject` | `(item: unknown): item is Record<string, unknown>` |
| `useDeepClone` | `<T>(value: T): T` (`structuredClone`, JSON fallback) |
| `useDeepMerge` | `<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T` (recursive) |
| `usePick` | `<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>` |
| `useOmit` | `<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>` |

### `SystemUtils`

| Method | Signature |
| ------ | --------- |
| `useSleep` | `(ms: number): Promise<void>` |
| `useRetry` | `<T>(fn: () => Promise<T>, retries?: number, delayMs?: number): Promise<T>` (defaults `3`, `1000`) |
| `useCopyToClipboard` | `(text: string): Promise<boolean>` |
| `useGetUrlParams` | `(urlString: string): Record<string, string>` (empty object on parse failure) |
| `useRound` | `(value: string \| number, decimals?: number): number` (default `2`) |
| `useAverage` | `(numbers: number[]): number` (0 for empty input) |

### `AppUtils`

Facade exposing two readonly singletons: `AppUtils.getInstance().data` and
`.system`. Destructured exports for `DataUtils` and `SystemUtils` methods are
named exactly as above (`useUnique`...`useOmit`, `useSleep`...`useAverage`).

---

## Viewport — `ViewportService`

`src/infrastructure/viewport/viewport.service.ts`. All methods are SSR-safe.

```ts
import { ViewportService, useGetViewportSize, useScrollToTop, /* ... */ } from "katanakit-js";
```

| Method | Signature |
| ------ | --------- |
| `useGetViewportSize` | `(): ViewportSize` (`{ width, height }`; `0` in SSR) |
| `useMatchesMedia` | `(query: string): boolean` |
| `usePrefersReducedMotion` | `(): boolean` |
| `usePrefersDarkMode` | `(): boolean` |
| `useGetScrollY` | `(): number` |
| `useGetScrollX` | `(): number` |
| `useGetScrollPosition` | `(): ScrollPosition` (`{ x, y }`) |
| `useGetScrollProgress` | `(): number` (0..1) |
| `useIsAtTop` | `(threshold?: number): boolean` (default 0) |
| `useIsAtBottom` | `(threshold?: number): boolean` (default 50) |
| `useScrollTo` | `(x?: number, y?: number, behavior?: ScrollBehavior): void` (defaults `0, 0, "smooth"`; respects reduced motion) |
| `useScrollToTop` | `(smooth?: boolean): void` (default `true`) |
| `useScrollToBottom` | `(smooth?: boolean): void` |
| `useScrollToElement` | `(target: HTMLElement \| string, options?: ScrollOptions): boolean` |
| `usePrintPage` | `(): void` |
| `useFocusElement` | `(target: HTMLElement \| string): boolean` |
| `useBlurActiveElement` | `(): void` |
| `useGetActiveElement` | `(): Element \| null` |
| `useRequestFullscreen` | `(target?: HTMLElement): Promise<void>` (defaults to `document.documentElement`) |
| `useExitFullscreen` | `(): Promise<void>` |
| `useIsFullscreen` | `(): boolean` |
| `useIsDocumentVisible` | `(): boolean` |
| `useOnVisibilityChange` | `(callback: (isVisible: boolean) => void): () => void` (returns unsubscribe) |
| `useGetTitle` | `(): string` |
| `useSetTitle` | `(title: string): void` |
| `useSetTempTitle` | `(tempTitle: string, durationMs?: number): void` (default `3000`; restores previous title) |

Types: `ViewportSize`, `ScrollPosition`,
`ScrollOptions { behavior?, block?, inline? }`.

---

## Sensors — `SensorsUtils`

`src/infrastructure/sensors/sensors.service.ts`. Call through the exported
instance.

```ts
import { sensorsUtils, SensorsUtils } from "katanakit-js";
sensorsUtils.useGetGeolocation();
```

| Method | Signature | Notes |
| ------ | --------- | ----- |
| `useGetMediaStream` | `(constraints?: MediaStreamConstraints): Promise<MediaStream \| null>` | Default `{ video: true, audio: true }`; logs and returns `null` on denial/unsupported. |
| `useStopMediaStream` | `(stream: MediaStream \| null): void` | Stops every track. |
| `useGetFrontCamera` | `(): Promise<MediaStream \| null>` | `facingMode: "user"`. |
| `useGetBackCamera` | `(): Promise<MediaStream \| null>` | `facingMode: "environment"`. |
| `useGetGeolocation` | `(options?: PositionOptions): Promise<GeoPosition \| null>` | `GeoPosition { lat, lng, accuracy }`. |
| `useWatchGeolocation` | `(callback: (position: GeoPosition) => void, options?: PositionOptions): (() => void) \| null` | Returns a stop function. |
| `useRequestMotionPermission` | `(): Promise<boolean>` | iOS-style `DeviceOrientationEvent.requestPermission`. |
| `useOnDeviceOrientation` | `(callback: (event: DeviceOrientationEvent) => void): (() => void) \| null` | |
| `useOnDeviceMotion` | `(callback: (event: DeviceMotionEvent) => void): (() => void) \| null` | |
| `useVibrate` | `(pattern: number \| number[]): boolean` | |
| `useStopVibration` | `(): boolean` | Vibration with pattern `0`. |
| `useGetBattery` | `(): Promise<BatteryManager \| null>` | Experimental Battery API. |

`SensorsUtils.getInstance()` also works.

---

## Observer — `ObserverService` and `LazyLoaderService`

`src/infrastructure/observer/observer.service.ts`. These classes are **not**
destructured; use `getInstance()`.

### `ObserverService`

```ts
import { ObserverService } from "katanakit-js";
const observer = ObserverService.getInstance();
observer.useCreate("fade-in", (entry) => entry.target.classList.add("visible"));
observer.useObserve("fade-in", ".card");
```

| Method | Signature |
| ------ | --------- |
| `getInstance` | `static getInstance(): ObserverService` |
| `useIsSupported` | `static useIsSupported(): boolean` |
| `useCreate` | `(key: string, callback: ObserverCallback, options?: IntersectionObserverInit, autoUnobserve?: boolean): this` — re-creates the observer for `key` if it exists; default `options = { threshold: 0.1 }`, `autoUnobserve = true`. |
| `useObserve` | `(key: string, element: ObserverTarget): this` — `ObserverTarget = HTMLElement \| string`. |
| `useObserveAll` | `(key: string, selector: string): this` |
| `useUnobserve` | `(key: string, element: HTMLElement): this` |
| `useDisconnect` | `(key: string): this` |
| `useDisconnectAll` | `(): this` |
| `useHas` | `(key: string): boolean` |
| `useKeys` | `(): string[]` |

`ObserverCallback = (entry: IntersectionObserverEntry) => void`. When
`autoUnobserve` is `true`, the target is unobserved after its first
intersection.

### `LazyLoaderService`

Swaps `img[data-src]` into `img[src]` when images approach the viewport.

| Method | Signature |
| ------ | --------- |
| `getInstance` | `static getInstance(): LazyLoaderService` |
| `useInit` | `(key?: string, selector?: string, rootMargin?: string): this` — defaults `"default"`, `"img[data-src]"`, `"200px"`. |
| `useStop` | `(key: string): this` |
| `useStopAll` | `(): this` |
| `useHas` | `(key: string): boolean` |

---

## Worker — `WorkerService`

`src/infrastructure/worker/worker.service.ts`. Runs pure functions off the main
thread; falls back to main-thread execution when `Worker` is unavailable.

```ts
import { WorkerService } from "katanakit-js";
const workers = WorkerService.getInstance();
```

| Method | Signature |
| ------ | --------- |
| `getInstance` | `static getInstance(): WorkerService` |
| `useIsSupported` | `static useIsSupported(): boolean` |
| `useRun` | `<TInput, TOutput>(workerFunc: WorkerFunc<TInput, TOutput>, data: TInput): Promise<TOutput>` — one-shot worker; terminated and URL revoked afterwards. |
| `useCreatePool` | `<TInput, TOutput>(key: string, workerFunc: WorkerFunc<TInput, TOutput>): this` |
| `useRunPool` | `<TInput, TOutput>(key: string, data: TInput): Promise<TOutput>` — queued by `taskId` to avoid races; rejects if the pool is unknown. |
| `useTerminate` | `(key: string): this` |
| `useTerminateAll` | `(): this` |
| `useHasWorker` | `(key: string): boolean` |
| `useKeys` | `(): string[]` |

```ts
type WorkerFunc<TInput = unknown, TOutput = unknown> = (data: TInput) => TOutput | Promise<TOutput>;
```

Only serializable functions (no closures over the outer scope) can run in a real
worker; the SSR fallback calls the function directly.

---

## Theme — `ThemeService`

`src/infrastructure/theme/theme.service.ts`.

```ts
import { ThemeService, THEME_SERVICE, useInitTheme, /* ... */ } from "katanakit-js";
```

| Method | Signature | Notes |
| ------ | --------- | ----- |
| `useInitTheme` | `(options?: ThemeOptions): void` | Reads the stored mode, applies the theme, registers the media-query listener. |
| `useSetThemeMode` | `(mode: ThemeMode): void` | Persists to `localStorage` and applies. |
| `useGetThemeMode` | `(): ThemeMode` | Stored mode (`"light" \| "dark" \| "system"`). |
| `useGetResolved` | `(): "light" \| "dark"` | Effective mode (resolves `"system"`). |
| `usePrefersColorScheme` | `(): boolean` | `true` when OS prefers dark. |
| `useToggleTheme` | `(): void` | Flips the resolved mode. |
| `useResetTheme` | `(): void` | Clears storage, back to `"system"`. |
| `useDestroyTheme` | `(): void` | Removes the media-query listener. |

Destructured exports: `useInitTheme`, `useSetThemeMode`, `useGetThemeMode`,
`useGetResolved`, `usePrefersColorScheme`, `useToggleTheme`, `useResetTheme`,
`useDestroyTheme`. `THEME_SERVICE` is the singleton instance.

```ts
type ThemeMode = "light" | "dark" | "system";
interface ThemeOptions {
  defaultMode?: ThemeMode;       // default "system"
  storageKey?: string;           // default "theme"
  attribute?: string;            // default "data-theme"
  target?: HTMLElement;          // default: document root
  onChange?: (mode: ThemeMode, resolved: "light" | "dark") => void;
}
```

Applying sets `data-theme`/custom attribute and toggles `light`/`dark` CSS
classes on the target.

---

## Astro — `AstroService`

`src/adapters/astro/astro.service.ts`. Converts collections into
`getStaticPaths` payloads, returning a Safe Result for async helpers.

```ts
import { AstroService, usePathsFrom, useGetStaticPaths, /* ... */ } from "katanakit-js";
```

| Method | Signature |
| ------ | --------- |
| `usePathsFrom` | `<T, TParam extends string = "slug", TProps = T>(items: T[], options?: PathsOptions<T, TParam, TProps>): AstroPath<TParam, TProps>[]` |
| `useGetStaticPaths` | `<TData = unknown, TParam extends string = "slug", TProps = CollectionEntryLike<TData>>(getCollectionFn: (collection: string) => Promise<CollectionEntryLike<TData>[]>, collectionName: string, options?: PathsOptions<CollectionEntryLike<TData>, TParam, TProps>): Promise<AstroServiceResult<AstroPath<TParam, TProps>[]>>` |
| `useFindEntry` | `<T>(items: T[], value: string, keyFrom?: (item: T) => string \| number): T \| null` |
| `useGeneratePagination` | `<T, TParam extends string = "page">(items: T[], pageSize?: number, param?: TParam): AstroPath<TParam, PaginationProps<T>>[]` |
| `usePathsFromValues` | `<TParam extends string = "slug">(values: (string \| number)[], param?: TParam): AstroPath<TParam, string \| number>[]` |
| `useExtractUniqueValues` | `<T, V>(items: T[], keyFrom: (item: T) => V \| V[]): V[]` |

Destructured exports: `usePathsFrom`, `useGetStaticPaths`, `useFindEntry`,
`useGeneratePagination`, `usePathsFromValues`, `useExtractUniqueValues`.

### Default option behavior

`PathsOptions` defaults — `param: "slug"`; `valueFrom` falls back to
`item.slug ?? item.id`; `propsFrom` returns the item itself; `paramsFrom`
overrides everything when provided. Pagination defaults `pageSize = 10`,
`param = "page"`; the first page gets an `undefined` param (index route).

```ts
interface PathsOptions<T, TParam extends string = string, TProps = T> {
  param?: TParam;
  valueFrom?: (item: T) => string | number;
  propsFrom?: (item: T) => TProps;
  paramsFrom?: (item: T) => Record<string, string>;
}
interface AstroPath<TParam extends string = string, TProps = unknown> {
  params: Record<TParam, string | undefined>;
  props: TProps;
}
interface PaginationProps<T> { items: T[]; currentPage: number; totalPages: number; }
interface AstroServiceError { message: string; collectionName?: string; details?: unknown; }
type AstroServiceResult<T> =
  | { data: T; error: null; ok: true }
  | { data: null; error: AstroServiceError; ok: false };
interface CollectionEntryLike<TData = unknown> { id: string; slug?: string; data?: TData; [key: string]: unknown; }
```

---

## RSS — `RssService`

`src/adapters/astro/rss.service.ts`. Pure RSS 2.0 generation with no external
dependencies.

```ts
import { RssService, useGenerateRss, useRssLinkTag, /* ... */ } from "katanakit-js";
```

| Method | Signature |
| ------ | --------- |
| `useGenerateRss` | `(config: RssConfig): RssResult` — returns the XML string in a Safe Result. |
| `useRssLinkTag` | `(config: Pick<RssConfig, "title" \| "xmlPath">): string` — HTML `<link>` tag for `<head>`. |
| `useCreateRssEndpoint` | `(config: Omit<RssConfig, "items"> & { items: RssItem[] \| (() => RssItem[] \| Promise<RssItem[]>) }): (context: { site?: URL \| string }) => Promise<Response>` — Astro `GET` handler. |
| `useCreateRssEndpointFromConfig` | `(siteConfig: SiteConfig, items: RssItem[] \| (() => RssItem[] \| Promise<RssItem[]>)): (context: { site?: URL \| string }) => Promise<Response>` — convenience wrapper over a `SiteConfig`. |

Destructured exports: `useGenerateRss`, `useRssLinkTag`,
`useCreateRssEndpoint`, `useCreateRssEndpointFromConfig`.

```ts
interface RssItem {
  title: string;
  pubDate: Date | string;
  link: string;                 // absolute or site-relative, e.g. "/blog/post/"
  description?: string;
  content?: string;             // full HTML content (CDATA)
  categories?: string[];
  author?: string;
  customData?: string;
}
interface RssConfig {
  title: string;
  description: string;
  site: string;
  items: RssItem[];
  xmlPath?: string;             // default "/rss.xml"
  language?: string;            // default "en"
  customData?: string;          // injected into <channel>
  xslUrl?: string;              // optional XSL stylesheet
  lastBuildDate?: boolean;      // default true
  trailingSlash?: boolean;      // declared in RssConfig (item links prefixed
                                // with the site URL when they are relative)
}
type RssResult =
  | { data: string; error: null; ok: true }
  | { data: null; error: { message: string; details?: unknown }; ok: false };
```

`useCreateRssEndpoint` builds the handler so `items` can be a static array or a
sync/async factory (e.g. `getCollection`). The `site` falls back to
`context.site` when not set in the config; when no site can be resolved (or item
resolution fails) it returns a `500` JSON `Response`. Successful responses use
`Content-Type: application/xml; charset=utf-8` and
`Cache-Control: public, max-age=3600`.

---

## Site config and SEO

### `SiteConfig` and `siteConfig`

`src/config/site.config.ts`. A default `siteConfig` is exported; define your own
with the `SiteConfig` type in your application.

```ts
import { siteConfig, type SiteConfig } from "katanakit-js";

const config: SiteConfig = {
  site: "https://example.com",              // no trailing slash
  title: "My Blog",
  description: "A blog about TypeScript",
  lang: "en",
  author: "Jane Doe",
  ogImage: "/og-default.png",               // optional
  twitter: "johndoe",                       // optional, without @
  rss: { enabled: true, path: "/rss.xml", title?, description?, limit: 20 },
  seo: {
    noindex: false, canonical: true,
    openGraph: true, twitterCard: true, jsonLd: true,
  },
  nav: [ { label: "Home", href: "/", external?: false } ],  // optional
};
```

Defaults for `rss`: `enabled: true`, `path: "/rss.xml"`, `limit: 20`. Defaults
for `seo`: all toggles `true` except `noindex: false`.

### SEO functions

`src/config/seo.service.ts`. Pure functions returning HTML strings.

| Function | Signature | Notes |
| -------- | --------- | ----- |
| `useGenerateMetaTags` | `(config: SiteConfig, meta: SeoMeta): string` | Title, description, author, canonical, `noindex`, Open Graph (incl. article tags), Twitter Card and JSON-LD. Escapes output (`</script>` breakout-safe). |
| `useTitle` | `(config: SiteConfig, pageTitle?: string): string` | `<title>` only; appends `| <site title>` when the page title differs. |
| `useRssHeadLink` | `(config: SiteConfig): string` | RSS `<link>` tag; returns `""` when `config.rss.enabled` is false. |
| `useHeadTags` | `(config: SiteConfig, meta: SeoMeta): string` | `useGenerateMetaTags` + RSS link appended. |

```ts
interface SeoMeta {
  title: string;                    // suffixed with the site title
  description?: string;             // falls back to site description
  canonical?: string;               // absolute; derived from url if omitted
  url?: string;                     // absolute page URL
  ogImage?: string;                 // falls back to site ogImage
  ogType?: "website" | "article" | "profile";   // default "website"
  publishedTime?: string;           // ISO, for article
  modifiedTime?: string;            // ISO, for article
  author?: string;                  // article author
  tags?: string[];                  // article tags
  noindex?: boolean;
}
```

Full-title rule: if `meta.title === config.title`, no suffix is added.

---

## Nuxt adapter — `katanakit-js/adapters/nuxt`

`src/adapters/nuxt/nuxt.service.ts`. **Pure exported functions** (not
singletons). They never import `h3`; errors/responses use an H3-compatible
shape, so Nitro maps them correctly.

```ts
import { useUnwrap, useSafeResponse, useEventResponse } from "katanakit-js/adapters/nuxt";
```

### `useUnwrap<T>(result: FetchResult<T>, context?: string): T`

Returns `result.data` on success. On failure throws an
`Error & { statusCode: number }` whose message is
`context ? \`${context}: ${result.error.message}\` : result.error.message` and
whose `statusCode` is `result.error.status || 500`. Use it to return data
directly from a `defineEventHandler`:

```ts
// server/api/pokemon/[id].ts
import { useGet } from "katanakit-js";
import { useUnwrap } from "katanakit-js/adapters/nuxt";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const result = await useGet("pokeapi", "pokemonById", { params: { id } });
  return useUnwrap(result, `Pokemon ${id}`);
});
```

### `useSafeResponse<T>(result: FetchResult<T>)`

Returns a plain serializable object (does not read `event`):

```ts
{ data: T | null; error: { message: string; status: number } | null; ok: boolean }
```

### `useEventResponse<T>(event, result)`

Sets the response status on the H3 event and returns the payload:

```ts
useEventResponse<T>(
  event: { node: { res: { statusCode: number } } },
  result: FetchResult<T>,
): T | { error: string; status: number }
```

Success: `event.node.res.statusCode = 200` and returns `result.data`. Failure:
`statusCode = result.error.status || 500` and returns
`{ error: result.error.message, status: result.error.status }`.

---

## Express adapter — `katanakit-js/adapters/express`

Reference Express server and demo CRUD controller. Requires the `express`
optional peer dependency (plus `cors`/`dotenv` when used).

```ts
import {
  ServerExpress,
  app,
  useGetApp,
  useStart,
  ProductController,
  router,
} from "katanakit-js/adapters/express";
```

| Export | Description |
| ------ | ----------- |
| `ServerExpress` | Singleton (`ServerExpress.getInstance()`). |
| `useStart` | `(): void` — starts the server (defaults `port = 3000`, `host = "localhost"`), enables CORS from `CORS_ORIGINS`, disables `x-powered-by`, JSON/urlencoded parsers (100 kb), `/health`, your routes and error handling. |
| `useGetApp` | `(): Application` — raw Express app. |
| `app` | Ready instance: `const app = useGetApp()` (created when the module loads). |
| `ProductController` | In-memory CRUD demo: `useGetAll`, `useGetProductById`, `useCreateProduct`, `useUpsertProduct`, `useDeleteProductById`. |
| `router` | Demo user router (default export under the hood). |

---

## Type index

All contracts and shared types live in `src/types/index.ts` and are re-exported
from the main barrel (`import { type FetchResult, type RssConfig } from
"katanakit-js"`). Notable examples: `LogLevel`, `LogStrategy`, `Locale`,
`Currency`, `StorageTarget`, `StorageStrategy`, `TemporalInput`, `HttpMethod`,
`QueryParams`, `PathParams`, `UrlOptions`, `ApisConfig`, `ApiError`,
`FetchResult`, `ObserverTarget`, `ObserverCallback`, `ObserverConfig`,
`SignalListener`, `ThemeMode`, `ThemeOptions`, `ViewportSize`, `ScrollOptions`,
`GeoPosition`, `WorkerFunc`, `RssItem`, `RssConfig`, `RssResult`,
`SiteConfig`, `SeoMeta`, and the facade/strategy contracts `IFetchApiManager`,
`IFormatterService`, `IConverterService`, `IErrorFactory`, `IReactiveService`,
`IDomService`, `IThemeService`, `IAstroService`, `IRssService`, `IDataUtils`,
`ISystemUtils`, `IAppUtils`, `DatesServiceTypes`, `LogStrategy` and
`StorageStrategy`.
