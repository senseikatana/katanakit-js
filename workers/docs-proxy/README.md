# Docs proxy Worker

Mounts the `katanakit-docs` Pages project under `/en/docs/` on apex domains
that already serve other applications. The Pages project cannot share a
hostname with an unrelated origin, so this Worker reverse-proxies the docs
prefix.

## Domains

| Domain | Status |
| --- | --- |
| `senseikatana.com` | Primary (production) |
| `samuraicoder.dev` | Secondary (backup / vanity) |
| `katanakami.com` | Testing only — uncomment the route in `wrangler.jsonc` |

## Deploy

```bash
npx wrangler deploy -c workers/docs-proxy/wrangler.jsonc
```

Requires `CLOUDFLARE_API_TOKEN` or a `wrangler login` session with Workers
edit permission on the target zones.

## How it works

1. The Worker listens **only** on `*/en/docs/*` routes (see `wrangler.jsonc`).
2. It calls the Pages project through a Service Binding (no HTTP hop).
3. If the binding is unavailable (first deploy), it falls back to an HTTP
   fetch of `katanakit-docs.pages.dev`.
4. Everything outside `/en/docs/` returns 404 so existing zone routes
   (the extranet app, samurai site, etc.) are never affected.

## Adding a domain

1. Make sure the zone exists in the Cloudflare account.
2. Add a route entry in `wrangler.jsonc`.
3. Re-deploy: `npx wrangler deploy -c workers/docs-proxy/wrangler.jsonc`.

## Removing the proxy

Delete the routes from `wrangler.jsonc` and redeploy, or
`npx wrangler delete -c workers/docs-proxy/wrangler.jsonc` to remove the
Worker entirely. The Pages project keeps running independently at
`docs.senseikatana.com`.