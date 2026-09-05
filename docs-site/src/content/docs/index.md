---
title: KatanaKit
description: A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.
template: splash
hero:
  tagline: >
    Stop rewriting the same plumbing. HTTP client, logger, storage, DOM helpers,
    reactive signals, formatting, dates, geometry, and framework adapters —
    all typed, all tree-shakeable, all with zero side effects on import.
  actions:
    - text: Get Started
      link: /guides/getting-started/
      icon: right-arrow
      variant: primary
    - text: API Reference
      link: /api/
      icon: open-book
      variant: secondary
    - text: GitHub
      link: https://github.com/senseikatana/katanakit-js
      icon: external
      variant: minimal
---

import { Card, CardGrid, Tabs, TabItem, LinkButton } from '@astrojs/starlight/components';

## Why KatanaKit?

<CardGrid>
  <Card title="Safe Results" icon="warning">
    Every async operation returns `{ data, error, ok }` instead of throwing.
    No more uncaught exceptions in production.
  </Card>
  <Card title="Zero side effects" icon="approve-check">
    Importing any module is safe. No `fetch` calls, no `console.log`,
    no storage writes, no timers. Ever.
  </Card>
  <Card title="Hexagonal architecture" icon="setting">
    Pure core, infrastructure adapters, framework adapters. Clean separation
    that scales with your project.
  </Card>
  <Card title="Tree-shakeable" icon="rocket">
    Destructured re-exports from Singleton facades. Import only what you use.
    The rest gets eliminated at build time.
  </Card>
</CardGrid>

## Quick taste

<Tabs>
  <TabItem label="HTTP Client">
    ```ts
    import { useInit, useGet } from "katanakit-js";

    useInit({
      pokeapi: {
        baseUri: "https://pokeapi.co/api/v2",
        endpoints: { pokemonById: "/pokemon/:id/" },
      },
    });

    const result = await useGet<{ name: string }>(
      "pokeapi", "pokemonById", { params: { id: 25 } }
    );

    if (result.ok) {
      console.log(result.data.name); // "pikachu"
    } else {
      console.error(result.error.message);
    }
    ```
  </TabItem>
  <TabItem label="Reactive Signals">
    ```ts
    import { useCreateSignal, useCreateEffect } from "katanakit-js";

    const [count, setCount] = useCreateSignal(0);
    const [doubled, setDoubled] = useCreateSignal(0);

    useCreateEffect(() => {
      setDoubled(count() * 2);
    });

    setCount(5);
    console.log(doubled()); // 10
    ```
  </TabItem>
  <TabItem label="Logger">
    ```ts
    import { useLog, useError, LoggerService } from "katanakit-js";

    useLog("Server started on port 3000");
    useLog("warn", "Cache miss", { key: "user:42" });
    useError("Database connection failed");

    // Swap output strategy at runtime
    LoggerService.getInstance().useSetStrategy({
      useOutput: (level, msg, data) => sendToTelemetry(level, msg, data),
    });
    ```
  </TabItem>
  <TabItem label="Storage">
    ```ts
    import { useSetStorage, useGetStorage } from "katanakit-js";

    useSetStorage("theme", "dark");
    const theme = useGetStorage<string>("theme"); // "dark"

    // SSR-safe: uses in-memory fallback when window is unavailable
    ```
  </TabItem>
</Tabs>

## Services at a glance

| Service | What it does | Entry point |
|---------|-------------|-------------|
| **HttpClient** | Fetch with interceptors, Safe Results | `useGet`, `usePost`, `useFetch` |
| **Logger** | Levelled logging with pluggable output | `useLog`, `useError` |
| **Storage** | SSR-safe localStorage/sessionStorage | `useSetStorage`, `useGetStorage` |
| **DOM** | Safe queries, classes, events | `useQuerySelector`, `useOn` |
| **Reactive** | Signals, effects, memos | `useCreateSignal`, `useCreateEffect` |
| **Formatter** | Number, date, string formatting | `useFormatNumber`, `useCapitalize` |
| **Converter** | Unit conversion | `useToRem`, `useToCelsius` |
| **Errors** | Structured HTTP errors | `useNotFound`, `useUnauthorized` |
| **Generator** | UUIDs, slugs, tokens | `useUuid`, `useSlugify` |
| **Dates** | Temporal API wrapper | `useNow`, `useFormat`, `useAddDays` |
| **Geometry** | Points, rects, distances | `useDistance`, `useIntersect` |
| **Timing** | Debounce, throttle, delay | `useDebounce`, `useDelay` |
| **Viewport** | Breakpoints, scroll | `useBreakpoint`, `useScrollTo` |
| **Observer** | IntersectionObserver wrapper | `useObserve`, `useCreate` |
| **Worker** | Web Worker pool | `useRun`, `useRunPool` |
| **Theme** | Dark/light mode | `useToggleTheme`, `useInitTheme` |
| **Astro** | getStaticPaths adapter | `useGetStaticPaths` |
| **RSS** | Feed generation | `useCreateRssEndpoint` |
| **SEO** | Meta tags, JSON-LD | `useHeadTags`, `useGenerateMetaTags` |
| **Vue** | Vue 3 composable | `useKatanaFetch` |
| **Nuxt** | Nuxt/Nitro helpers | `useUnwrap`, `useSafeResponse` |
| **Express** | Reference server | `ServerExpress` |

## Installation

```bash
npm install katanakit-js
```

<LinkButton href="/guides/getting-started/" variant="primary">Read the full guide →</LinkButton>
