# Getting Started

This guide walks you through installing KatanaKit and using its core
services.

## Prerequisites

- Node.js >= 20, or Bun >= 1.0.

## Installation

```bash
npm install katanakit
# or
bun add katanakit
```

## Registering APIs and fetching data

The heart of the library is the HTTP client. You register your APIs once, then
build safe URLs and fetch data with a Safe Result.

```ts
import { INIT, GET, POST, BUILD_URL } from "katanakit";

INIT({
  dummyjson: {
    baseUri: "https://dummyjson.com",
    endpoints: {
      userById: "/users/:id",
      users: "/users",
    },
  },
});

// Build a URL with encoded path params and merged query params.
const url = BUILD_URL("dummyjson", "userById", {
  params: { id: 42 },
  query: { select: "firstName,lastName" },
});

// GET with a Safe Result.
const result = await GET<{ firstName: string }>("dummyjson", "userById", {
  params: { id: 1 },
});

if (result.ok) {
  console.log(result.data.firstName);
} else {
  console.error(result.error.message, result.error.status);
}

// POST JSON.
await POST("dummyjson", "users", { firstName: "Ada", lastName: "Lovelace" });
```

## Logging

```ts
import { LOGGER, LoggerService, type LogStrategy } from "katanakit";

LOGGER("Application started");
LOGGER("error", "Failed to load", { code: 500 });

// Swap the strategy at runtime (Strategy pattern).
const custom: LogStrategy = {
  output: (level, message, data) => {
    /* send to your telemetry */
  },
};
LoggerService.getInstance().setStrategy(custom);
```

## Storage

```ts
import { SET_STORAGE, GET_STORAGE, REMOVE_STORAGE } from "katanakit";

SET_STORAGE("theme", "dark");
const theme = GET_STORAGE<string>("theme"); // "dark"
REMOVE_STORAGE("theme");
```

> Storage is SSR-safe: when `window` is unavailable, an in-memory fallback is
> used automatically.

## DOM

```ts
import { GET_ROOT, ADD_CLASS, ON, QUERY_SELECTOR } from "katanakit";

const root = GET_ROOT();
ADD_CLASS(root!, "dark-mode");

const button = QUERY_SELECTOR<HTMLButtonElement>("button.submit");
const unsubscribe = ON(button!, "click", () => console.log("clicked"));
// later...
unsubscribe?.();
```

## Astro `getStaticPaths`

```ts
// src/pages/blog/[slug].astro
import { AstroService } from "katanakit";

export async function getStaticPaths() {
  const { GET_STATIC_PATHS } = AstroService.getInstance();

  return GET_STATIC_PATHS(getCollection, "blog", {
    param: "slug",
    valueFrom: (entry) => entry.slug ?? entry.id,
    propsFrom: (entry) => entry.data,
  });
}
```

## Express server (optional)

The Express server is exposed through a subpath so it does not bloat library
consumers:

```ts
import { ServerExpress } from "katanakit/adapters/express";

ServerExpress.getInstance().start(); // http://localhost:3000
```

Run the bundled example server with `bun run dev`.

## Running the examples

```bash
bun run examples/astro/demo.ts
bun run examples/geometry/demo.ts
```
