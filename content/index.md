---
title: KatanaKit
description: A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.
hide:
  - navigation
  - toc
---

# KatanaKit

A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal
architecture: HTTP with Safe Results, Zod validation, a TanStack-based query
cache, browser infrastructure, Node/Bun filesystem helpers, optional fake data
and an OpenAI-compatible AI assistant.

[Get started](docs/guides/getting-started.md){ .md-button .md-button--primary }
[API Reference](docs/api/index.md){ .md-button }

## Install

```bash
npm install katanakit-js
# or
bun add katanakit-js
```

## Quick start

```ts
import { useInitApis, useGetApi, useLogger } from "katanakit-js";

useLogger("boot");

// Register your APIs once
useInitApis({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});

// Fetch with Safe Result — no try/catch needed for HTTP failures
const result = await useGetApi<{ name: string }>("pokeapi", "pokemonById", {
  params: { id: 25 },
});

if (result.ok) {
  console.log(result.data.name); // "pikachu"
} else {
  console.error(result.error.message);
}
```

## What's inside

| Area                                    | Start here                                              |
| --------------------------------------- | ------------------------------------------------------- |
| HTTP client, Safe Results, Zod          | [Getting Started](docs/guides/getting-started.md)       |
| Query cache (TanStack Query Core)       | [Query Client](docs/guides/query-client.md)             |
| React / Vue / Solid / Svelte / Angular  | [Framework Adapters](docs/guides/framework-adapters.md) |
| Bun server adapter                      | [Bun Adapter](docs/guides/bun-adapter.md)               |
| Filesystem (Node/Bun)                   | [Filesystem](docs/guides/filesystem.md)                 |
| Fake data and seed fixtures             | [Faker](docs/guides/faker.md)                           |
| Hexagonal architecture                  | [Architecture](docs/guides/architecture.md)             |
| Planned UI kit                          | [Katana UI](docs/ui-kit/index.md)                       |
| Every release                           | [Changelog](docs/changelog.md)                          |
| Every export, generated from source     | [API Reference](docs/api/index.md)                      |
