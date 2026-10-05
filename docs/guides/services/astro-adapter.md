---
title: Astro Adapter
description: "Astro helpers: typed static paths and service access from pages and endpoints."
---

# Astro Adapter

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
