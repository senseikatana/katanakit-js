---
title: Vue Adapter
description: "Vue reactivity wrappers around the HTTP client and the query cache."
---

# Vue Adapter

```ts
import { defineApiConfig } from "katanakit-js";
import { useRequest } from "katanakit-js/adapters/vue";

defineApiConfig({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});
```

```vue
<script setup lang="ts">
import { useRequest } from "katanakit-js/adapters/vue";

const { data, error, loading, refetch } = useRequest<{ name: string }>(
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
