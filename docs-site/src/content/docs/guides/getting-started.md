---
title: Getting Started
description: Install and configure KatanaKit, then use its core services.
sidebar:
  order: 1
---

This guide walks you through installing `katanakit-js` and using its core
services. It assumes you are comfortable with TypeScript and modern ESM
(`import`/`export`).

## Prerequisites

- Node.js >= 22.18.0 (pure ESM package) or Bun >= 1.0.
- TypeScript projects should resolve the package with `moduleResolution:
  "nodenext"` (or `"bundler"`).

## Installation

```bash
npm install katanakit-js
# or
bun add katanakit-js
```

Only `@js-temporal/polyfill` is installed automatically. `express`, `cors`,
`dotenv` and `@prisma/orm-postgres` are optional peer dependencies: install them
only if you use the Express adapter or the Prisma layer.

## The two import entry points

- Main barrel: `import { useGet, useLog, ... } from "katanakit-js"` — everything
  except the Nuxt, Vue and Express adapters.
- Subpaths: `import ... from "katanakit-js/adapters/nuxt"`,
  `import ... from "katanakit-js/adapters/vue"` and
  `import ... from "katanakit-js/adapters/express"`.

## Registering APIs and fetching data

The heart of the library is the HTTP client. You register your APIs once, then
build safe URLs and fetch data with a Safe Result.

```ts
import { useInit, useGet, usePost, useBuildUrl } from "katanakit-js";

useInit({
  dummyjson: {
    baseUri: "https://dummyjson.com",
    endpoints: {
      userById: "/users/:id",
      users: "/users",
    },
    defaultQueryParams: { users: { limit: 10 } },
  },
});

// Build a URL with encoded path params and merged query params.
const url = useBuildUrl("dummyjson", "userById", {
  params: { id: 42 },
  query: { select: "firstName,lastName" },
});

// GET with a Safe Result — never throws on HTTP errors.
const result = await useGet<{ firstName: string }>("dummyjson", "userById", {
  params: { id: 1 },
});

if (result.ok) {
  console.log(result.data.firstName);
} else {
  console.error(result.error.message, result.error.status);
}

// POST JSON (body is serialized for you).
await usePost("dummyjson", "users", { firstName: "Ada", lastName: "Lovelace" });
```

Every request resolves to the same discriminated union:

```ts
type FetchResult<T> =
  | { data: T; error: null; url: string; status: number; ok: true }
  | { data: null; error: ApiError; url: string; status: number; ok: false };
```

## Logging

```ts
import { useLog, useError, LoggerService, type LogStrategy } from "katanakit-js";

useLog("Application started");                            // info level
useLog("error", "Failed to load", { code: 500 });         // error level
useError("Something went wrong");                         // error level

// Swap the output strategy at runtime (Strategy pattern).
const custom: LogStrategy = {
  useOutput: (level, message, data) => {
    /* send to your telemetry */
  },
};
LoggerService.getInstance().useSetStrategy(custom);
```

## Storage

```ts
import { useSetStorage, useGetStorage, useRemoveStorage } from "katanakit-js";

useSetStorage("theme", "dark");
const theme = useGetStorage<string>("theme"); // "dark"
useRemoveStorage("theme");
```

Values are JSON-serialized on write. Storage is SSR-safe: when `window` is
unavailable, an in-memory fallback (`MemoryStorageStrategy`) is used
automatically, so imports never crash in Node/Bun.

## DOM

```ts
import { useGetRoot, useAddClass, useOn, useQuerySelector } from "katanakit-js";

const root = useGetRoot();
useAddClass(root!, "dark-mode");

const button = useQuerySelector<HTMLButtonElement>("button.submit");
const unsubscribe = useOn(button!, "click", () => console.log("clicked"));
// later...
unsubscribe?.();
```

All DOM methods are SSR-safe: they return `null`, `[]` or `false` when
`document` is unavailable instead of throwing.

## Astro `getStaticPaths`

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

`useGetStaticPaths` returns a Safe Result, so no error escapes the route module:

```ts
const result = await useGetStaticPaths(getCollection, "blog");
if (!result.ok) {
  // result.error.message / result.error.collectionName / result.error.details
}
```

## RSS for Astro

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

`useCreateRssEndpoint` returns an Astro-compatible `GET` handler. Lighter setups
can call `useGenerateRss(config)` to get the raw XML string (Safe Result) and
`useRssLinkTag({ title })` to generate the `<head>` link tag.

## Site config and SEO

Define a typed `SiteConfig`, then derive all `<head>` tags from it:

```ts
// src/config/site.config.ts
import { type SiteConfig } from "katanakit-js";

export const siteConfig: SiteConfig = {
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
```

```ts
// Any page/layout that needs <head> tags
import { siteConfig } from "@/config/site.config";
import { useHeadTags, useTitle } from "katanakit-js";

const headTags = useHeadTags(siteConfig, {
  title: "My Blog Post",
  description: "A great post",
  url: "https://myblog.com/blog/my-post/",
  ogType: "article",
  publishedTime: "2024-01-15T00:00:00Z",
});
// title, description, canonical, OG, Twitter Card, JSON-LD + RSS <link> tag
```

`useGenerateMetaTags` returns just the meta tags; `useHeadTags` appends the RSS
`<link>`; `useTitle` and `useRssHeadLink` are small single-purpose helpers.

## Nuxt / Nitro server routes

The Nuxt adapter ships as a subpath and requires no extra dependency (its
helpers never import `h3`; the error/status shape is compatible with Nitro).

```ts
import { useInit, useGet } from "katanakit-js";
import { useUnwrap } from "katanakit-js/adapters/nuxt";

// server/plugins/api.ts
useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});
```

```ts
// server/api/pokemon/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const result = await useGet("pokeapi", "pokemonById", { params: { id } });
  return useUnwrap(result, `Pokemon ${id}`);
});
```

`useSafeResponse(result)` returns a clean serializable object
(`{ data, error, ok }`) and `useEventResponse(event, result)` sets the response
status code on the H3 event and returns the payload.

## Vue 3 composable

The Vue adapter ships as a subpath and requires the `vue` optional peer
dependency. `useKatanaFetch` wraps `useGet` with Vue's reactivity system.

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

const { data: pokemon, error, loading } = useKatanaFetch<{ name: string }>(
  "pokeapi",
  "pokemonById",
  { params: { id: 25 } },
);
</script>

<template>
  <p v-if="loading">Loading…</p>
  <p v-else-if="error">{{ error.message }}</p>
  <p v-else>{{ pokemon?.name }}</p>
</template>
```

Pass a `Ref`/`computed` as the options argument to refetch automatically when it
changes. No `try/catch` is needed — HTTP errors are captured in `error` instead
of thrown.

## Express server (optional)

The Express reference adapter is exposed through its subpath so it does not
bloat library consumers. It requires `express` (and optionally `cors`/`dotenv`)
to be installed in your project.

```ts
import { ServerExpress } from "katanakit-js/adapters/express";

ServerExpress.getInstance().useStart(); // http://localhost:3000
```

Inside this repository you can run the bundled example server with:

```bash
bun run dev
```

## Running the examples

The repository ships runnable demos under `examples/`:

```bash
bun run examples/astro/demo.ts
bun run examples/geometry/demo.ts
bun run examples/observer/demo.ts
```

## Next steps

- Browse the full [API Reference](/katanakit-js/api/) for exact signatures.
- Read [Architecture](/katanakit-js/guides/architecture/) to understand the hexagonal layout.
- See [CONTRIBUTING.md](https://github.com/senseikatana/katanakit-js/blob/dev/CONTRIBUTING.md) if you want to contribute.
