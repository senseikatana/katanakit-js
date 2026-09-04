# KatanaKit

A sharp, framework-agnostic **TypeScript service toolkit**,
organized with hexagonal architecture and built on proven design patterns
(Singleton, Observer, Factory, Decorator and Strategy).

It works in the browser, in Node.js and in Bun, ships with an Astro
`getStaticPaths` adapter and an optional Express server, and never triggers side
effects on import.

## Why

Modern frontend and full-stack apps keep reimplementing the same plumbing:
fetching an API safely, logging, persisting to storage, querying the DOM,
reacting to state changes, generating slugs, formatting dates and money. This
library gives you all of that as a single, tree-shakeable set of `use*` services
with a consistent API — one `useInit` for your APIs, one `useFetch` that returns a
Safe Result, one way to do logging, storage and DOM across every framework.

## ✨ Features

- **Safe URL construction** — build URLs from a JSON-defined API registry using the
  native `URL` API and `encodeURIComponent`; non-http(s) schemes are rejected to
  prevent `javascript:` URLs and SSRF.
- **Safe Result** — every `useFetch` returns a discriminated union
  `{ data, error, ok }` (Astro Actions style) instead of throwing on HTTP errors.
- **Hexagonal architecture** — a pure `core` layer (services), an
  `infrastructure` layer (browser/runtime adapters) and an `adapters` layer
  (Astro + Express), with a single `@/` path alias, barrel exports and a single
  source of truth for types in `src/types/`.
- **Design patterns** — Singleton facades, Strategy (logger, storage, generator),
  Factory (errors), Observer (signals, IntersectionObserver) and more, exposed
  as `use*` methods (like React hooks) with safe destructured exports.
- **Zero side effects on import** — importing a module never triggers network
  calls, timers or storage writes.
- **SSR-safe** — browser-only adapters fall back gracefully (in-memory storage,
  main-thread worker execution) when `window` is unavailable.
- **Fully typed** — strict TypeScript with generated declarations.

## 📦 Installation

```bash
npm install katanakit-js-dev
# or
bun add katanakit-js-dev
```

### Building from source

```bash
git clone https://github.com/senseikatana/katanakit.git
cd katanakit
bun install
bun run build
```

## 🚀 Quick Start

```ts
import {
  useInit,
  useGet,
  useBuildUrl,
  useLog,
  useSetStorage,
  useGetStorage,
  useAddClass,
  useGetRoot,
} from "katanakit-js";
```

### HTTP client (the core)

```ts
import { useInit, useGet, usePost, useBuildUrl } from "katanakit-js";

// 1. Register your APIs once.
useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: {
      pokemonById: "/pokemon/:id/",
      pokemons: "/pokemons/",
    },
  },
});

// 2. Build a safe URL.
const url = useBuildUrl("pokeapi", "pokemonById", { params: { id: "pikachu" } });
// => "https://pokeapi.co/api/v2/pokemon/pikachu/"

// 3. Fetch with a Safe Result (no throwing on HTTP errors).
const result = await useGet<{ name: string }>("pokeapi", "pokemonById", {
  params: { id: 1 },
});

if (result.ok) {
  console.log(result.data.name);
} else {
  console.error(result.error.message, result.error.status);
}
```

### Astro adapter

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

### RSS feeds for Astro

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

Then add the RSS link tag to your layout's `<head>`:

```astro
---
import { RssService } from "katanakit-js";
const { useRssLinkTag } = RssService.getInstance();
---
<head>
  <Fragment set:html={useRssLinkTag({ title: "My Blog" })} />
</head>
```

### Site config & SEO

Centralize your site metadata in `src/config/site.config.ts`:

```ts
// src/config/site.config.ts
import { type SiteConfig } from "katanakit-js";

export const siteConfig: SiteConfig = {
  site: "https://myblog.com",
  title: "My Blog",
  description: "A blog about TypeScript and Astro",
  lang: "en",
  author: "John Doe",
  ogImage: "/og-default.png",
  twitter: "johndoe",
  rss: { enabled: true, path: "/rss.xml", limit: 20 },
  seo: { noindex: false, canonical: true, openGraph: true, twitterCard: true, jsonLd: true },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "GitHub", href: "https://github.com/...", external: true },
  ],
};
```

Then use it in your Astro layouts for full SEO:

```astro
---
// src/layouts/BaseLayout.astro
import { siteConfig } from "@/config/site.config";
import { useHeadTags } from "katanakit-js";

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
}

const { title, description, ogImage, ogType, publishedTime } = Astro.props;
const canonical = new URL(Astro.url.pathname, siteConfig.site).href;

const headTags = useHeadTags(siteConfig, {
  title,
  description,
  url: canonical,
  ogImage,
  ogType,
  publishedTime,
});
---
<html lang={siteConfig.lang}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <Fragment set:html={headTags} />
</head>
<body>
  <slot />
</body>
</html>
```

And the RSS endpoint uses the same config:

```ts
// src/pages/rss.xml.ts
import { RssService } from "katanakit-js";
import { siteConfig } from "@/config/site.config";
import { getCollection } from "astro:content";

const { useCreateRssEndpointFromConfig } = RssService.getInstance();

export const GET = useCreateRssEndpointFromConfig(siteConfig, async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    link: `/blog/${post.slug}/`,
    description: post.data.description,
  }));
});
```

### Logger, storage and DOM

```ts
import { useLog, useSetStorage, useGetStorage, useAddClass, useGetRoot } from "katanakit-js";

useLog("Hello", { user: "John" });                 // info level
useLog("error", "Something failed", { code: 500 }); // error level

useSetStorage("theme", "dark");
const theme = useGetStorage<string>("theme");

useAddClass(useGetRoot()!, "dark-mode");
```

## 🧰 Services at a glance

| Area      | Service              | Highlights                                            |
| --------- | -------------------- | ----------------------------------------------------- |
| HTTP      | `FetchApiManager`    | `useInit`, `useBuildUrl`, `useFetch`, `useGet`...     |
| Logging   | `LoggerService`      | `useLog`, `useError`, `LogStrategy`                   |
| Storage   | `StorageService`     | `useGetStorage`, `useSetStorage`, `StorageStrategy`   |
| DOM       | `DomService`         | `useQuerySelector`, `useAddClass`, `useOn`...         |
| Reactive  | `ReactiveService`    | `useCreateSignal`, `useCreateEffect`, `useCreateMemo` |
| Format    | `FormatterService`   | `useFormatNumber`, `useFormatCurrency`, `useUpperCase` |
| Convert   | `ConverterService`   | `useToCelsius`, `useToMiles`, `useToKilos`...         |
| Errors    | `ErrorFactoryService`| `useBadRequest`, `useNotFound`, `useInternal`...      |
| Generate  | `GeneratorService`   | `useUuid`, `useSlugify`, `useToken`, `useEncrypt`     |
| Dates     | `DatesService`       | `useFormat`, `useNow`, `useAddDays`, `useIsBefore`... |
| Geometry  | `GeometryUtils`      | `useRectangle`, `useCircle`, `useSphere`...           |
| Timing    | `TimingService`      | `useDebounce`, `useThrottle`, `useSetTimeout`, `useRace` |
| Utils     | `DataUtils`/`SystemUtils` | `useUnique`, `useGroupBy`, `useRetry`, `useDeepClone`... |
| Viewport  | `ViewportService`    | scroll, fullscreen, visibility, `usePrefersReducedMotion` |
| Sensors   | `SensorsUtils`       | geolocation, camera, vibration, battery               |
| Observer  | `ObserverService`    | `useCreate`, `useObserve`, `useObserveAll`            |
| Worker    | `WorkerService`      | `useRun`, `useCreatePool`, `useRunPool`               |
| Theme     | `ThemeService`       | `useInitTheme`, `useToggleTheme`, `useSetThemeMode`   |
| Astro     | `AstroService`       | `usePathsFrom`, `useGetStaticPaths`, pagination       |
| RSS       | `RssService`         | `useGenerateRss`, `useRssLinkTag`, `useCreateRssEndpoint` |
| Config    | `siteConfig`         | `useHeadTags`, `useGenerateMetaTags`, `useTitle`, `useRssHeadLink` |
| Server    | `ServerExpress`      | optional Express adapter (via subpath)                |

## 🧱 Project structure (hexagonal)

```
src/
├── index.ts                # main barrel (public API)
├── types/                  # single source of truth for all types & contracts
├── core/
│   └── services/           # logger, http, formatter, error, generator, ...
├── infrastructure/         # adapters (browser/runtime I/O)
│   ├── dom/  storage/  viewport/  sensors/  observer/  worker/  theme/
└── adapters/               # framework adapters
    ├── astro/              #   AstroService
    └── express/            #   ServerExpress (optional, via subpath)
```

The Express server is **not** part of the main barrel to avoid forcing Express on
library consumers. Import it explicitly:

```ts
import { ServerExpress } from "katanakit-js/adapters/express";

ServerExpress.getInstance().useStart(); // http://localhost:3000
```

## 📚 Documentation

- [Getting Started](docs/Getting-Started.md)
- [Architecture](docs/Architecture.md)
- [API Reference](docs/API-Reference.md)
- [Security](SECURITY.md)
- [Roadmap](docs/Roadmap.md)

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the
development contract, conventions and how to get started.

## 📄 License

[MIT](LICENSE)
