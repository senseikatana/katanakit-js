---
title: Getting Started
description: Install KatanaKit and learn every service with real code examples.
---

This guide covers installation, entry points and configuration files. Every service has its own page in the [Services](/guides/services/) section.


## Installation

```bash
npm install katanakit-js
# or
bun add katanakit-js
```

Only `@js-temporal/polyfill` is a runtime dependency. `express`, `cors`,
`dotenv` and `vue` are optional peer dependencies.

### CDN (ESM in the browser)

Prefer the **jsDelivr `/+esm`** build in the browser. It rewrites bare
dependencies (e.g. `@js-temporal/polyfill`) so named imports work without a
bundler or import map:

```html
<script type="module">
  import {
    useLogger,
    defineApiConfig,
    useGetApi,
  } from "https://cdn.jsdelivr.net/npm/katanakit-js/+esm";

  useLogger("KatanaKit loaded from CDN");
  defineApiConfig({
    pokeapi: {
      baseUri: "https://pokeapi.co/api/v2",
      endpoints: { pokemonById: "/pokemon/:id/" },
    },
  });
</script>
```

| CDN | URL (browser) | Notes |
|-----|---------------|--------|
| **jsDelivr `/+esm`** | `https://cdn.jsdelivr.net/npm/katanakit-js/+esm` | Recommended for `<script type="module">` |
| **esm.sh** | `https://esm.sh/katanakit-js` | Alternative ESM CDN |
| **Raw package file** | `https://cdn.jsdelivr.net/npm/katanakit-js/dist/index.js` | Needs a bundler or an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) for `@js-temporal/polyfill` |
| **unpkg** | `https://unpkg.com/katanakit-js/dist/index.js` | Same caveat as the raw file |

Pin a version in production (e.g. `katanakit-js@6.8.4/+esm`) instead of
floating `@latest`.

There is **no IIFE/UMD** build — only ESM (`"type": "module"`).

## Import entry points

```ts
// Main barrel — core helpers + Astro/RSS + SEO (tree-shakeable named exports)
import {
  useLogger,
  defineApiConfig,
  useGetApi,
  useFormatCurrency,
  useNow,
  useChunk,
  ThemeService,
  AstroService,
  RssService,
} from "katanakit-js";

// Optional narrower / framework-only subpaths
import { AstroService, RssService } from "katanakit-js/adapters/astro";
import { useUnwrap } from "katanakit-js/adapters/nuxt";
import { useRequest } from "katanakit-js/adapters/vue";
import { ServerExpress } from "katanakit-js/adapters/express";
```

Every public `use*` helper lives on the main barrel (`katanakit-js`). Express,
Nuxt, and Vue adapters stay on their subpaths because they pull optional peers.

## Use in any framework (especially Astro)

### Astro — frontmatter (server / SSG)

```astro
---
// src/pages/index.astro
import { useLogger, defineApiConfig, useGetApi, AstroService } from "katanakit-js";

useLogger("Building index page");

defineApiConfig({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});

const result = await useGetApi<{ name: string }>("pokeapi", "pokemonById", {
  params: { id: 25 },
});
---

{result.ok ? <h1>{result.data.name}</h1> : <p>Failed to load</p>}
```

### Astro — client script with npm (Vite bundles it)

```astro
---
// no server imports required for this island
---
<button id="log-btn">Log</button>

<script>
  import { useLogger } from "katanakit-js";

  document.getElementById("log-btn")?.addEventListener("click", () => {
    useLogger("Clicked from Astro client script");
  });
</script>
```

### Astro — client script with jsDelivr CDN

Astro processes local `<script>` tags. For a **pure CDN** import, mark the
script as external so Astro does not rewrite it:

```astro
<button id="cdn-btn">Log via CDN</button>

<script is:inline type="module">
  import { useLogger, defineApiConfig, useGetApi } from "https://cdn.jsdelivr.net/npm/katanakit-js/+esm";

  defineApiConfig({
    pokeapi: {
      baseUri: "https://pokeapi.co/api/v2",
      endpoints: { pokemonById: "/pokemon/:id/" },
    },
  });

  document.getElementById("cdn-btn")?.addEventListener("click", async () => {
    useLogger("CDN click");
    const result = await useGetApi("pokeapi", "pokemonById", { params: { id: 25 } });
    useLogger(result.ok ? result.data : result.error);
  });
</script>
```

### Astro — islands (`client:*`)

In a Vue/React/Svelte island, import from npm like any other dependency:

```ts
// src/components/Pokemon.vue (used as <Pokemon client:load />)
import { defineApiConfig, useGetApi, useLogger } from "katanakit-js";
```

### Vue / Nuxt (brief)

```ts
// Vue SFC or Nuxt plugin / server route — main barrel
import { useLogger, defineApiConfig, useGetApi } from "katanakit-js";

// Nuxt-only helpers
import { useUnwrap } from "katanakit-js/adapters/nuxt";

// Vue reactivity wrapper around useGetApi
import { useRequest } from "katanakit-js/adapters/vue";
```

### Vanilla HTML

```html
<script type="module">
  import { useLogger, useFormatCurrency } from "https://cdn.jsdelivr.net/npm/katanakit-js/+esm";
  useLogger(useFormatCurrency({ amount: 9.99, currency: "EUR", locale: "es-ES" }));
</script>
```

---

## Configuration files — `define*Config`

Every service that takes configuration exposes a **`define*Config`** entry point.
One call registers the config and hands it back — there is no second
`useInit*` step, so a whole file can be nothing but:

```ts
// katanakit.config.ts
import { defineApiConfig } from "katanakit-js";

export default defineApiConfig({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
  debug: true, // boolean flag
  getPokemon: async function () {
    //            ^^^^^^^^ `function`, never an arrow
    return useFetch("pokeapi", "pokemonById", { params: { id: 25 } });
  },
});
```

Importing that file registers the config, and the default export is a facade
carrying both halves:

```ts
import api from "./katanakit.config.js";

api.config.pokeapi.baseUri; // the config you declared
api.config.debug; // your flags
await api.getPokemon(); // your methods
```

Inside a method, `this.config` is the same object:

```ts
getPokemon: async function () {
  if (this.config.debug) console.log("fetching…");
  return useFetch("pokeapi", "pokemonById", { params: { id: 25 } });
},
```

:::caution[Use `function`, not an arrow]
Arrow functions have no `this` of their own, so `this.config` inside an arrow
is `undefined`. The compiler catches it — write `async function () { … }`.
:::

Only object entries shaped like `{ baseUri, endpoints }` reach the API registry;
boolean flags stay on `config` for your methods to read.

### Which services

| Service | Import | Methods on the facade |
|---------|--------|----------------------|
| API registry | `defineApiConfig` | yes |
| Notion | `defineNotionConfig` | yes |
| WordPress | `defineWordPressConfig` | yes |
| InsForge | `defineInsforgeConfig` | yes |
| Telegram | `defineTelegramConfig` | no (config only) |
| WhatsApp | `defineWhatsAppConfig` | no (config only) |

The config-only services accept their config type and nothing else, so declaring
a method there is a compile error.

### Migration

The old `useInit*` functions still work and are marked `@deprecated` — nothing
breaks. They are a one-for-one rename of the config half:

```ts
useInitApis({ pokeapi: { … } }); // deprecated
defineApiConfig({ pokeapi: { … } }); // same call, plus methods and `config`
```

---

## Service reference

Every service has its own page — the [Services overview](/guides/services/) explains the singleton-facade contract shared by all of them.

| Group            | Services                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core**         | [HTTP Client](/guides/services/http-client/) · [Logger](/guides/services/logger/) · [Storage](/guides/services/storage/) · [DOM](/guides/services/dom/) · [Reactive](/guides/services/reactive/) · [Formatter](/guides/services/formatter/) · [Converter](/guides/services/converter/) · [Error Helpers](/guides/services/error-helpers/) · [Generator](/guides/services/generator/) · [Dates](/guides/services/dates/) · [Geometry](/guides/services/geometry/) · [Timing](/guides/services/timing/) · [Viewport](/guides/services/viewport/) · [Observer](/guides/services/observer/) · [Worker](/guides/services/worker/) |
| **Platform**     | [Theme](/guides/services/theme/) · [Astro Adapter](/guides/services/astro-adapter/) · [RSS](/guides/services/rss/) · [SEO](/guides/services/seo/)                                                                                                                                                                                                                                                        |
| **Integrations** | [Nuxt Adapter](/guides/services/nuxt-adapter/) · [Vue Adapter](/guides/services/vue-adapter/) · [Express Server](/guides/services/express-server/)                                                                                                                                                                                                                                                 |

## Next steps

- [Architecture](/guides/architecture/) — understand the hexagonal layout
- [API Reference](/api/) — auto-generated from source
- [Releases](/changelog/) — what changed in each version
- [Roadmap](/guides/roadmap/) — what's coming next
