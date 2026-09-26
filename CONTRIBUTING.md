# Contributing to KatanaKit

Thank you for considering contributing to `katanakit-js`! This document
describes the architecture, the conventions and the development workflow so you
can jump in quickly. It is the source of truth for how code lands in this
repository.

## The development contract

These rules keep the codebase consistent and maintainable. Please read
[Architecture](https://docs.senseikatana.com/guides/architecture) for the full context behind each rule.

1. **Hexagonal layering** — keep the pure `core` layer (`src/core/services/`)
   free of browser/runtime I/O. Adapters that own I/O live in
   `src/infrastructure/` (DOM, storage, viewport, sensors, observer, worker,
   theme). Framework-facing adapters live in `src/adapters/` (`astro/`,
   `express/`, `nuxt/`), site config/SEO in `src/config/`. Put new capabilities
   in the layer that matches their responsibility.
2. **Design patterns** — services are Singleton facades and use
   Strategy/Observer/Factory/Facade/Adapter where it makes sense. Preserve the
   pattern when extending a service. `adapters/nuxt` is the one deliberate
   exception: it exports pure functions, not a singleton.
3. **`use*` convention** — every public method (except `getInstance()`) uses the
   `use` prefix (like React hooks), e.g. `useInit`, `useFetch`, `useLogger`,
   `useCreateSignal`. This makes the API consistent and predictable.
4. **Pure ESM with `.js` extensions** — the package is `"type": "module"` and
   compiles with `module: nodenext`. All relative imports **must** use an
   explicit `.js` extension (e.g. `import { useLogger } from
"./logger.service.js"`). Do not import without the extension and do not add
   new `@/`-aliased imports inside `src/`; the `@/` alias exists for the test
   suite and examples only.
5. **Destructured exports** — services expose their methods as arrow-function
   class fields and re-export them destructured at the bottom of the module
   (`export const { useLogger, ... } = LoggerService.getInstance();`) so consumers
   can tree-shake and call them without binding `this`. For modules whose
   consumers are expected to hold an instance (`ObserverService`,
   `SensorsUtils`, `WorkerService`), exporting the singleton instance or a
   stable `getInstance()` is acceptable — document the choice.
6. **Single source of truth for types** — every contract and shared domain type
   lives in `src/types/index.ts`. Services reference these interfaces (`I*`,
   `LogStrategy`, `StorageStrategy`, ...) instead of re-declaring shapes.
7. **Framework adapters as subpaths** — anything that imports a framework
   (`express`, `h3`/Nuxt, `vue`/`astro`) must not be re-exported from the main
   barrel `src/index.ts`. Expose it through the `exports` map in
   `package.json` (`katanakit-js/adapters/express`, `katanakit-js/adapters/nuxt`)
   so library consumers never pull those dependencies.
8. **Optional peer dependencies** — keep heavy/framework dependencies out of
   `dependencies`. Only add a runtime dependency when every consumer needs it.
   New optional integrations go to `peerDependencies` +
   `peerDependenciesMeta.optional` and are installed by developers/devDeps here.
9. **English only** — comments, identifiers, error messages and documentation
   are written in English.
10. **No side effects on import** — importing any public module must never
    trigger network calls, timers, storage writes or DOM mutations. Strategy
    objects and I/O are created lazily inside methods.
11. **SSR safety** — browser-only adapters must guard or fall back gracefully
    when `window`/`document`/`navigator` is unavailable (Node/Bun SSR).
12. **Safe Result for fallible async operations** — prefer returning a
    discriminated union `{ data, error, ok }` over throwing.
13. **Tests** — add or update a Vitest test under `tests/` for every new feature
    or bug fix, and keep the `@/` alias imports there.

## Getting started

```bash
# Prerequisites: Node.js >= 22.18, Bun >= 1.2
git clone https://github.com/senseikatana/katanakit-js.git
cd katanakit-js
git checkout dev
bun install
```

Useful scripts:

| Command                 | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `bun run check`         | ESLint + typecheck + tests (gate before build/publish) |
| `bun run fix`           | Same as `check` with ESLint auto-fix                   |
| `bun run build`         | `check` then compile to `dist/`                        |
| `bun run release`       | `build` → version bump → publish to npm                |
| `bun run release:minor` | Same for minor release                                 |
| `bun run release:major` | Same for major release                                 |
| `bun run docs:dev`      | Docs site dev server (VitePress)                       |
| `bun run docs:build`    | Builds the docs site into `docs/.vitepress/dist/`      |
| `bun run ui:build`      | Builds `@katanakit/ui` (components + katanakit-css CSS) |
| `bun run dev`           | Express example server                                 |

`build` and `release` never compile or publish unless `check` passes.

## Directory layout

- `src/types/` — single source of truth for all contracts and domain types.
- `src/core/services/` — pure domain services (no I/O).
- `src/infrastructure/` — adapters that own browser/runtime I/O.
- `src/adapters/` — framework adapters (`astro/`, `express/`, `vue/`, `nuxt/`).
- `src/adapters/notion/` — Notion REST API adapter.
- `src/adapters/wordpress/` — WordPress REST API adapter.
- `src/config/` — `site.config.ts` + `seo.service.ts`.
- `src/prisma/` — Prisma schema and conversation store.
- `src/index.ts` — main barrel (public API surface).
- `tests/` — Vitest unit tests (import from `src/` via the `@/` alias).
- `examples/` — runnable demos for all adapters and frameworks.
- `docs/` — VitePress documentation site (keep in sync with code changes).
- `packages/ui/` — private `@katanakit/ui` workspace: Katana UI foundations (button, input, card, badge, alert) styled with `katanakit-css`.

## Updating documentation

The public documentation site lives at
**[docs.senseikatana.com](https://docs.senseikatana.com/)** and
is built with VitePress. The source is in `docs/`.

When you change a public API:

- **API Reference is auto-generated** from JSDoc/TSDoc comments in `src/` by
  TypeDoc (`bun run docs:prepare` writes `docs/api/` and the VitePress sidebar).
  Write good doc comments on your exported functions and types — they become
  the public API docs automatically.
- Update the matching entry in the README Features list and the docs page that
  covers the API (`docs/guides/*.md`).
- Note user-visible changes in `CHANGELOG.md` under `[Unreleased]` **in the same
  commit** as the change. `scripts/bump-version.mjs` promotes the section to
  `[X.Y.Z] - date` on release and refuses to release an empty section.
- Always use `katanakit-js` in example imports.

### Writing docs pages

Every page starts with YAML frontmatter so both VitePress and Obsidian read it:

```md
---
title: Query Client
description: Cache, retry and invalidate server state.
---
```

- JS/TS inside a page goes in a `<script setup lang="ts">` block after the
  frontmatter (Vue-in-Markdown). VitePress does **not** support MDX.
- Use `::: code-group` for tabbed code samples and `::: warning` for callouts.
- `docs/api/` and `docs/changelog.md` are generated — never hand-edit them.

### Running the docs locally

```bash
bun run docs:dev       # generate API + changelog, then live-reloading server
bun run docs:build     # static build into docs/.vitepress/dist/
bun run docs:preview   # preview the last build
bun run docs:gh        # manual preview on the gh-pages branch (no Actions)
bun run docs:clean     # purge .vitepress/.temp and cache
```

::: warning Never run docs:dev and docs:build/docs:gh at the same time
VitePress shares `docs/.vitepress/.temp` between the dev server and the build,
so running both corrupts it and the build fails with
`Cannot find module '…/.vitepress/.temp/…'`. `scripts/docs.mjs` enforces an
exclusive lock and fails fast with that guidance; if a process was killed,
`bun run docs:clean` resets the temp state.
:::

## Versioning and changelog

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
and keeps a [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)-style
`CHANGELOG.md`. The current version is tracked in `package.json`.

### Releasing (CI, preferred)

Releases run through GitHub Actions (`.github/workflows/release.yml`,
`workflow_dispatch` → pick `patch`/`minor`/`major`). The workflow bumps
`package.json`, publishes to npm with provenance via **OIDC trusted publishing**
(no `NPM_TOKEN` secret) and creates the GitHub release + annotated tag.

One-time setup (already configured for this repo): npmjs.com → Package Settings →
Publishing access → Trusted publishing → repo `senseikatana/katanakit-js`,
workflow `release.yml`, environment (none).

### Releasing (local fallback)

```bash
bun run release        # build (check + compile) + bump patch + publish
bun run release:minor  # same for minor
bun run release:major  # same for major
```

These publish from your machine with your npm credentials. Prefer the CI path.

### Version synchronization

Versions must be synchronized across:

1. `package.json` — the source of truth
2. npm registry — published via `npm publish`
3. GitHub tags — created by the release script

To verify synchronization:

```bash
grep '"version"' package.json   # check local
npm view katanakit-js version   # check npm
git tag --sort=-creatordate     # check tags
```

## Pull request checklist

- [ ] Code follows the development contract above.
- [ ] All new public methods use the `use*` prefix (except `getInstance`).
- [ ] Relative imports inside `src/` carry explicit `.js` extensions.
- [ ] New contracts/types were added to `src/types/` (not re-declared).
- [ ] New framework code is reachable via a subpath, not the main barrel.
- [ ] `bun run check` passes (ESLint + typecheck + tests).
- [ ] Tests added/updated for the change.
- [ ] Documentation and `CHANGELOG.md` updated if the public API changed.
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- [ ] Feature merged into `dev` first (`git checkout dev && git merge <branch>`); PRs to `main` come only from `dev`.

## Code of Conduct

Be kind, respectful, and constructive. We're all here to build great software
and learn from each other. Harassment, discrimination, or toxic behavior will
not be tolerated.

## Questions?

- [Open an issue](https://github.com/senseikatana/katanakit-js/issues) for bugs
- [Start a discussion](https://github.com/senseikatana/katanakit-js/discussions) for questions
- [Read the docs](https://docs.senseikatana.com/) for guides and API reference
