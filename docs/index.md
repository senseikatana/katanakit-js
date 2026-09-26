---
layout: home
title: KatanaKit
description: A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.

hero:
  name: KatanaKit
  text: A sharp TypeScript service toolkit
  tagline: Framework-agnostic, hexagonal and SSR-safe. HTTP with Safe Results, Zod validation, query cache, filesystem helpers, fake data and an OpenAI-compatible assistant.
  actions:
    - theme: brand
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: API Reference
      link: /api/

features:
  - title: Safe Results
    details: Fallible async calls return `{ data, error, ok }` instead of throwing — HTTP, filesystem and every adapter share the same contract.
  - title: Zod everywhere
    details: "`src/types` is inferred from Zod schemas and API adapters validate every response at the boundary, so malformed payloads never leak."
  - title: Framework adapters
    details: React, Vue, Solid, Svelte, Angular and Nuxt bindings over the same TanStack Query Core engine bundled with the package.
  - title: Node/Bun toolkit
    details: Filesystem and path helpers with native errno codes, plus optional lazy faker for reproducible seed data and fixtures.
  - title: Zero side effects
    details: Importing any module is safe — no fetch calls, no console logs, no storage writes, no top-level Node built-ins.
  - title: SSR-safe
    details: Every infrastructure service guards or falls back gracefully outside the browser; Node-only APIs load through dynamic import.
---

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

| Area                                   | Start here                                |
| -------------------------------------- | ----------------------------------------- |
| HTTP client, Safe Results, Zod         | [Getting Started](/guides/getting-started) |
| Error handling (Safe Result + helpers) | [Error Handling](/guides/errors)           |
| Query cache (TanStack Query Core)      | [Query Client](/guides/query-client)       |
| React / Vue / Solid / Svelte / Angular | [Framework Adapters](/guides/framework-adapters) |
| Bun server adapter                     | [Bun Adapter](/guides/bun-adapter)         |
| Filesystem (Node/Bun)                  | [Filesystem](/guides/filesystem)           |
| Fake data and seed fixtures            | [Faker](/guides/faker)                     |
| Hexagonal architecture                 | [Architecture](/guides/architecture)       |
| UI kit foundations (Katana UI)          | [Katana UI](/ui-kit/)                      |
| Every release                          | [Releases](/changelog)                     |
| Every export, generated from source    | [API Reference](/api/)                     |
