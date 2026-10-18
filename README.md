# KatanaKit JS:

A framework-agnostic TypeScript toolkit for the services most projects need:
typed HTTP, validation, caching, filesystem and browser utilities, and
framework integrations. It uses ESM, is safe to import during SSR, and keeps
optional framework integrations on separate package entry points.

[Documentation](https://docs.senseikatana.com/) ·
[Getting started](https://docs.senseikatana.com/guides/getting-started) ·
[API reference](https://docs.senseikatana.com/api/) ·
[Changelog](https://docs.senseikatana.com/changelog) ·
[Release history](./CHANGELOG.md) ·
[Examples](https://github.com/senseikatana/katanakit-js/tree/main/examples)

## Install

```bash
npm install katanakit-js
# or
bun add katanakit-js
```

Requires Node.js >= 22.18 or Bun >= 1.2. See the
[installation guide](https://docs.senseikatana.com/guides/getting-started) for
CDN usage, package entry points, and integration requirements.

## Quick start

```ts
import { defineApiConfig, useGetApi } from "katanakit-js";

defineApiConfig({
	pokeapi: {
		baseUri: "https://pokeapi.co/api/v2",
		endpoints: { pokemonById: "/pokemon/:id/" },
	},
});

const result = await useGetApi<{ name: string }>("pokeapi", "pokemonById", {
	params: { id: 25 },
});

if (result.ok) {
	console.log(result.data.name); // "pikachu"
} else {
	console.error(result.error.message);
}
```

Fallible operations return a **Safe Result** (`{ data, error, ok }`) instead
of throwing for expected failures. The
[first API client tutorial](https://docs.senseikatana.com/tutorials/first-api-client)
adds validation and caching to this example.

## What it includes

- HTTP clients with typed results and Zod validation
- Framework-free reactive signals with automatically tracked effects and memos
- TanStack Query caching and framework adapters for React, Vue, Solid, Svelte,
  Angular, Nuxt, and other runtimes
- Services for logging, storage, filesystem access, dates, DOM, and more
- Optional integrations for services such as Notion, WordPress, InsForge,
  AI assistants, and social sign-in (Better Auth) with
  validated multi-provider configuration

Browse the [guides](https://docs.senseikatana.com/guides/getting-started),
[service documentation](https://docs.senseikatana.com/guides/services/), and
[adapter guides](https://docs.senseikatana.com/guides/framework-adapters) for
setup and usage details.

## Contributing

Contributions are welcome. Start by checking the
[documentation](https://docs.senseikatana.com/) and
[open issues](https://github.com/senseikatana/katanakit-js/issues), then:

```bash
git clone https://github.com/senseikatana/katanakit-js.git
cd katanakit-js
git checkout dev
bun install
bun run check
```

Keep changes focused, add or update tests, and update the relevant docs with
public API changes. Read the full [contribution guide](./CONTRIBUTING.md) for
architecture, coding conventions, docs, and release workflow. To report a
vulnerability, follow [SECURITY.md](./SECURITY.md).

## License

MIT
