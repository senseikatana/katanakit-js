# Security

This document summarizes the security posture of KatanaKit and provides
guidance for deploying it safely.

## Trust boundary

The library is a set of utilities. Its security depends on how you configure and
deploy it. In particular:

- **API registry (`useInit`)** is trusted configuration. Validate the origin of any
  `baseUri` before registering it from untrusted input.
- **Worker functions** (`WorkerService`) are serialized with `func.toString()` and
  executed inside a Web Worker. Only pass functions that are part of your own
  bundle — never functions derived from user input. A Web Worker is **not** a
  security sandbox.
- **Database** (`src/prisma/db.ts`) uses the `DATABASE_URL` environment variable.
  Never commit `.env` files; use `.env.example` as a template.

## Built-in protections

- **URL construction** (`FetchApiManager.useBuildUrl`) uses `encodeURIComponent` for
  path params, `URLSearchParams` for query params, and rejects any scheme other
  than `http:`/`https:` (prevents `javascript:` URLs and SSRF).
- **Storage** (`StorageService`) JSON-serializes values and falls back to an
  in-memory store in SSR, so importing it never crashes outside the browser.
- **Worker cleanup** (`WorkerService.useRun`) terminates the worker and revokes its
  object URL on every path (success, error and non-cloneable results).
- **Server errors** (`ServerExpress`) return generic messages without leaking
  stack traces.

## Recommendations for production

These are hardening steps you should take when the library is used with real data
or authentication:

### 1. Do not use `useEncrypt` for credentials

`GeneratorService.useEncrypt` is a one-way hash **demo** with a fixed default salt
and non-self-contained output. For real passwords, use `scrypt` or `argon2id` with
a per-user random salt and a constant-time `verify`. Prefer `crypto.randomUUID` or
`crypto.getRandomValues` over `Math.random()` for tokens and ids.

### 2. Restrict CORS and add rate limiting (Express adapter)

`src/adapters/express/server.ts` currently uses `cors()` (all origins) and has no
rate limiting. Before exposing data:

```ts
import rateLimit from "express-rate-limit";

app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") ?? ["http://localhost:5173"],
  }),
);
app.use(rateLimit({ windowMs: 60_000, limit: 100 }));
app.use(express.json({ limit: "16kb" }));
```

### 3. Never render stored values as HTML

Treat everything read from `useGetStorage` as untrusted. Use `useSetText`/`textContent`
instead of `useSetHtml`/`innerHTML` when displaying stored data, otherwise a value
like `<img src=x onerror=...>` becomes a stored XSS. Do not store session or auth
tokens in `localStorage`; prefer `HttpOnly` + `SameSite` cookies.

### 4. Validate `ThemeService` input

`ThemeService.useInitTheme` reads the stored mode without validating it. Check that
the stored value is `"light"`, `"dark"` or `"system"` before using it.

### 5. Run a dependency scanner in CI

`cors` receives minimal maintenance and is a candidate for replacement by manual
header configuration. Integrate `osv-scanner`, `bun audit` (where supported) or
Dependabot to keep dependencies reviewed.

### 6. Database security (Prisma)

- Use connection pooling (PgBouncer or Prisma Accelerate) in production.
- Enable SSL/TLS in your `DATABASE_URL` (`?sslmode=require`).
- Never log or expose `DATABASE_URL` in client-side code.
- Use Prisma's built-in query parameterization (no string concatenation).

## Reporting a vulnerability

Please open an issue or contact the maintainer privately. Do not disclose
sensitive details publicly before a fix is available.
