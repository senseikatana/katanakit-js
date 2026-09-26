---
title: Architecture
description: Layered architecture, theming, distribution and design patterns for Katana UI.
---

# Architecture

Katana UI is designed as a separate package that consumes `katanakit-js` from the
outside. The toolkit stays a pure service library; the kit adds presentation on top
without reaching into the core.

**Today** the kit is the foundations layer only: five components (`button`,
`input`, `card`, `badge`, `alert`) in the private `packages/ui` workspace,
styled with `katanakit-css`. Everything else on this page marked "planned" is the
target design, not the current state.

## Layers

```
tokens      CSS custom properties (color, space, radius, typography, elevation)
   │
primitives  headless behavior (disclosure, focus trap, roving tabindex, positioning)
   │
bindings    framework glue (vanilla · Vue/Nuxt · Astro · React · Svelte)
   │
components  styled UI (button, input, table, modal, toast, chart)
   │
blocks      composed sections (KPI row, data-table toolbar, activity feed)
   │
layouts     page shells (app shell, auth shell, marketing shell)
   │
pages       full screens (dashboards, storefront, apps, account flows)
```

| Layer | Responsibility | Examples |
| --- | --- | --- |
| Tokens | Single source of visual truth | `--neutral-500`, `--spacing-4`, `--radius-md` (from `katanakit-css`) |
| Primitives | Behavior without markup opinions | `createDisclosure`, `createFocusTrap`, `createPopover` |
| Bindings | Lifecycle, reactivity and hydration | `vanilla`, `vue`, `astro`, `react`, `svelte` |
| Components | Accessible, themed markup | Button, Input, Table, Modal, Toast |
| Blocks | Drop-in sections composed of components | KPI stats, chart card, empty state |
| Layouts | Reusable page skeletons | App shell, auth shell, settings shell |
| Pages | Complete screens with mock contracts | CRM, e-commerce, file manager, chat |

## Theming

Theming is token-first. The kit never hardcodes a color, radius or size; it reads CSS
custom properties and lets the host application override them.

The tokens come from `katanakit-css` and are **not namespaced**: the kit consumes
the shared palette (`--neutral-*`, `--danger-*`, `--success-*`, `--warning-*`,
`--info-*`), spacing (`--spacing-1…6`), radii (`--radius-sm|md|lg|full`) and
typography tokens directly. Components are namespaced at the class level
(`.kk-btn`, `.kk-card`, `.kk-alert`, …).

```css
/* Override a token for the whole app */
:root {
  --neutral-500: oklch(62% 0.19 260);
}

/* Dark mode: the same contract the ThemeService drives */
:root[data-theme="dark"] {
  --neutral-50: oklch(18% 0.01 260);
}
```

- `ThemeService` owns the `data-theme` attribute, persistence and the system
  preference listener. The kit only consumes the attribute; the dark tokens are
  compiled into `@katanakit/ui/styles.css` via the upstream `theme("dark")` mixin.
- A theme is a plain stylesheet. Six curated themes are planned; any theme that
  defines the token contract works.
- **Tailwind CSS 4 and daisyUI are optional presets** — planned, not shipped yet.
  Neither will be a dependency of the core kit.

## Distribution

Current state of `packages/ui` (private workspace, not published to npm):

| Concern | Decision |
| --- | --- |
| Location | Workspace package `packages/ui` inside this repo. **Private** (`"private": true`, version `0.0.0`). |
| Package name | `@katanakit/ui` (provisional). |
| Entry points (today) | `.` → `dist/index.js` (the five component factories + `*Class` helpers) and `./styles.css` → `dist/styles.css`. Nothing else is exported. |
| Peer dependencies | `katanakit-css` `>=0.12.5` (optional peer; the built stylesheet embeds it, so runtime consumers need no extra CSS). |
| Build | `bun run ui:build` — `tsc6` to `dist/` + `sass` → `dist/styles.css`. |
| Styling | One self-contained stylesheet (`@katanakit/ui/styles.css`) that emits the full `katanakit-css` framework, dark tokens and the `.kk-*` classes. |
| CSS isolation | Component selectors are namespaced (`.kk-*`); they never target host markup. Palette tokens are shared with `katanakit-css` (unprefixed). |

Planned, not yet implemented: per-component subpaths, `/tokens`, framework
bindings (`/vue`, `/nuxt`, `/astro`, …) and the `/charts` entry point.

## Charts

Charts sit behind a small strategy contract so the rendering library is replaceable:

```ts
interface ChartAdapter {
  render(target: HTMLElement, config: ChartConfig): ChartHandle;
}
```

- `ApexChartAdapter` is the default implementation; `apexcharts` is an optional peer
  dependency and only loads in the `@katanakit/ui/charts` entry point.
- A lightweight SVG fallback adapter is planned for SSR and minimal bundles.
- Chart blocks consume `ChartAdapter`, never ApexCharts directly.

## Design patterns

| Pattern | Where it applies |
| --- | --- |
| Singleton | Shared kit runtime (theme bridge, chart registry) built on the existing toolkit services. |
| Facade | Each entry point exposes one facade over primitives and components. |
| Factory | Component registration, chart adapter resolution, block factories. |
| Observer | Reactive widgets subscribe to `ReactiveService` signals; lazy blocks use `ObserverService`. |
| Strategy | Chart adapters, storage-backed state, formatting strategies. |
| Decorator | Composition helpers that add behavior (validate, persist, lazy-load) around components. |

## SSR and hydration

- Primitives are no-ops on the server and activate on the client.
- `useInitTheme` already guards `window`; the kit never runs theme code during SSR.
- Charts render a sized placeholder server-side and mount on the client to avoid
  layout shift.
- No component reads `location`, `matchMedia` or storage at import time.

## Accessibility

- Semantic HTML first; ARIA only where semantics are insufficient.
- Focus trap, focus restore and roving tabindex live in primitives, not in each
  component.
- Every interactive block documents its keyboard map in the component metadata
  (see [LLM files](./llm-files.md)).
- `prefers-reduced-motion` disables non-essential animation.

## Performance

- No side effects on import; unused components are dropped by the bundler.
- Per-component entry points keep the initial bundle small.
- Blocks support lazy mounting through dynamic import plus `ObserverService`.
- Expensive data shaping (sorting, filtering, aggregation) can be offloaded to
  `WorkerService`.
