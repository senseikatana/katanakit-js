---
title: KatanaKit
description: A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.
template: splash
hero:
  tagline: >
    HTTP client, logger, storage, DOM helpers, reactive signals, formatting,
    dates, geometry, and framework adapters — all with hexagonal architecture
    and zero side effects on import.
  actions:
    - text: Get Started
      link: /katanakit-js/guides/getting-started/
      icon: right-arrow
      variant: primary
    - text: API Reference
      link: /katanakit-js/api/
      icon: open-book
      variant: secondary
    - text: GitHub
      link: https://github.com/senseikatana/katanakit-js
      icon: external
      variant: minimal
---

import { Card, CardGrid } from '@astrojs/starlight/components';

<CardGrid>
  <Card title="Framework-agnostic" icon="puzzle">
    Works with Astro, Vue, Nuxt, Express, or vanilla TypeScript. Adapters are optional peer dependencies.
  </Card>
  <Card title="Hexagonal architecture" icon="setting">
    Pure domain core, infrastructure adapters, and shared contracts — clean separation of concerns.
  </Card>
  <Card title="Zero side effects" icon="approve-check">
    Importing any service is safe. No top-level `fetch`, no `console.log`, no storage writes.
  </Card>
  <Card title="Safe Results" icon="warning">
    Fallible operations return `{ data, error, ok }` discriminated unions instead of throwing.
  </Card>
  <Card title="Tree-shakeable" icon="rocket">
    Destructured re-exports from Singleton facades. Only pay for what you use.
  </Card>
  <Card title="Type-safe" icon="star">
    Full TypeScript with strict mode. Contracts in `types/`, implementations follow.
  </Card>
</CardGrid>

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
| **Geometry** | Point, rect, distance, intersection helpers | `useDistance`, `useIntersect` |
| **TimingService** | Debounce, throttle, delay, intervals | `useDebounce`, `useThrottle` |
| **Viewport** | Breakpoint detection, scroll direction | `useBreakpoint` |
| **Sensors** | Device orientation, battery, network info | `useOrientation` |
| **Observer** | IntersectionObserver, MutationObserver wrappers | `useObserve` |
| **WorkerService** | Web Worker pool with task correlation | `useRunPool` |
| **ThemeService** | Dark/light mode detection and toggling | `useTheme` |
| **AstroService** | Astro adapter: request parsing, SSR helpers | `useAstro` |
| **RssService** | RSS/Atom feed generation | `useRss` |
| **SiteConfig / SEO** | Site configuration and meta tag generation | `useSiteConfig`, `useGenerateMetaTags` |
| **Vue adapter** | `useKatanaFetch` composable for Vue 3 | `katanakit-js/adapters/vue` |
| **Nuxt adapter** | `useUnwrap`, `useSafeResponse`, `useEventResponse` | `katanakit-js/adapters/nuxt` |
| **Express adapter** | Reference server with CORS, body parsing | `katanakit-js/adapters/express` |
