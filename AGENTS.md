# AGENTS.md — katanakit-js

TypeScript service toolkit (ESM, hexagonal). Bun for package management and scripts.
Infrastructure: Cloudflare only (Pages, R2, DNS); INSForge only as database fallback; Prisma is the local ORM.

## Commands (order matters: lint → typecheck → test)

- `bun run check` — gate: `eslint ./src` + `tsc6 --noEmit` + `vitest run`. Must pass before any PR.
- `bun run fix` — same with `eslint --fix`.
- `bun run build` — clean + check + `tsc6 -p tsconfig.json` → `dist/`.
- `bun run examples:check` — typechecks `examples/query/*` against the built `dist/`; run `bun run build` first.
- `bun run ui:build` — builds `@katanakit/ui` (`tsc` + `sass` → `packages/ui/dist`); `docs:dev`/`docs:build`/`docs:gh` run it first.
- Docs: VitePress in `docs/` (`bun run docs:dev`, `bun run docs:build` → `docs/.vitepress/dist`). `scripts/docs-prepare.mjs` generates the TypeDoc API reference and the changelog page; CI does NOT build docs (deploy workflow does).
- `bun run dev:all` — runs the Express, assistant, Telegram and WhatsApp dev servers concurrently.
- One test file: `vitest run <path>`. Tests live in `tests/`, import via `@/` alias, node env.
- `tsc6`, NOT `tsc`: `typescript` devDep is aliased to `@typescript/typescript6@6.0.2`.

## Architecture

- `src/types/` single source of truth; `src/core/services/` pure (no I/O); `src/infrastructure/` runtime I/O (browser + Node/Bun, SSR-safe); `src/adapters/*` framework entry points published as package subpaths — never import them from the main barrel. `@faker-js/faker` is an optional peer loaded lazily by `core/services/faker.service.ts`. `packages/ui/` is the private `@katanakit/ui` workspace (Katana UI foundations) styled with `katanakit-css`; the docs consume its built `dist/` through Vite aliases.
- All relative imports inside `src/` MUST use explicit `.js` extension (nodenext). `@/` alias only in `tests/` and `examples/`.
- `use*` prefix on every public method (except `getInstance()`); English only; no side effects on import; SSR guards where `window`/`document` touched; fallible async returns Safe Result `{ data, error, ok }` — prefer `useAttempt()` / `useTryJsonParse()` / `useErrorNormalize()` over ad-hoc `try/catch` at boundaries.
- Services are Singleton facades with destructured re-exports; `adapters/nuxt` exports pure functions (exception).

## Docs

- Docs: VitePress (`docs/`, base `/`) served at `docs.senseikatana.com/*`. `bun run docs:prepare` generates `docs/api/` (TypeDoc + sidebar JSON) and `docs/changelog.md` from `CHANGELOG.md`; both are gitignored — never hand-edit them. Every page starts with YAML frontmatter (`title`, `description`) so Obsidian reads them as properties. JS/TS inside `.md` goes through `<script setup lang="ts">` (Vue-in-Markdown); VitePress does NOT support MDX. `docs:dev` and `docs:build`/`docs:gh` are mutually exclusive (shared `docs/.vitepress/.temp`): `scripts/docs.mjs` enforces a lock, cleans stale state and fails with guidance.

## Git workflow

- Branch from `dev` (conventional commits). Never PR `feature` → `main` directly.
- Before any PR: `git checkout dev && git merge <branch>` — features land in `dev` first.
- PRs to `main` come only from `dev`. Merge only green. Delete branches after merge.
- CHANGELOG `[Unreleased]` entry for **every user-visible change, in the same commit**. `scripts/bump-version.mjs` promotes it to `[X.Y.Z] - date` on release and refuses to release an empty section. README + docs updated with features.
- Release via CI: trigger `.github/workflows/release.yml` (workflow_dispatch, pick patch/minor/major). Manual fallback: `bun run release[:minor|:major]`.
- **PREREQUISITE**: Trusted publishing must be configured on npmjs.com (Package Settings → Publishing access → Trusted publishing → repo `senseikatana/katanakit-js`, workflow `release.yml`).

## CI (.github/workflows/ci.yml + release.yml)

- Triggers: push/PR to `main` and `dev`. Matrix node 22/24, `fail-fast: false` (both versions always report).
- Steps: `bun install --frozen-lockfile` → `bun run check` → `bun run build` → `bun run examples:check`.
- `bun install --frozen-lockfile` fails if `bun.lock` is out of sync — commit lockfile changes.
- `simple-import-sort` fails CI on unsorted imports — run `bun run fix`.

## Cloudflare (only hosting/storage provider)

- **Docs:** `katanakit-docs` project → `docs.senseikatana.com` (VitePress build output `docs/.vitepress/dist/`; the old `guides/` and `playground/` workspaces are gone)
- Deploy: `bun run cf:deploy` (builds the package, then the docs, then deploys with wrangler). Wrangler is pinned in devDeps.
- CI: `.github/workflows/deploy.yml` deploys the docs on push to `main` (GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).
- Provision/verify projects, custom domains and CI secrets: `node scripts/setup-cloudflare.mjs [--apply] [--github-secrets]`.
- Storage: R2 for objects; database pending (Cloudflare D1, INSForge as fallback). Local ORM is Prisma (`prisma.config.ts`).
- `.env` gotcha: a non-empty `CLOUDFLARE_API_TOKEN` overrides the `wrangler login` OAuth session; leave it empty locally to use OAuth.
- Never add non-Cloudflare hosting/deploy providers. Two documented exceptions: INSForge for the database fallback, and the manual `bun run docs:gh` preview on the `gh-pages` branch (no GitHub Actions) — Cloudflare stays the production host.
- Cloudflare Account ID: `d84658746e925afe768db13e48a136a7`

## npm security

- `.npmrc` disables dependency lifecycle scripts (`allow-scripts=`). If a new dependency needs scripts, add it explicitly.
- Releases publish through `.github/workflows/release.yml` with **OIDC trusted publishing** — no `NPM_TOKEN` secret and no long-lived token. One-time npmjs.com config: `katanakit-js` → Settings → Publishing access → Trusted Publisher → GitHub Actions (`senseikatana/katanakit-js`, workflow `release.yml`, no environment).
- Keep **“Allow npm publish”** enabled on that trusted publisher: `release.yml` runs `npm publish --provenance` directly. Without it, versions are **staged** and require `npm stage approve` (npm CLI 12+) or approval in the npm UI.
- Publishing access is set to **“Require two-factor authentication and disallow bypass 2fa tokens”**; OIDC publishers keep working with it. Never create bypass-2FA tokens for publishing.
- Docs: https://docs.npmjs.com/trusted-publishers
