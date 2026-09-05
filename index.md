# KatanaKit

A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.

## Why KatanaKit

Modern frontend and full-stack apps keep reimplementing the same plumbing:
fetching an API safely, logging, persisting to storage, querying the DOM,
reacting to state changes, generating slugs, formatting dates and money,
building RSS/SEO output. KatanaKit provides all of that as a single, typed and
tree-shakeable set of `use*` services with a consistent API.

## Features

- **Safe Result** — every async operation returns a discriminated union `{ data, error, ok }` instead of throwing.
- **Hexagonal architecture** — pure core, infrastructure adapters, framework adapters, shared contracts.
- **Zero side effects on import** — importing any module never triggers network calls, timers, or DOM mutations.
- **SSR-safe** — browser-only adapters guard or fall back gracefully when `window` is unavailable.
- **Tree-shakeable** — destructured re-exports from Singleton facades. Only pay for what you use.
- **Type-safe** — full TypeScript with strict mode. Contracts in `types/`, implementations follow.

## Services at a glance

| Service | What it does | Entry |
|---------|-------------|-------|
| **HttpClient** | Fetch wrapper with interceptors, retry, Safe Results | `useGet`, `usePost`, … |
| **Logger** | Levelled logger with structured output | `useLog` |
| **Storage** | SSR-safe `localStorage` / `sessionStorage` wrapper | `useStorage` |
| **DomService** | Safe DOM queries, class toggles, attribute helpers | `useQuery`, `useClass` |
| **Reactive** | Lightweight signals with computed and effects | `useSignal`, `useComputed` |
| **Formatter** | Number, date, string and URL formatting | `useFormat` |
| **Converter** | Unit conversion (px↔rem, ms↔s, …) | `useConvert` |
| **ErrorFactory** | Structured error creation with codes | `useError` |
| **Generator** | UUIDs, random strings, hashes | `useUuid`, `useHash` |
| **DatesService** | Temporal API wrapper (via polyfill) | `useNow`, `useFormat` |
| **Geometry** | Point, rect, distance, intersection helpers | `useDistance` |
| **TimingService** | Debounce, throttle, delay, intervals | `useDebounce` |
| **Viewport** | Breakpoint detection, scroll direction | `useBreakpoint` |
| **Observer** | IntersectionObserver, MutationObserver wrappers | `useObserve` |
| **WorkerService** | Web Worker pool with task correlation | `useRunPool` |
| **ThemeService** | Dark/light mode detection and toggling | `useTheme` |
| **AstroService** | Astro adapter: request parsing, SSR helpers | `useAstro` |
| **RssService** | RSS/Atom feed generation | `useRss` |
| **SiteConfig / SEO** | Site configuration and meta tag generation | `useSiteConfig` |
| **Vue adapter** | `useKatanaFetch` composable for Vue 3 | `katanakit-js/adapters/vue` |
| **Nuxt adapter** | `useUnwrap`, `useSafeResponse`, `useEventResponse` | `katanakit-js/adapters/nuxt` |
| **Express adapter** | Reference server with CORS, body parsing | `katanakit-js/adapters/express` |
