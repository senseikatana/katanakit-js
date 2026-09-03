# Roadmap

A living list of what is planned for KatanaKit. Contributions are welcome —
pick something and open a pull request.

## Now (v2.x)

- [x] Hexagonal reorganization (`core`, `infrastructure`, `adapters`, `types`).
- [x] Fix all TypeScript errors and remove import-time side effects.
- [x] Barrel exports + `@/` path alias.
- [x] Vitest suite for the core services.
- [x] English documentation (`README`, `CONTRIBUTING`, `docs/`, `SECURITY`).

## Next

- [ ] Publish to npm (scoped or unscoped, once the name is finalized).
- [ ] Add a website / docs site for the project.
- [ ] Framework adapters: React hooks (`useApi`, `useSignal`) and Svelte stores.
- [ ] HTTP client: request interceptors, retry with backoff, request cancellation
      (`AbortSignal`) and a caching layer (stale-while-revalidate).
- [ ] Reactive: automatic dependency tracking for `CREATE_EFFECT`/`CREATE_MEMO`.
- [ ] Worker: fix the `RUN_POOL` concurrency by correlating tasks by id.
- [ ] Add a logger strategy for structured/JSON output.

## Later

- [ ] Deno/Cloudflare Workers compatibility pass.
- [ ] More geometry (3D solids) and unit-system conversions.
- [ ] i18n for the date formatter (`DatesService.DIFF`).
- [ ] E2E tests for the Express adapter.
