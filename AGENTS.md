# AGENTS.md — katanakit-js

TypeScript service toolkit (ESM, hexagonal). Bun for package management and scripts.
Infrastructure: Cloudflare only (Pages, R2, DNS); INSForge only as database fallback; Prisma is the local ORM.

## Commands (order matters: lint → typecheck → test)

- `bun run check` — gate: `eslint ./src packages/ui/src` + `tsc6 --noEmit` (+ `tsc6 -p packages/ui/tsconfig.json --noEmit`) + `vitest run`. Must pass before any PR.
- `bun run fix` — same with `eslint --fix`. 
- ESLint 10 is **flat config only** — rules live in `eslint.config.mjs`; a `.eslintrc.json` is silently ignored. Never add one.
- Commits run husky `pre-commit` → `bunx lint-staged` → `eslint --fix --quiet` on staged `**/*.{ts,tsx}`. Skip with `git commit --no-verify`; disable hook install with `HUSKY=0 bun install`.
- `bun run build` — clean + check + `tsc6 -p tsconfig.json` → `dist/`, then `generate-release-notes.mjs --sync-versions` and `examples:check` typecheck against built output so `package.json` and every version pinned in the README/guides always name the newest git tag (idempotent).
- `bun run ui:build` — builds `@katanakit/ui` (`tsc` + `sass` → `packages/ui/dist`); `docs:dev`/`docs`/`docs:gh` run it first.
- Docs: VitePress in `docs/` (`bun run docs:dev`, `bun run docs` → `docs/.vitepress/dist`). `scripts/docs-prepare.mjs` generates the TypeDoc API reference and the changelog page; CI does NOT build docs (deploy workflow does).
- `bun run dev` — runs the Express dev server. Use `bun run bun:dev` for Bun alternative.
- One test file: `vitest run <path>`. Tests live in `tests/`, import via `@/` alias, node env.
- `tsc6`, NOT `tsc`: `typescript` devDep is aliased to `@typescript/typescript6@6.0.2`.

## Architecture

- `src/types/` single source of truth; `src/core/services/` pure (no I/O); `src/infrastructure/` runtime I/O (browser + Node/Bun, SSR-safe); `src/adapters/*` framework entry points published as package subpaths — never import them from the main barrel. `@faker-js/faker` is an optional peer loaded lazily by `core/services/faker.service.ts`. `packages/ui/` is the private `@katanakit/ui` workspace (Katana UI foundations) styled with the SCSS framework vendored in `scss/` (origin: `katanakit-css@0.12.5`); the docs consume its built `dist/` through Vite aliases.
- All relative imports inside `src/` MUST use explicit `.js` extension (nodenext). `@/` alias only in `tests/` and `examples/`.
- `use*` prefix on every public method (except `getInstance()`); English only; no side effects on import; SSR guards where `window`/`document` touched; fallible async returns Safe Result `{ data, error, ok }` — prefer `useAttempt()` / `useTryJsonParse()` / `useErrorNormalize()` over ad-hoc `try/catch` at boundaries.
- Services are Singleton facades with destructured re-exports; `adapters/nuxt` exports pure functions (exception).

## Docs

- Docs: VitePress in `docs/` (`bun run docs:dev`, `bun run docs` → `docs/.vitepress/dist`). `scripts/docs-prepare.mjs` generates the TypeDoc API reference and the changelog page; CI does NOT build docs (deploy workflow does).
- `docs:dev` and `docs`/`docs:gh` are mutually exclusive (shared `docs/.vitepress/.temp`): `scripts/docs.mjs` enforces a lock, cleans stale state and fails with guidance.

## Git workflow

- Branch from `dev` (conventional commits). Never PR `feature` → `main` directly.
- Before any PR: `git checkout dev && git merge <branch>` — features land in `dev` first.
- PRs to `main` come only from `dev`. Merge only green. Delete branches after merge.
- `CHANGELOG.md` holds **released versions only** — no `[Unreleased]` buffer, in the file or on the docs page. `scripts/generate-release-notes.mjs <tag> --write` writes the `[X.Y.Z] - date` section from the Conventional Commits since the previous tag (and refreshes the version pinned in README/docs), so the commit subject *is* the changelog entry: make it describe the user-visible change. `bun run release` runs it automatically; versioning itself is plain `npm version`.
- Release via CI: trigger `.github/workflows/release.yml` (workflow_dispatch, pick patch/minor/major). Manual fallback: `bun run release` (the bump level comes from `useGit release create`).
- **PREREQUISITE**: Trusted publishing must be configured on npmjs.com (Package Settings → Publishing access → Trusted publishing → repo `senseikatana/katanakit-js`, workflow `release.yml`).

## CI (.github/workflows/ci.yml + release.yml)

- Triggers: push/PR to `main` and `dev`. Matrix node 22/24, `fail-fast: false` (both versions always report).
- Steps: `bun install --frozen-lockfile` → `bun run check` → `bun run build` → `bun run examples:check`.
- `bun install --frozen-lockfile` fails if `bun.lock` is out of sync — commit lockfile changes.
- `simple-import-sort` fails CI on unsorted imports — run `bun run fix`.

## Cloudflare (only hosting/storage provider)

- **Docs:** `katanakit-docs` project → `docs.senseikatana.com` (VitePress build output `docs/.vitepress/dist/`; the old `guides/` and `playground/` workspaces are gone)
- Deploy: `bun run cf:deploy` (builds the package, then the docs, then deploys with wrangler). Wrangler is pinned in devDeps.
- CI: `.github/workflows/deploy.yml` is **not tracked** (gitignored — it kept failing with `Deploy failed`). Docs deploy locally with `bun run cf:deploy`; `scripts/setup-cloudflare.mjs` provisions the project and secrets.
- Provision/verify projects, custom domains and CI secrets: `node scripts/setup-cloudflare.mjs [--apply] [--github-secrets]`.
- Storage: R2 for objects; database pending (Cloudflare D1, INSForge as fallback). Local ORM is Prisma (`prisma.config.ts`).
- `.env` gotcha: a non-empty `CLOUDFLARE_API_TOKEN` overrides the `wrangler login` OAuth session; leave it empty locally to use OAuth.
- Never add non-Cloudflare hosting/deploy providers. Two documented exceptions: INSForge for the database fallback, and the manual `bun run docs:gh` preview on the `gh-pages` branch (no GitHub Actions) — Cloudflare stays the production host.
- Cloudflare Account ID: `d84658746e925afe768db13e48a136a7`

## Secret Management

- Do not commit real tokens or secrets into the repo.
- Keep `CLOUDFLARE_API_TOKEN` and other sensitive env vars empty or omitted in local `.env`, using `.env.example` and CI secrets for real values.
- The `.env` file is ignored by `.gitignore`; only the empty template remains in the repo.
- For local development, leaving `CLOUDFLARE_API_TOKEN` empty ensures `wrangler login` OAuth is used.

## npm security

- `.npmrc` disables dependency lifecycle scripts (`allow-scripts=`). If a new dependency needs scripts, add it explicitly.
- Releases publish through `.github/workflows/release.yml` with **OIDC trusted publishing** — no `NPM_TOKEN` secret and no long-lived token. One-time npmjs.com config: `katanakit-js` → Settings → Publishing access → Trusted Publisher → GitHub Actions (`senseikatana/katanakit-js`, workflow `release.yml`, no environment).
- Keep **“Allow npm publish”** enabled on that trusted publisher: `release.yml` runs `npm publish --provenance` directly. Without it, versions are **staged** and require `npm stage approve` (npm CLI 12+) or approval in the npm UI.
- Publishing access is set to **“Require two-factor authentication and disallow bypass 2fa tokens”**; OIDC publishers keep working with it. Never create bypass-2FA tokens for publishing.
- Docs: https://docs.npmjs.com/trusted-publishers
