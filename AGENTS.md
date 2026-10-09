# AGENTS.md — katanakit-js

TypeScript service toolkit using ESM and hexagonal architecture. Bun is the package manager and script runner; Node.js >= 22.18 is required. Read `CONTRIBUTING.md` before architectural changes; it is the detailed development contract.

## Working rules

- Keep changes focused. For public features or API changes, update `README.md` and the relevant docs pages with the code.
- Write code, identifiers, comments, errors, and documentation in English.
- Never commit real tokens or secrets. Use `.env.example` as the template; `.env` is gitignored. Leave `CLOUDFLARE_API_TOKEN` empty locally when using Wrangler's OAuth login.
- `.npmrc` disables dependency lifecycle scripts with `allow-scripts=`. Allow a script explicitly only when a new dependency requires it.

## Architecture and API

- `src/core/services/` contains domain logic and should remain free of runtime I/O. `src/infrastructure/` owns runtime I/O; `src/adapters/` contains framework and platform integrations; `src/config/` contains site and SEO configuration.
- Keep shared contracts in `src/types/index.ts` and validation schemas in `src/schemas/`. Prefer deriving types from schemas where practical; do not duplicate existing shapes.
- Framework integrations must remain out of the main `src/index.ts` barrel. Expose and import them through their package subpaths declared in `package.json`.
- Public methods use the `use*` prefix except `getInstance()`. Services are generally Singleton facades with destructured `use*` exports; `adapters/nuxt` is an intentional pure-function exception.
- Keep imports side-effect-free. Guard browser APIs (`window`, `document`, `navigator`) so browser-dependent code remains safe in Node/Bun and SSR.
- For fallible async operations, use the Safe Result shape `{ data, error, ok }`; prefer existing helpers such as `useAttempt()`, `useTryJsonParse()`, and `useErrorNormalize()` at boundaries.
- Optional integrations belong in `peerDependencies` with `peerDependenciesMeta.optional`, not in `dependencies`.
- Use explicit `.js` extensions for relative imports in `src/` (NodeNext ESM). The `@/` alias is for tests and examples, not source imports.
- `src/prisma/schema.d.ts` and `src/prisma/schema.json` are generated. Edit `src/prisma/schema.prisma` and regenerate with `bunx --bun prisma contract emit`; Prisma config requires `DATABASE_URL`.

## Commands and verification

- `bun run check` is the project gate: ESLint, root and UI typechecks, then Vitest. Run it for code changes.
- `bun run fix` applies ESLint fixes and runs typechecks/tests, but skips the UI typecheck; use `check` for the full gate.
- Run one test file with `bunx vitest run <path>`. Tests live under `tests/` and `packages/**/tests/`; Vitest maps `@/` to `src`.
- `bun run build` runs `check`, compiles `dist/`, builds the UI, synchronizes version references, and checks examples. The version-sync step can modify `package.json` and README/docs references; review those changes rather than discarding them blindly.
- Run `bun run examples:check` after a build when changing examples or package exports.
- ESLint uses flat config in `eslint.config.mjs`; do not add `.eslintrc` files. Prettier runs through ESLint.
- `bun run dev` starts the VitePress docs site. `bun run server:dev` runs the Express server and `bun run bun:dev` runs the Bun server.

## Documentation

- The docs site uses VitePress. Pages use YAML frontmatter and Vue-in-Markdown (`<script setup>`), not MDX.
- Docs follow Diátaxis: tutorials in `docs/tutorials/`, how-to guides in `docs/guides/`, reference generated in `docs/api/` plus the UI kit `reference/` pages, explanation in `docs/explanation/`. One page, one kind — do not mix them in a single page.
- The "why" behind hard-to-reverse decisions lives in `docs/explanation/decisions/` (context, decision, consequences). Add a numbered record there instead of burying rationale in prose; superseded records are never rewritten.
- `scripts/docs-prepare.mjs` generates `docs/api/`, `docs/changelog.md`, and `docs/.vitepress/theme/signals.json`; do not edit these generated files by hand.
- `scripts/docs.mjs` manages shared VitePress temporary state. Do not run `bun run dev` concurrently with `bun run docs` or `bun run docs:gh`.
- Production docs deploy to Cloudflare Pages. Keep Cloudflare as the hosting/storage provider; INSForge is the database fallback and Prisma is the local ORM.

## Git and releases

- Use Conventional Commits. Features land in `dev` first; PRs to `main` come from `dev`.
- There is no GitHub Actions pipeline. Releases are performed locally.
- `CHANGELOG.md` contains released versions only—do not add an `[Unreleased]` section or hand-edit release entries. `scripts/generate-release-notes.mjs` generates release notes from commit subjects when a release is prepared.
- `bun run build` runs the version synchronization step; review any resulting changes to version references.
