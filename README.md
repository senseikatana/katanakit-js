# `katanakit-js`

A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.

KatanaKit is the plumbing every TypeScript project rewrites: a typed HTTP client
with Safe Results, Zod validation at the boundary, a TanStack-powered query
cache, filesystem and browser helpers, thin adapters for a dozen frameworks, and
a provider-agnostic AI assistant. Pure ESM, zero side effects on import,
SSR-safe.

**Documentation:** [Tutorial](https://docs.senseikatana.com/tutorials/first-api-client) ·
[Guides](https://docs.senseikatana.com/guides/getting-started) ·
[API Reference](https://docs.senseikatana.com/api/) ·
[Changelog](https://docs.senseikatana.com/changelog)

## Installation

```bash
npm install katanakit-js
# or
bun add katanakit-js
```

Requires Node.js >= 22.18 (or Bun >= 1.2). The only runtime dependency is
`@js-temporal/polyfill`; frameworks and integrations are optional peer
dependencies, installed only when used.

In the browser, use jsDelivr **`/+esm`** so named exports and dependencies
resolve:

```html
<script type="module">
	import { useLogger } from "https://cdn.jsdelivr.net/npm/katanakit-js/+esm";
	useLogger("ready");
</script>
```

Pin a version in production (e.g. `katanakit-js@6.8.5/+esm`). There is no
IIFE/UMD build — ESM only. [CDN options and the full entry-point map →](https://docs.senseikatana.com/guides/getting-started)

## Quick start

```ts
import { defineApiConfig, useGetApi, useLogger } from "katanakit-js";

useLogger("boot");

// Register your APIs once — returns the config, so you can also
// `export default defineApiConfig({ … })` from a config file.
defineApiConfig({
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

Step by step, with Zod validation and caching:
[Tutorial: Your First API Client](https://docs.senseikatana.com/tutorials/first-api-client).

## Features

- **Safe Results + helpers** — fallible operations return `{ data, error, ok }` instead of throwing; `useAttempt()`, `useTryJsonParse()` and `useErrorNormalize()` standardize boundaries ([Error Handling](https://docs.senseikatana.com/guides/errors))
- **Zod validation everywhere** — `types/` is inferred from Zod schemas via `z.infer`; every runtime schema is public under `katanakit-js/schemas`, `useValidate(schema, data)` turns any schema into a Safe Result, and API adapters validate every response at the boundary
- **Zero side effects** — importing any module is safe: no `fetch` calls, no `console.log`, no storage writes
- **Hexagonal architecture** — pure core, infrastructure adapters, framework adapters on subpaths ([Architecture](https://docs.senseikatana.com/guides/architecture))
- **Design patterns** — Singleton facades with `use*` wrappers, swappable Strategies (`AccessService`, `AgentService`), `QueryClientFactory` for per-request SSR clients, and composable Decorators (`RetryDecorator`, `CacheDecorator`, `LoggerDecorator`)
- **Tree-shakeable** — stable `use*` wrapper functions over the Singleton facades
- **SSR-safe** — all infrastructure adapters guard or fall back gracefully in server environments
- **Filesystem (Node/Bun)** — `useReadFile`, `useWriteJsonFile`, `useHashFile` and friends return Safe Results with native errno codes ([Filesystem](https://docs.senseikatana.com/guides/filesystem))
- **Fake data (optional)** — `useFakeEmail`, `useFakeList`, reproducible seeds via `useFakeSeed` ([Faker](https://docs.senseikatana.com/guides/faker))
- **Katana UI** — framework-agnostic component foundations in the private `@katanakit/ui` workspace, styled with the vendored SCSS framework ([UI Kit](https://docs.senseikatana.com/ui-kit/))

## Configuration files — `define*Config`

Every service that takes config exposes a **`define*Config`** entry point. One
call registers it and hands it back, so a whole file can be just this:

```ts
// katanakit.config.ts
export default defineApiConfig({
	pokeapi: { baseUri: "https://pokeapi.co/api/v2", endpoints: { byId: "/pokemon/:id/" } },
	debug: true, // boolean flags stay off the registry, on `config`
	getPokemon: async function () {
		if (this.config.debug) console.log("fetching…");
		return useFetch("pokeapi", "byId", { params: { id: 25 } });
	},
});
```

**Declare methods with `function`** — arrows have no `this`, so `this.config`
inside one is `undefined` and TypeScript reports it. The old `useInit*` calls
still work and map one-for-one onto `define*Config`.
[All entry points and migration →](https://docs.senseikatana.com/guides/getting-started)

## What's inside

### Core services

HTTP client · Query Client (TanStack) · Logger · Storage · DOM · Reactive
signals · Formatter / Converter · Dates (Temporal) · Generator · Timing ·
Viewport · Observer · Worker · Geometry · Error helpers · SEO · RSS · Theme —
[one page per service](https://docs.senseikatana.com/guides/services/).

### Framework adapters

Each subpath is a complete entry point. UI adapters re-export the query client
helpers and add the framework's native reactivity over TanStack Query Core.

| Adapter | Import | Guide |
| --- | --- | --- |
| **Express** | `katanakit-js/adapters/express` | [Express Server](https://docs.senseikatana.com/guides/services/express-server) |
| **Bun** | `katanakit-js/adapters/bun` | [Bun Adapter](https://docs.senseikatana.com/guides/bun-adapter) |
| **NestJS** | `katanakit-js/adapters/nestjs` | [NestJS](https://docs.senseikatana.com/guides/nestjs) |
| **Hono** | `katanakit-js/adapters/hono` | [Hono](https://docs.senseikatana.com/guides/hono) |
| **Nuxt** | `katanakit-js/adapters/nuxt` | [Nuxt Adapter](https://docs.senseikatana.com/guides/services/nuxt-adapter) |
| **Astro** | `katanakit-js/adapters/astro` | [Astro Adapter](https://docs.senseikatana.com/guides/services/astro-adapter) |
| **React / Vue / Solid / Svelte / Angular** | `katanakit-js/adapters/<framework>` | [Framework Adapters](https://docs.senseikatana.com/guides/framework-adapters) |
| **Vanilla** | `katanakit-js/adapters/vanilla` | [Query Client](https://docs.senseikatana.com/guides/query-client) |

### Integration adapters

| Adapter | Import | Guide |
| --- | --- | --- |
| **Notion** | `katanakit-js/adapters/notion` | [Notion](https://docs.senseikatana.com/guides/notion) |
| **WordPress** | `katanakit-js/adapters/wordpress` | [WordPress](https://docs.senseikatana.com/guides/wordpress) |
| **InsForge** | `katanakit-js/adapters/insforge` | [InsForge](https://docs.senseikatana.com/guides/insforge) |
| **Better Auth** | `katanakit-js/adapters/better-auth` | [Better Auth](https://docs.senseikatana.com/guides/better-auth) |
| **PhotoSwipe** | `katanakit-js/adapters/photoswipe` | [PhotoSwipe](https://docs.senseikatana.com/guides/photoswipe) |
| **Assistant (Kitt)** | `katanakit-js/adapters/assistant` | [Assistant](https://docs.senseikatana.com/guides/assistant) |
| **Telegram** | `katanakit-js/adapters/telegram` | [Telegram](https://docs.senseikatana.com/guides/telegram) |
| **WhatsApp** | `katanakit-js/adapters/whatsapp` | [WhatsApp](https://docs.senseikatana.com/guides/whatsapp) |

Runnable demos for every adapter live in
[`examples/`](https://github.com/senseikatana/katanakit-js/tree/main/examples).

## Documentation

The site has four kinds of pages, one per reader need:

| If you want to… | Read |
| --- | --- |
| **Learn by building**, step by step | [Tutorial: Your First API Client](https://docs.senseikatana.com/tutorials/first-api-client) |
| **Do a specific task** — HTTP, frameworks, files, bots | [Guides](https://docs.senseikatana.com/guides/getting-started) |
| **Look up an exact fact** — signature, option, error code | [API Reference](https://docs.senseikatana.com/api/) (generated from source) |
| **Understand why** it is built this way | [Why KatanaKit](https://docs.senseikatana.com/explanation/why-katanakit) · [Architecture](https://docs.senseikatana.com/guides/architecture) · [Decision records](https://docs.senseikatana.com/explanation/decisions/) |

## Development

```bash
git clone https://github.com/senseikatana/katanakit-js.git
cd katanakit-js
git checkout dev
bun install
bun run check   # ESLint + typechecks + Vitest — the gate before any build
```

- Branch from `dev`, follow the `use*` convention, and run `bun run check`
  before opening a PR.
- Docs live in `docs/` and change in the same pull request as the code:
  `bun run dev` serves the site locally.
- Releases are cut locally (`bun run release`) — there is no CI pipeline.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full development contract and
[SECURITY.md](./SECURITY.md) to report a vulnerability.

## License

MIT
