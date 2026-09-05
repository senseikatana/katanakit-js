---
title: Getting Started
description: Install KatanaKit and learn every service with real code examples.
sidebar:
  order: 1
---

import { Tabs, TabItem, Card, CardGrid, LinkButton } from '@astrojs/starlight/components';

This guide covers every service in `katanakit-js` with runnable examples.
Each section shows the API, a real-world usage, and the Safe Result pattern.

## Installation

```bash
npm install katanakit-js
# or
bun add katanakit-js
```

Only `@js-temporal/polyfill` is a runtime dependency. `express`, `cors`,
`dotenv` and `@prisma/orm-postgres` are optional peer dependencies.

## Import entry points

```ts
// Main barrel — everything except framework adapters
import { useGet, useLog, useSetStorage } from "katanakit-js";

// Framework subpaths
import { useUnwrap } from "katanakit-js/adapters/nuxt";
import { useKatanaFetch } from "katanakit-js/adapters/vue";
import { ServerExpress } from "katanakit-js/adapters/express";
```

---

## HTTP Client — `FetchApiManager`

The HTTP client registers your APIs once, then builds safe URLs and fetches
data with a discriminated union result.

### Register APIs

```ts
import { useInit } from "katanakit-js";

useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: {
      pokemonById: "/pokemon/:id/",
      pokemons: "/pokemon/",
    },
    defaultQueryParams: { pokemons: { limit: 20 } },
  },
  jsonplaceholder: {
    baseUri: "https://jsonplaceholder.typicode.com",
    endpoints: {
      posts: "/posts",
      postById: "/posts/:id",
    },
  },
});
```

### Build URLs

```ts
import { useBuildUrl } from "katanakit-js";

const url = useBuildUrl("pokeapi", "pokemonById", {
  params: { id: "pikachu" },
});
// => "https://pokeapi.co/api/v2/pokemon/pikachu/"
```

### GET with Safe Result

```ts
import { useGet } from "katanakit-js";

interface Pokemon {
  name: string;
  id: number;
  types: { type: { name: string } }[];
}

const result = await useGet<Pokemon>("pokeapi", "pokemonById", {
  params: { id: 25 },
});

if (result.ok) {
  console.log(result.data.name);   // "pikachu"
  console.log(result.data.types);  // [{ type: { name: "electric" } }]
} else {
  console.error(result.error.status, result.error.message);
}
```

### POST JSON

```ts
import { usePost } from "katanakit-js";

const result = await usePost("jsonplaceholder", "posts", {
  title: "Hello World",
  body: "My first post",
  userId: 1,
});

// result.ok === true, result.data has the created resource
```

### PUT and DELETE

```ts
import { usePut, useDelete } from "katanakit-js";

await usePut("jsonplaceholder", "postById", { title: "Updated" }, {
  params: { id: 1 },
});

await useDelete("jsonplaceholder", "postById", { params: { id: 1 } });
```

### The Safe Result type

Every fetch returns the same discriminated union:

```ts
type FetchResult<T> =
  | { data: T; error: null; url: string; status: number; ok: true }
  | { data: null; error: ApiError; url: string; status: number; ok: false };
```

This means you never need `try/catch` for HTTP errors. The `ok` field
discriminates the result, and TypeScript narrows the type automatically.

---

## Logger — `LoggerService`

```ts
import { useLog, useError, LoggerService, type LogStrategy } from "katanakit-js";

// Info level (default)
useLog("Application started");

// Named levels
useLog("warn", "Cache miss", { key: "user:42" });
useLog("error", "Database timeout", { query: "SELECT * FROM users" });
useError("Something went wrong"); // shorthand for error level

// Console table
useTable([{ name: "Pikachu", type: "Electric" }]);

// Swap output at runtime (Strategy pattern)
const telemetryStrategy: LogStrategy = {
  useOutput: (level, message, data) => {
    fetch("https://telemetry.example.com/log", {
      method: "POST",
      body: JSON.stringify({ level, message, data }),
    });
  },
};
LoggerService.getInstance().useSetStrategy(telemetryStrategy);
```

---

## Storage — `StorageService`

SSR-safe: when `window` is unavailable, an in-memory fallback is used.

```ts
import { useSetStorage, useGetStorage, useRemoveStorage, useClearStorage } from "katanakit-js";

// Set (JSON-serialized)
useSetStorage("user", { name: "John", role: "admin" });
useSetStorage("theme", "dark");

// Get (typed)
const user = useGetStorage<{ name: string; role: string }>("user");
const theme = useGetStorage<string>("theme"); // "dark"

// Remove / Clear
useRemoveStorage("theme");
useClearStorage();
```

---

## DOM — `DomService`

All methods are SSR-safe: they return `null`, `[]` or `false` when `document`
is unavailable.

```ts
import {
  useQuerySelector, useQuerySelectorAll, useAddClass, useRemoveClass,
  useToggleClass, useOn, useSetText, useSetHtml, useGetRoot,
} from "katanakit-js";

// Query elements
const btn = useQuerySelector<HTMLButtonElement>("button.submit");
const items = useQuerySelectorAll<HTMLElement>(".list-item");

// Class manipulation
const root = useGetRoot();
useAddClass(root!, "dark-mode");
useRemoveClass(root!, "dark-mode");
const isActive = useToggleClass(btn!, "active");

// Events (returns unsubscribe function)
const unsubscribe = useOn(btn!, "click", (e) => {
  console.log("Button clicked!", e.target);
});
// Later: unsubscribe();

// Content
useSetText(btn!, "Click me");
useSetHtml(btn!, "<strong>Bold</strong>");
```

---

## Reactive — `ReactiveService`

Lightweight signals with automatic dependency tracking.

```ts
import {
  useCreateSignal, useCreateEffect, useCreateMemo,
  useCreateToggle, useCreateStorageSignal, useCreateDebouncedSignal,
} from "katanakit-js";

// Basic signal
const [count, setCount] = useCreateSignal(0);
console.log(count()); // 0
setCount(5);
console.log(count()); // 5

// Effect (runs when dependencies change)
useCreateEffect(() => {
  console.log("Count changed:", count());
});

// Memo (derived value)
const doubled = useCreateMemo(() => count() * 2);

// Toggle
const [isOpen, toggleOpen] = useCreateToggle(false);
toggleOpen(); // isOpen() === true

// Storage-persisted signal
const [theme, setTheme] = useCreateStorageSignal("theme", "light");

// Debounced signal
const [search, setSearch] = useCreateDebouncedSignal("", 300);
```

---

## Formatter — `FormatterService`

```ts
import {
  useFormatNumber, useFormatCurrency, useFormatDate,
  useCapitalize, useUpperCase, useLowerCase, useJsonStringify,
} from "katanakit-js";

useFormatNumber(1234567.89, "de-DE");     // "1.234.567,89"
useFormatCurrency(99.99, "USD", "en-US"); // "$99.99"
useFormatDate(new Date(), "en-US", { dateStyle: "full" });

useCapitalize("hello world");   // "Hello world"
useUpperCase("hello");          // "HELLO"
useLowerCase("HELLO");          // "hello"
useJsonStringify({ a: 1 }, 2);  // pretty-printed JSON
```

---

## Converter — `ConverterService`

Decorates `FormatterService` with unit conversions.

```ts
import {
  useToCelsius, useToFahrenheit, useToMiles, useToKilos,
  useToRem, useToPx, useToCm, useToInches,
} from "katanakit-js";

useToCelsius(212);       // 100
useToFahrenheit(100);    // 212
useToMiles(10);           // 6.21371
useToKilos(6.21);         // 9.99402
useToRem(16);             // 1
useToPx(1.5);             // 24
useToCm(1);               // 0.3937
useToInches(2.54);        // 1
```

---

## ErrorFactory — `ErrorFactoryService`

```ts
import {
  useBadRequest, useUnauthorized, useForbidden,
  useNotFound, useInternal, useCustom,
  type AppError,
} from "katanakit-js";

const err: AppError = useNotFound("User not found");
// { status: 404, message: "User not found", ... }

useBadRequest("Invalid email");
useUnauthorized("Token expired");
useForbidden("Insufficient permissions");
useInternal("Database error");
useCustom(422, "Validation failed");
```

---

## Generator — `GeneratorService`

```ts
import { useUuid, useSlugify, useNumericId, useToken, useEncrypt } from "katanakit-js";

useUuid();               // "550e8400-e29b-41d4-a716-446655440000"
useSlugify("Hello World!"); // "hello-world"
useNumericId();           // 8392017465
useToken(32);             // "a3f8b2c1d4e5..." (random hex)
await useEncrypt("data"); // encrypted string
```

---

## Dates — `DatesService`

Uses the Temporal API via `@js-temporal/polyfill`.

```ts
import { useNow, useFormat, useAddDays, useIsBefore, useDiff, useLastDayOfMonth } from "katanakit-js";

const now = useNow();
useFormat(now, "yyyy-MM-dd");     // "2026-09-05"

const future = useAddDays(now, 30);
useIsBefore(now, future);          // true

const duration = useDiff(future, now);
console.log(duration.days);        // 30

useLastDayOfMonth(now);            // 30
```

---

## Geometry — `GeometryUtils`

```ts
import { GeometryUtils } from "katanakit-js";

const { useCircle, useSphere, useDistance, useIntersect } = GeometryUtils.getInstance();

const circle = useCircle(5);
console.log(circle.area);       // 78.54
console.log(circle.perimeter);  // 31.42

const sphere = useSphere(3);
console.log(sphere.volume);     // 113.10

useDistance({ x: 0, y: 0 }, { x: 3, y: 4 }); // 5
useIntersect(rectA, rectB);                     // true/false
```

---

## Timing — `TimingService`

```ts
import {
  useDelay, useSetTimeout, useInterval,
  useDebounce, useThrottle, useRepeat, useRace,
} from "katanakit-js";

// Promise-based delay
await useDelay(1000); // waits 1 second

// Timer with cancel
const cancel = useSetTimeout(() => console.log("done"), 5000);
cancel(); // cancel the timeout

// Interval with cancel
const stop = useInterval(() => console.log("tick"), 1000);
stop();

// Debounce a function
const debouncedSearch = useDebounce((query: string) => {
  fetch(`/api/search?q=${query}`);
}, 300);

// Throttle a function
const throttledScroll = useThrottle(() => {
  console.log("scroll position updated");
}, 100);

// Repeat N times
const stopRepeat = useRepeat(() => console.log("retry"), 1000, 3);

// Race multiple async operations
const fastest = await useRace([fetchA(), fetchB(), fetchC()]);
```

---

## Viewport — `ViewportService`

```ts
import { ViewportService } from "katanakit-js";

const vp = ViewportService.getInstance();

vp.useBreakpoint("md");              // true if viewport >= 768px
vp.useScrollTo("#section-2");        // smooth scroll
vp.useScrollToElement(element);      // scroll to DOM element
vp.usePrefersReducedMotion();        // true if user prefers reduced motion
```

---

## Observer — `ObserverService`

```ts
import { ObserverService } from "katanakit-js";

const observer = ObserverService.getInstance();

// Create an IntersectionObserver
const obs = observer.useCreate({ threshold: 0.5 });

// Observe a single element
const unobserve = observer.useObserve(element, (entry) => {
  if (entry.isIntersecting) {
    console.log("Element is visible!");
  }
});

// Observe all matching elements
const unobserveAll = observer.useObserveAll(".lazy-img", (entry) => {
  if (entry.isIntersecting) {
    (entry.target as HTMLImageElement).src = entry.target.dataset.src!;
  }
});

// Disconnect all
observer.useDisconnect();
```

---

## Worker — `WorkerService`

```ts
import { WorkerService } from "katanakit-js";

const worker = WorkerService.getInstance();

// One-shot worker
const result = await worker.useRun(`
  self.onmessage = (e) => {
    self.postMessage(e.data * 2);
  };
`, 21);
console.log(result); // 42

// Worker pool
const pool = worker.useCreatePool(4);
const poolResult = await worker.useRunPool(pool, heavyComputationScript, data);

// Cleanup
worker.useTerminate();
```

---

## Theme — `ThemeService`

```ts
import { ThemeService } from "katanakit-js";

const theme = ThemeService.getInstance();

theme.useInitTheme({ defaultMode: "dark" });
theme.useSetThemeMode("light");
theme.useToggleTheme();      // toggles between light/dark
theme.useResetTheme();        // resets to system preference
```

---

## Astro Adapter — `AstroService`

```ts
// src/pages/blog/[slug].astro
import { AstroService } from "katanakit-js";

export async function getStaticPaths() {
  const { useGetStaticPaths } = AstroService.getInstance();

  return useGetStaticPaths(getCollection, "blog", {
    param: "slug",
    valueFrom: (entry) => entry.slug ?? entry.id,
    propsFrom: (entry) => entry.data,
  });
}
```

Safe Result style — no error escapes the route module:

```ts
const result = await useGetStaticPaths(getCollection, "blog");
if (!result.ok) {
  console.error(result.error.message, result.error.collectionName);
}
```

---

## RSS — `RssService`

```ts
// src/pages/rss.xml.ts
import { RssService } from "katanakit-js";
import { getCollection } from "astro:content";

const { useCreateRssEndpoint } = RssService.getInstance();

export const GET = useCreateRssEndpoint({
  title: "My Blog",
  description: "Posts about TypeScript",
  site: "https://example.com",
  items: async () => {
    const posts = await getCollection("blog");
    return posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      description: post.data.description,
    }));
  },
});
```

---

## SEO — `useHeadTags`

```ts
import { type SiteConfig, useHeadTags, useGenerateMetaTags, useTitle } from "katanakit-js";

const siteConfig: SiteConfig = {
  site: "https://myblog.com",
  title: "My Blog",
  description: "A blog about TypeScript",
  lang: "en",
  author: "John Doe",
  ogImage: "/og-default.png",
  twitter: "johndoe",
  rss: { enabled: true, path: "/rss.xml", limit: 20 },
  seo: { noindex: false, canonical: true, openGraph: true, twitterCard: true, jsonLd: true },
};

// All <head> tags (title, meta, OG, Twitter Card, JSON-LD, RSS link)
const tags = useHeadTags(siteConfig, {
  title: "My Post",
  description: "A great post",
  url: "https://myblog.com/posts/my-post/",
  ogType: "article",
  publishedTime: "2026-01-15T00:00:00Z",
});
```

---

## Nuxt Adapter

```ts
import { useInit, useGet } from "katanakit-js";
import { useUnwrap, useSafeResponse, useEventResponse } from "katanakit-js/adapters/nuxt";

// server/plugins/api.ts
useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});

// server/api/pokemon/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const result = await useGet("pokeapi", "pokemonById", { params: { id } });
  return useUnwrap(result, `Pokemon ${id}`);
});
```

---

## Vue Adapter

```ts
import { useInit } from "katanakit-js";
import { useKatanaFetch } from "katanakit-js/adapters/vue";

useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});
```

```vue
<script setup lang="ts">
import { useKatanaFetch } from "katanakit-js/adapters/vue";

const { data, error, loading, refetch } = useKatanaFetch<{ name: string }>(
  "pokeapi", "pokemonById", { params: { id: 25 } }
);
</script>

<template>
  <div v-if="loading">Loading…</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else>
    <h1>{{ data?.name }}</h1>
    <button @click="refetch">Refresh</button>
  </div>
</template>
```

---

## Express Server

```ts
import { ServerExpress } from "katanakit-js/adapters/express";

ServerExpress.getInstance().useStart(); // http://localhost:3000
```

---

## Next steps

- [Architecture](/guides/architecture/) — understand the hexagonal layout
- [API Reference](/api/) — auto-generated from source
- [Changelog](/changelog/) — what changed in each version
- [Roadmap](/guides/roadmap/) — what's coming next
