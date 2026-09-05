# Deploy

How to deploy applications using KatanaKit.

KatanaKit is framework-agnostic and works with any deployment target. This guide
covers common deployment scenarios.

## Static sites (Astro)

KatanaKit's Astro adapter works with static site generation. Build your site and
deploy to any static host:

```bash
astro build
```

The `dist/` directory can be deployed to Vercel, Netlify, Cloudflare Pages, or
GitHub Pages.

## Node.js servers (Express)

The Express reference adapter runs on any Node.js host:

```ts
import { ServerExpress } from "katanakit-js/adapters/express";

ServerExpress.getInstance().useStart();
```

Deploy to Railway, Render, Fly.io, or any VPS with `node` installed.

## Nuxt / Nitro

The Nuxt adapter works with Nitro's server routes. Build with:

```bash
nuxt build
```

Deploy to any Nitro-supported target: Vercel, Netlify, Cloudflare Workers, or
a Node.js server.

## Environment variables

If you use the Prisma layer, ensure `DATABASE_URL` is set in your deployment
environment:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

## Next steps

- Read the [Architecture](/architecture/) guide for layer responsibilities.
- See the [API Reference](/api-overview/) for exact signatures.
