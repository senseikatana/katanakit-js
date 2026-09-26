# AGENTS.md — katanakit-js

TypeScript service toolkit (ESM, hexagonal). Bun for package management and scripts.
Infrastructure: Cloudflare only (Pages, R2, DNS); INSForge only as database fallback; Prisma is the local ORM.

## Commands (order matters: lint → typecheck → test)

- `bun run check` — gate: `eslint ./src` + `tsc6 --noEmit` + `vitest run`. Must pass before any PR.
- `bun run fix` — same with `eslint --fix`.
- `bun run build` — clean + check + `tsc6 -p tsconfig.json` → `dist/`.
- `bun run examples:check` — typechecks `examples/query/*` against the built `dist/`; run `bun run build` first.
- `bun run guides:build` — Docusaurus build (separate; CI does NOT build docs).
- `bun run playground:dev` — launches the Vue playground (Vite dev server on port 5173).
- One test file: `vitest run <path>`. Tests live in `tests/`, import via `@/` alias, node env.
- `tsc6`, NOT `tsc`: `typescript` devDep is aliased to `@typescript/typescript6@6.0.2`.

## Architecture

- `src/types/` single source of truth; `src/core/services/` pure (no I/O); `src/infrastructure/` runtime I/O (browser + Node/Bun, SSR-safe); `src/adapters/*` framework entry points published as package subpaths — never import them from the main barrel. `@faker-js/faker` is an optional peer loaded lazily by `core/services/faker.service.ts`.
- All relative imports inside `src/` MUST use explicit `.js` extension (nodenext). `@/` alias only in `tests/` and `examples/`.
- `use*` prefix on every public method (except `getInstance()`); English only; no side effects on import; SSR guards where `window`/`document` touched; fallible async returns Safe Result `{ data, error, ok }`.
- Services are Singleton facades with destructured re-exports; `adapters/nuxt` exports pure functions (exception).

## Docs

- Docusaurus in `guides/`. Sidebar: manual Guides + TypeDoc-generated `guides/content/api/` (never hand-edit `guides/content/api/`).

## Git workflow

- Branch from `dev` (conventional commits). Never PR `feature` → `main` directly.
- Before any PR: `git checkout dev && git merge <branch>` — features land in `dev` first.
- PRs to `main` come only from `dev`. Merge only green. Delete branches after merge.
- CHANGELOG `[Unreleased]` entry for user-visible changes; README + docs updated with features.
- Release via CI: trigger `.github/workflows/release.yml` (workflow_dispatch, pick patch/minor/major). Manual fallback: `bun run release[:minor|:major]`.
- **PREREQUISITE**: Trusted publishing must be configured on npmjs.com (Package Settings → Publishing access → Trusted publishing → repo `senseikatana/katanakit-js`, workflow `release.yml`).

## CI (.github/workflows/ci.yml + release.yml)

- Triggers: push/PR to `main` and `dev`. Matrix node 22/24, `fail-fast: false` (both versions always report).
- Steps: `bun install --frozen-lockfile` → `bun run check` → `bun run guides:check` → `bun run build` → `bun run examples:check`.
- `bun install --frozen-lockfile` fails if `bun.lock` is out of sync — commit lockfile changes.
- `simple-import-sort` fails CI on unsorted imports — run `bun run fix`.

## Cloudflare (only hosting/storage provider)

- **Docs:** `katanakit-docs` project → `docs.senseikatana.com` (the `guides/` workspace is named `katanakit-guides`)
- **Playground:** `katanakit-playground` project → `play.senseikatana.com`
- Deploy: `bun run guides:deploy`, `bun run playground:deploy`, or `bun run cf:deploy`. Wrangler is pinned in devDeps. The playground resolves `katanakit-js` from `dist/`, so deploy scripts build the package first.
- CI: `.github/workflows/deploy.yml` deploys both on push to `main` (GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).
- Provision/verify projects, custom domains and CI secrets: `node scripts/setup-cloudflare.mjs [--apply] [--github-secrets]`.
- Storage: R2 for objects; database pending (Cloudflare D1, INSForge as fallback). Local ORM is Prisma (`prisma.config.ts`).
- `.env` gotcha: a non-empty `CLOUDFLARE_API_TOKEN` overrides the `wrangler login` OAuth session; leave it empty locally to use OAuth.
- Never add non-Cloudflare hosting/deploy providers; the only allowed exception is INSForge for the database fallback.
- Cloudflare Account ID: `d84658746e925afe768db13e48a136a7`

## npm security

- `.npmrc` disables dependency lifecycle scripts (`allow-scripts=`). If a new dependency needs scripts, add it explicitly.
- Release workflow uses OIDC trusted publishing — no long-lived NPM_TOKEN secret. Requires npmjs.com trusted publisher config (see Git workflow section).
- Token docs: https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-granular-access-tokens-on-the-website
- **Pending (npm account suspended):**
  1. Create `katanakit-publish` token on npmjs.com (bypass-2FA unchecked, scoped to `katanakit-js`, read-write)
  2. Revoke old `NPM_TOKEN` (id: `1e997c`, has bypass-2FA=true)
  3. Configure Trusted Publishers: npmjs.com → Package Settings → Publishing access → Trusted publishing → repo `senseikatana/katanakit-js`, workflow `release.yml`
