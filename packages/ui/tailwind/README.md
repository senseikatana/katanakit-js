# Tailwind components

Copy-paste UI snippets for Tailwind CSS 4, kept next to the UI kit but **outside
`src/`**: nothing here is compiled, typed or published with `@katanakit/ui`.

| Tree | Use with |
| --- | --- |
| `html/` | Vue, Astro, plain HTML and any templating language |
| `react/` | React 18/19 + TypeScript (`.tsx`) |

The tree follows **Feature-Based Architecture**: top-level folders are product
capabilities (`auth/`, `dashboard/`, `workspace/`, `settings/`, `products/`,
`cart/`, `checkout/`, `orders/`, `storefront/`, `marketing/`) plus a `shared/`
layer for cross-feature primitives, forms, feedback, navigation, data display,
layout and application shells. Both trees share the same relative paths and
kebab-case file names, so a component maps one-to-one between them.

## Tailwind 4 notes

- The snippets were written against Tailwind 2/3 and migrated with the official
  upgrade codemod plus a supplemental pass (opacity modifiers, the v2
  aspect-ratio plugin, legacy palettes).
- Keep the v3 default border color with the compatibility layer documented in
  `docs/ui-kit/tailwind-components/index.md`.
- `prose` content needs `@plugin "@tailwindcss/typography";`.
- Interactive React components import `@headlessui/react` 1.x
  (`Menu.Button`, `Transition.Child`) and Heroicons 1.x (`/solid`, `/outline`).

## Docs

Live previews and the generated catalog live in
`docs/ui-kit/tailwind-components/`. The docs build copies `html/` to
`docs/public/tailwind-components/` so the showcase can fetch each snippet over
HTTP:

```bash
node scripts/sync-tailwind-components.mjs
```

The script also verifies that both trees stay one-to-one and rewrites the
catalog page; `scripts/docs.mjs` runs it before every build.
