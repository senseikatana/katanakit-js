# AGENTS.md — katanakit-js

TypeScript service toolkit (ESM, hexagonal). Bun is the package manager and script runner; Node >= 22.18 (`engines`). Infrastructure: Cloudflare only (Pages, R2, DNS); INSForge only as database fallback; Prisma is the local ORM.

## Docs sync premise (always, since 2026-10-04)

Every change refreshes all three in the same work: `README.md` (features, adapters, examples), `AGENTS.md` (rules, gotchas, conventions) and `CHANGELOG.md` (via `scripts/generate-release-notes.mjs` at release time — commit subjects are the entries). Never land a behavior/API change without updating the first two.

## Commands (gate order: lint → typecheck → test)

- `bun run check` — the gate: `eslint ./src packages/ui/src` + `tsc6 --noEmit` + `tsc6 -p packages/ui/tsconfig.json --noEmit` + `vitest run`. Must pass before any PR.
- `bun run fix` — `eslint --fix` + typecheck + tests; unlike `check`, it skips the `@katanakit/ui` typecheck. There is no separate `lint`/`format` script: Prettier runs through `eslint-plugin-prettier`.
- ESLint 10 is **flat config only** — rules live in `eslint.config.mjs`; a `.eslintrc.json` is silently ignored. Never add one.
- Husky `pre-commit` → `bunx lint-staged` → `eslint --fix --quiet` on staged `**/*.{ts,tsx}`; `bun run dev` also triggers `predev` → lint-staged. Skip with `git commit --no-verify`; disable hook install with `HUSKY=0 bun install`.
- `bun run build` — clean + `check` + `tsc6 -p tsconfig.json` → `dist/`, then `ui:build`, copies `packages/ui/dist/styles.css` → `dist/styles.css`, runs `generate-release-notes.mjs --sync-versions`, then `examples:check`. `--sync-versions` **rewrites `package.json` and the version refs in README/docs to the newest `v*` tag**, so a build can touch those files.
- `bun run examples:check` — typechecks `examples/query/*` and `examples/seed/*` via `tsconfig.examples*.json`, mapping `katanakit-js` → `dist/`; run it after a build.
- `bun run ui:build` — builds the private `@katanakit/ui` workspace (`tsc` + `sass` → `packages/ui/dist`); `dev`/`docs`/`docs:gh` run it automatically.
- `bun run dev` — docs site dev server (Astro Starlight); `bun run server:dev` is the Express dev server (`tsx`), `bun run bun:dev` the Bun one.
- One test file: `vitest run <path>`. The root run covers `tests/**` and `packages/ui/tests/**` in node env; `vitest.config.ts` aliases `@` → `src` and forces Solid's client builds (SSR builds turn signals/effects into no-ops).
- `tsc6`, NOT `tsc`: the `typescript` devDep is aliased to `@typescript/typescript6@6.0.2`.

## Architecture

- `src/types/` is the single source of truth, inferred from the Zod schemas in `src/schemas/` via `z.infer` — add both schema and type, never re-declare shapes. `src/core/services/` is pure (no I/O); `src/infrastructure/` owns runtime I/O (browser + Node/Bun, SSR-safe); `src/config/` is site + SEO config (register the site defaults once with `defineSeoMetaConfig`; `useSeoMeta` resolves against them); `src/adapters/*` are framework entry points published as package subpaths (server adapters: `express`, `bun`, `hono`, `nestjs`; the Nest adapter uses decorators, so `experimentalDecorators` stays on) — never import them from the main barrel. `@faker-js/faker` is an optional peer loaded lazily by `core/services/faker.service.ts`. `packages/ui/` is the private `@katanakit/ui` workspace (Katana UI foundations) styled with the SCSS framework vendored in `scss/` (origin: `katanakit-css@0.12.5`); the docs consume its built `dist/` through Vite aliases.
- `src/prisma/schema.d.ts` + `schema.json` are **generated** (`bunx --bun prisma contract emit`) — edit `src/prisma/schema.prisma` instead. The Prisma CLI fails without `DATABASE_URL` (`prisma.config.ts`) and `@prisma/cli-engine` must stay a direct devDep (bun's isolated installs don't expose it from `prisma`). Prisma Next RCs are brittle: keep `@prisma/orm-postgres` aligned with the toolchain bundled by the `prisma` CLI (rc.13 works with CLI rc.19; rc.14 breaks `contract emit` with `CONTRACT.PACK_CONTRIBUTION_INVALID`).
- All relative imports inside `src/` MUST use an explicit `.js` extension (nodenext). The `@/` alias is only for `tests/` and `examples/`.
- `use*` prefix on every public method (except `getInstance()`); English only; no side effects on import; SSR guards where `window`/`document` is touched; fallible async returns a Safe Result `{ data, error, ok }` — prefer `useAttempt()` / `useTryJsonParse()` / `useErrorNormalize()` over ad-hoc `try/catch` at boundaries.
- Services are Singleton facades with destructured `use*` re-exports; `adapters/nuxt` exports pure functions (the one exception). New optional integrations go in `peerDependencies` + `peerDependenciesMeta.optional`, never `dependencies`.
- `CONTRIBUTING.md` is the full development contract — read it before architectural changes.

## Docs

- Astro Starlight in `docs/` (`bun run dev`, `bun run docs` → `docs/dist`, `bun run docs:gh` manual preview). `scripts/docs.mjs` takes an exclusive lock in `.cache/docs.lock.json` so `dev` and `docs`/`docs:gh` never run at the same time; the dev server is an Astro daemon — stop it with `bunx astro dev stop --root docs`.
- `scripts/docs-prepare.mjs` generates `docs/src/content/docs/api/` (TypeDoc via `typedoc-vitepress-theme`, then `normalizeApiPages()` rewrites it for Starlight) and `docs/src/content/docs/changelog.md` — never hand-edit these. It also writes `docs/src/data/signals.json` (version, stars, `newPages`, changelog summary and `versions` for the releases flyout), read at build time through `docs/src/signals.ts` — never hand-edit either.
- Sidebar IA: `docs/sidebar.mjs` builds 12 top-level sections, **all with `collapsed: true`** — keep top-level groups uniform: no bare links at depth 0. The service reference is split into `Core Services` / `Platform Services` / `Integrations` (one page per service under `docs/guides/services/`, sub-methods live as headings in the page); `Releases` is generated from `signals.versions` (changelog + one anchor per previous major).
- Theme extras are registered in the `components` map of `docs/astro.config.mjs`: `Head.astro` (SEO extras), `SocialIcons.astro` (GitHubStars + VersionFlyout navbar cluster), `Hero.astro` (home hero + HomeAnnouncement + HeroInstall) and `PageFrame.astro` (WhatNew panel). Every override composes the Starlight default through slots — never reimplement a default. The flyout reads `signals.versions`; `SiteVersion` was removed in favor of it.
- The custom homepage feature and section-card grids switch to one column at `640px` and below; keep both responsive together in `docs/src/styles/custom.css`.
- Head/SEO: `docs/src/seo.ts` registers `defineSeoMetaConfig` (site defaults) and `Head.astro` imports it so the docs dogfood `useSeoMeta`. Without that registration the service falls back to its demo config (`https://example.com`, phantom `/rss.xml` link) — the import order is what guarantees registration before page frontmatter runs. Starlight already owns `<title>`, canonical and the default OG/Twitter-card tags; the override only ADDS deduped extras (keywords, og:image, JSON-LD, twitter:image) — never duplicate static metas in the `head` config.
- Pages: plain content stays `.md`; any page that imports a component MUST be `.mdx` (Astro `.md` cannot import — `frontmatter.setup` is long dead; Starlight auto-registers `@astrojs/mdx`). Put component imports right after the YAML frontmatter.
- Internal links are **root-absolute with a trailing slash** (`/guides/services/worker/`) — Astro/Starlight does not resolve `.md` links file-relative the way VitePress did.
- Content-layer cache gotcha: after renaming or removing content files, `docs/node_modules/.astro/` (and `docs/.astro/`) can keep serving the stale entry (imports render as literal text). `rm -rf` both dirs and rebuild.
- Keep the build warning-free: `docs/src/content/docs/404.md` is the single 404 source (`disable404Route: true` stops Starlight injecting a colliding `/404`), `docs/src/content/i18n/en.json` keeps Starlight's i18n lookup populated, and `astro.config.mjs` filters Astro's own `use astro:head-inject` bundle noise. Watch the compact API sidebar: the full TypeDoc tree (783 pages) historically bloated `dist/`.

## Git workflow

- Branch from `dev` (conventional commits). Never PR a feature branch to `main` directly; features land in `dev` first and PRs to `main` come only from `dev`. Delete branches after merge.
- `CHANGELOG.md` holds **released versions only** — no `[Unreleased]` buffer, in the file or on the docs page. `scripts/generate-release-notes.mjs <tag> --write` writes the `[X.Y.Z] - date` section from the Conventional Commits since the previous tag: every type gets its section (Added/Fixed/Changed/Documentation/Tests/Build/CI/Styles/Chores/Reverts) and each entry lists the files it touched (`<details>` when many), so the changelog is complete on GitHub and on the docs site. `--force` rewrites an existing section; `--write` with a not-yet-created tag collects from HEAD; version refs sync to `max(release, newest tag)`, so backfilling never downgrades them.
- **No GitHub Actions**: `.github/` was deleted (commit `f974b8b91`), so the `release.yml`/`ci.yml` references in older docs are stale — do not try to trigger workflows.
- Release is local: `useGit push --release` / `useGit release create` drives it, calling the repo script when present (changelog + `package.json` + README/docs version refs are written and committed before the tag is cut). `bun run release` = `build` + changelog `--write` + `bun run publish:npm`. `bun run publish:npm` (`scripts/npm-publish.mjs`) preflights a clean tree, no unpushed commits, tag present locally+remotely, HEAD containing the tag with identical shipped paths (`src`/`scss`/`package.json`/`tsconfig.json`), CHANGELOG section, synced version refs, `dist/` newer than its sources, and an unpublished version — then runs `npm publish --access public` (EOTP web 2FA; no OIDC). Neither script creates the git tag.

## Cloudflare (only hosting/storage provider)

- **Docs:** `katanakit-docs` project → `docs.senseikatana.com`; deploy with `bun run cf:deploy` (= build + docs build + `wrangler pages deploy docs/dist --project-name katanakit-docs --branch main`). Wrangler is pinned in devDeps.
- Provision/verify projects, domains and secrets: `node scripts/setup-cloudflare.mjs [--apply] [--github-secrets]` (reads `CLOUDFLARE_ACCOUNT_ID`).
- Storage: R2 for objects; database pending (Cloudflare D1, INSForge as fallback). Local ORM is Prisma.
- `.env` gotcha: a non-empty `CLOUDFLARE_API_TOKEN` overrides the `wrangler login` OAuth session; leave it empty locally to use OAuth.
- Never add non-Cloudflare hosting/deploy providers. Documented exceptions: INSForge for the database fallback, and the manual `bun run docs:gh` preview on `gh-pages` — Cloudflare stays the production host.
- Cloudflare Account ID: `d84658746e925afe768db13e48a136a7`

## Secret Management

- Never commit real tokens or secrets. Keep `CLOUDFLARE_API_TOKEN` and other secrets empty or omitted in local `.env`; `.env.example` is the template and `.env` is gitignored.
- `.npmrc` sets `allow-scripts=` (dependency lifecycle scripts are disabled). If a new dependency needs one, allow it explicitly there.
