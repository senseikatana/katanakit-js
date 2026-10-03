---
title: Better Auth
description: Auth client for five frameworks plus Safe Result session and handler helpers.
---

# Better Auth

[`Better Auth`](https://better-auth.com) is a framework-agnostic auth server for
TypeScript. This adapter adds two things on top of the official integrations:

1. **One client factory for five frameworks** — only the entry you ask for is imported.
2. **Safe Result wrappers** for the server calls, so a failed session lookup never
   throws inside middleware or a route handler.

The server itself is still Better Auth's: mount `auth.handler`, keep `betterAuth()`
exactly as the [official docs](https://better-auth.com/docs/integrations/astro) describe.

## Install

```bash
bun add better-auth
```

`better-auth` is an **optional peer dependency** — only imported when you call the adapter.

## Server — handler, session, locals

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({ /* storage, socialProviders, plugins… */ });
```

### Mount the handler (Astro)

```ts
// src/pages/api/auth/[...all].ts
import type { APIRoute } from "astro";
import { auth } from "~/auth";
import { useAuthHandler } from "katanakit-js/adapters/better-auth";

export const ALL: APIRoute = async ({ request }) => {
	const result = await useAuthHandler(auth, request);
	return result.ok ? result.data : new Response("Auth unavailable", { status: 500 });
};
```

### Middleware → `Astro.locals`

```ts
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { auth } from "~/auth";
import { useAstroAuthLocals } from "katanakit-js/adapters/better-auth";

export const onRequest = defineMiddleware(async (context, next) => {
	const locals = await useAstroAuthLocals(auth, context.request);
	if (locals.ok) {
		context.locals.user = locals.data.user;
		context.locals.session = locals.data.session;
	}
	return next();
});
```

Anonymous visitors resolve to `{ user: null, session: null }` with `ok: true` —
only a real failure returns `ok: false`.

### Read the session anywhere server-side

```ts
import { useAuthSession } from "katanakit-js/adapters/better-auth";

const session = await useAuthSession(auth, request); // Request | Headers | { headers }
if (session.ok && session.data) {
	console.log(session.data.user.email);
}
```

## Client — five frameworks, one factory

```ts
import { useAuthClient } from "katanakit-js/adapters/better-auth";

// vanilla (no framework, plain <script>)
const authClient = await useAuthClient();

// the four framework entries — only the one you pick is bundled
const vue = await useAuthClient({ framework: "vue" });
const react = await useAuthClient({ framework: "react" });
const svelte = await useAuthClient({ framework: "svelte" });
const solid = await useAuthClient({ framework: "solid" });
```

The return type follows the framework, so destructuring keeps Better Auth's own types:

```ts
// lib/auth-client.ts (Vue)
import { useAuthClient } from "katanakit-js/adapters/better-auth";

export const authClient = await useAuthClient({ framework: "vue" });
export const { signIn, signUp, signOut, useSession } = authClient;
```

Options are Better Auth's `BetterAuthClientOptions`:

```ts
const authClient = await useAuthClient({
	framework: "react",
	baseURL: "https://auth.example.com",
	plugins: [/* organization(), twoFactor() … */],
});
```

## API

| Function                          | Returns                          | Fails when                         |
| --------------------------------- | -------------------------------- | ---------------------------------- |
| `useAuthClient(options?)`         | Framework-typed auth client      | the entry cannot be imported       |
| `useAuthSession(auth, request)`   | Session \| `null`                | the API call throws                |
| `useAuthHandler(auth, request)`   | `Response`                       | the handler throws                 |
| `useAstroAuthLocals(auth, request)` | `{ user, session }`            | the session lookup fails           |

Everything returns `{ data, error, ok }` — no `try/catch` at the call site.

## Other frameworks

Better Auth ships its own integrations for Next.js (`better-auth/next-js`),
SvelteKit (`better-auth/svelte-kit`), SolidStart, TanStack Start and Node
(`better-auth/node`). Use those directly; this adapter covers the client factory
and the Safe Result server helpers.
