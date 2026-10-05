---
title: Nuxt Adapter
description: "Nuxt composables and server-plugin helpers for the HTTP client."
---

# Nuxt Adapter

```ts
import { defineApiConfig, useGetApi } from "katanakit-js";
import { useUnwrap, useSafeResponse, useEventResponse } from "katanakit-js/adapters/nuxt";

// server/plugins/api.ts
defineApiConfig({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});

// server/api/pokemon/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const result = await useGetApi("pokeapi", "pokemonById", { params: { id } });
  return useUnwrap(result, `Pokemon ${id}`);
});
```

---
