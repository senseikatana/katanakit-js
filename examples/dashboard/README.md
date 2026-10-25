# Dashboard example

A complete admin dashboard built **only** with the documented katanakit-js
pieces: the `@katanakit/ui` component factories and the KatanaKit CSS
framework. No framework runtime, no bundler, no build step for this example —
plain `<script type="module">` importing the compiled package.

The page structure takes its cues from the common admin-template groups
(products, users, orders, settings…) but every line of markup, copy and mock
data here is written for this repository. No third-party template code or
assets are vendored.

## What it demonstrates

| Section | katanakit-js pieces |
| --- | --- |
| Overview stat cards | `useCard()`, `useBadge()`, badge variants |
| Overview alert | `useAlert()` with `dismissible` + `onDismiss` |
| Overview tabs (Revenue / Customers / Activity) | `useTabs()` with node content |
| Buttons | `useButton()` — 4 variants, 3 sizes, `loading`, `disabled` |
| Badges | `useBadge()` — neutral, info, success, warning, danger |
| Alerts | `useAlert()` — all variants, `role="alert"` for danger |
| Forms | `useInput()` (help/error/required/disabled), `useSelect()` |
| Tabs | `useTabs()` with a disabled tab, roving tabindex |
| Cards | `useCard()` — default and `elevated`, footer slot |
| Modal | `modal.open()` — simple, small, and a form dialog with focus traps |
| Toasts | `toast.info/success/warning/error/loading`, `handle.update()` |
| Orders table | `useInput()` search filter, badges, row actions in a modal |
| Utilities | spacing, colours, typography, grid and effects classes |
| Settings | `data-theme="dark"` toggle, destructive flow in a modal |

Docs: [components](https://docs.senseikatana.com/ui-kit/components/button) ·
[CSS framework](https://docs.senseikatana.com/ui-kit/css/) ·
[Tailwind & presets](https://docs.senseikatana.com/ui-kit/css/integrations/tailwind).

## Run it

From the repository root:

```bash
bun install
bun run build:ui   # compiles @katanakit/ui (ESM + base/components CSS)
bunx serve .       # or: python3 -m http.server 8080
```

Open `http://localhost:3000/examples/dashboard/` (or `:8080` with Python).
`bun run build` also works and additionally produces the published
`dist/styles.css`.

The example links `packages/ui/dist/styles.css` and imports
`packages/ui/dist/index.js`, so it always reflects the workspace source
instead of a published copy.

## Notes

- The only CSS written for this example is `dashboard.css` — the shell
  (sidebar, sticky top bar, table chrome). Components, tokens and utilities
  come from the kit.
- Dark mode is the kit's `:root[data-theme="dark"]` token override; the toggle
  writes the attribute, nothing recompiles.
- To compose the same CSS with a Tailwind 4 pipeline (optionally FlyonUI or
  daisyUI), follow
  [Tailwind & presets](https://docs.senseikatana.com/ui-kit/css/integrations/tailwind).
- `@katanakit/ui` is not published yet (roadmap phase 5); the example imports
  the workspace build on purpose.
