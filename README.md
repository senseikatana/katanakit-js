# KatanaKit JS

A framework-agnostic TypeScript toolkit for the services most projects need:
typed HTTP, validation, caching, reactive signals, authorization, and browser
utilities. It ships ESM, is safe to import during SSR, and keeps every optional
framework integration on its own package entry point — so a Vue app never pulls
React, and a server build never pulls the DOM.

[Documentation](https://docs.senseikatana.com/) ·
[Getting started](https://docs.senseikatana.com/guides/getting-started) ·
[Tutorial](https://docs.senseikatana.com/tutorials/first-api-client) ·
[API reference](https://docs.senseikatana.com/api/) ·
[Changelog](https://docs.senseikatana.com/changelog) ·
[Release history](./CHANGELOG.md)

---

## Installation

```bash
npm install katanakit-js
# or
bun add katanakit-js
# or
pnpm add katanakit-js
```

Requires **Node.js >= 22.18** or **Bun >= 1.2**. Nothing else is a hard
dependency — Zod and Prisma are only needed if you use the modules that
import them.

Framework integrations are optional peers. Install the one you need:

```bash
bun add better-auth @insforge/sdk   # only if you use those adapters
bun add express hono                 # only if you run a server
```

See the [installation guide](https://docs.senseikatana.com/guides/getting-started)
for CDN usage and integration requirements.

---

## Getting started

Three steps: configure the client once, call it, branch on the result. Nothing
throws for an expected failure.

```ts
import { defineApiConfig, useGetApi } from "katanakit-js";

// 1. Declare the API once, at module scope.
defineApiConfig({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});

// 2. Call it. The path params are typed from the endpoint name.
const result = await useGetApi<{ name: string }>("pokeapi", "pokemonById", {
  params: { id: 25 },
});

// 3. Branch. `result.ok` narrows the union for you.
if (result.ok) {
  console.log(result.data.name); // "pikachu"
} else {
  console.error(result.error.message);
}
```

### Safe Results

This is the convention the whole toolkit follows. A fallible operation returns
a discriminated union instead of throwing, so a `try`/`catch` around a network
call is never the interesting part of your code:

```ts
type SafeResult<T, E> =
  | { data: T;    error: null; ok: true  }
  | { data: null; error: E;   ok: false };
```

`ok: false` means *the call failed*. `data: null` with `ok: true` means *it
succeeded and the answer is legitimately nothing* — a missing record is not an
error, and the two are never collapsed into one.

The [error handling guide](https://docs.senseikatana.com/guides/errors) covers
the error shapes and the helpers that build them.

### Validate at the boundary

Parsing an untrusted payload is the one thing worth doing every time. It turns a
runtime surprise into a compile-time error:

```ts
import { useValidate } from "katanakit-js";
import { z } from "zod";

const Pokemon = z.object({
  id: z.number(),
  name: z.string(),
  types: z.array(z.object({ type: z.object({ name: z.string() }) })),
});

const parsed = useValidate(Pokemon, await result.data);

if (parsed.ok) {
  parsed.data.types[0]?.type.name; // fully typed
} else {
  console.error(parsed.error.message);
}
```

---

## What it includes

### Authorization — roles, capabilities and resource grants

A role says *what class of thing* a person may ever do. A grant says *whether
they may do it to this one thing*. Both are needed the moment you share a
document with one person and not with everybody else.

```ts
import { AccessService, useCan, useRegisterRole } from "katanakit-js";

// The built-in ladder is owner > admin > editor > author > member > guest,
// and each role inherits everything below it.
useCan({ id: 1, roles: ["editor"] }, "content:publish"); // true
useCan({ id: 2, roles: ["author"] }, "content:edit:any"); // false

// Register a role for your own domain. Roles and capabilities are open
// strings, not a closed enum — `nomina:aprobar` is a legal capability.
useRegisterRole({
  slug: "rrhh",
  label: "RRHH",
  rank: 4,
  capabilities: ["nomina:aprobar"],
});
```

Then resolve against a **specific** resource. Global roles are checked first,
then grants scoped to that resource:

```ts
import { useGrantAwareCan } from "katanakit-js";

const decision = useGrantAwareCan({
  subject,                                   // from useResolveSubject()
  resource: { type: "expediente", id: 42 },
  capability: "expediente:read",
  useGrants: ({ subject, resource }) => listShares(subject.id, resource),
});

decision.allowed; // boolean
decision.source;  // "role" | "grant" | "none" — why, for your audit log
```

Storage is injected, never assumed: the kit ships the contract, your table
holds the rows. Expired grants are evaluated by the core, so revoking access
means deleting one record.

Pair it with a directory that refuses to lock you out:

```ts
import { DirectoryService } from "katanakit-js";

const directory = new DirectoryService({ repository });
const result = await directory.useSuspend(actor, id, "contract ended");

if (!result.ok) {
  // "last_owner", "self_suspension", "privilege_escalation", ...
  console.error(result.error.code, result.error.message);
}
```

The last active holder of a role cannot lose it, nobody can suspend or demote
themselves, and `owner` is never assigned through these paths.

→ [Access control guide](https://docs.senseikatana.com/guides/access-control)

### Authentication — one port, any provider

Identity, credential and authorization are three different things. The kit
normalizes the first two into a single `Principal` so the third never has to
know which provider produced it:

```ts
import { AuthService, useResolveSubject } from "katanakit-js";
import { useBetterAuthProvider } from "katanakit-js/adapters/better-auth";

AuthService.getInstance().useRegister(useBetterAuthProvider(auth));

// The seam between authentication and authorization. The role lookup is
// yours, so the core stays free of I/O.
const subject = await useResolveSubject("better-auth", request, (principal) =>
  directory.rolesFor(principal.subject),
);

if (!subject.ok) return response.status(500).end(); // the provider is broken
if (!subject.data) return response.status(401).end(); // anonymous
// subject.data is now an AccessSubject with roles
```

Swap the provider, keep the rest of the app. InsForge, Better Auth, or your own
national-identity integration — they all implement the same `IAuthProvider`.

**An anonymous visitor is `{ ok: true, data: null }`, not an error.** Only a real
failure is `ok: false`. Flattening those two turns a broken provider into a
publicly readable route.

→ [Better Auth guide](https://docs.senseikatana.com/guides/better-auth) ·
[InsForge guide](https://docs.senseikatana.com/guides/insforge)

### Reactive signals

Framework-free reactivity with automatically tracked dependencies. No build step,
no decorators, no runtime dependency:

```ts
import { useCreateEffect, useCreateMemo, useCreateSignal } from "katanakit-js";

const [count, setCount] = useCreateSignal(0);
const doubled = useCreateMemo(() => count() * 2);

useCreateEffect(() => {
  console.log("now", doubled()); // re-runs only when `count` actually changes
});

// setCount((n) => n + 1);
```

Works identically in Node and in the browser — the effect simply does not run
where there is no DOM to update.

→ [Reactive guide](https://docs.senseikatana.com/guides/services/reactive)

### Framework adapters

One import path per runtime, so a bundle only ever contains what it uses:

```ts
import { useAuthClient } from "katanakit-js/adapters/vue";
import { useRequireCapability } from "katanakit-js/adapters/express";
import { useAstroAuthLocals } from "katanakit-js/adapters/astro";
```

Available entry points: `express`, `hono`, `bun`, `nestjs`, `nuxt`, `vue`,
`astro`, `react`, `solid`, `svelte`, `angular`, `vanilla`, `better-auth`,
`insforge`, `assistant`, `notion`, `wordpress`, `photoswipe`, plus `/schemas`,
`/prisma` and `/styles.css`.

→ [Framework adapters](https://docs.senseikatana.com/guides/framework-adapters)

### Typed HTTP, dates, arrays and more

```ts
import { useDateAdd, useDateBetween, useDateOrder, useFormat } from "katanakit-js";

useFormat("2026-03-01", "es", { dateStyle: "long" }); // "1 de marzo de 2026"
useDateAdd("2026-03-01", 30, "days");                 // "2026-03-31"
useDateBetween("2026-03-01", "2026-04-01", "days");   // 31
useDateBetween("2026-03-01", "2026-04-01", "months"); // 1
useDateOrder("2026-04-01", "2026-03-01");             // "after"
```

`useDateBetween()` is signed and never fractional, and its units are the ones
Notion uses in its formula editor — `years`, `quarters`, `months`, `weeks`,
`days`, `hours`, `minutes`.

→ [All services](https://docs.senseikatana.com/guides/services/)

---

## Examples

Runnable projects live in [`examples/`](./examples):

| Example | What it shows |
| --- | --- |
| [`api-manager`](./examples/api-manager) | Typed HTTP clients, interceptors, Safe Results |
| [`query`](./examples/query) | TanStack Query caching and framework adapters |
| [`astro`](./examples/astro) | SSR-safe imports and the Astro integration |
| [`vue`](./examples/vue) | Reactive signals inside Vue |
| [`prisma`](./examples/prisma) | The Prisma contract and typed queries |
| [`assistant`](./examples/assistant) | The AI assistant with a capability guard |
| [`notion`](./examples/notion) · [`wordpress`](./examples/wordpress) | Content integrations |
| [`agent`](./examples/agent) · [`observer`](./examples/observer) · [`geometry`](./examples/geometry) | Agent providers, watchers, geometry helpers |
| [`seed`](./examples/seed) | Faker-driven test data |

---

## Documentation

The site follows [Diátaxis](https://diataxis.fr): one page, one kind.

| Kind | Where | Read it when |
| --- | --- | --- |
| Tutorial | [first-api-client](https://docs.senseikatana.com/tutorials/first-api-client) | You are learning the toolkit end to end |
| How-to | [guides](https://docs.senseikatana.com/guides/getting-started) | You know the goal and need the steps |
| Reference | [API reference](https://docs.senseikatana.com/api/) | You need exact signatures |
| Explanation | [why KatanaKit](https://docs.senseikatana.com/explanation/why-katanakit) · [decisions](https://docs.senseikatana.com/explanation/decisions/) | You want the reasoning behind a choice |

Architecture decisions are recorded as ADRs and are never rewritten — see the
[decisions index](https://docs.senseikatana.com/explanation/decisions/).

---

## Contributing

```bash
git clone https://github.com/senseikatana/katanakit-js.git
cd katanakit-js
git checkout dev
bun install
bun run check   # ESLint, typechecks, tests
```

Keep changes focused, add or update tests, and update the relevant docs with any
public API change. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the
architecture rules, coding conventions and release workflow. To report a
vulnerability, see [SECURITY.md](./SECURITY.md).

## License

MIT