---
title: HyperUI
description: Free Tailwind CSS components, vendored and rendered live in the docs.
---

# HyperUI

[`HyperUI`](https://hyperui.dev) is a free, open-source collection of **Tailwind CSS
components** (MIT) by Mark Mead — 560+ snippets for marketing sites, admin UIs and
neobrutalist designs.

> There is **no package to install**: you copy the markup from
> [hyperui.dev](https://hyperui.dev) into a Tailwind CSS project. This page vendors a
> curated set so you can preview them here, copy the HTML, and see the light/dark
> variants side by side.

## Live previews

Each preview runs in a sandboxed iframe with Tailwind compiled **only** for these
snippets, so the utilities never leak into the KatanaKit theme.

<HyperUiShowcase
  src="/hyperui/marketing/ctas/1.html"
  dark-src="/hyperui/marketing/ctas/1-dark.html"
  label="Call to action"
  category="marketing"
/>

<HyperUiShowcase
  src="/hyperui/marketing/buttons/1.html"
  dark-src="/hyperui/marketing/buttons/1-dark.html"
  label="Buttons"
  category="marketing"
/>

<HyperUiShowcase
  src="/hyperui/application/badges/1.html"
  dark-src="/hyperui/application/badges/1-dark.html"
  label="Badges"
  category="application"
  :height="260"
/>

<HyperUiShowcase
  src="/hyperui/neobrutalism/buttons/1.html"
  dark-src="/hyperui/neobrutalism/buttons/1-dark.html"
  label="Neobrutalism buttons"
  category="neobrutalism"
  :height="260"
/>

## Using HyperUI in your project

```bash
# no install — the markup is the package
# 1. pick a component on https://hyperui.dev
# 2. copy the HTML
# 3. paste it into your project (Tailwind CSS v4 required)
```

Your project needs Tailwind CSS — HyperUI classes (`bg-gray-50`, `dark:…`) are plain
Tailwind utilities. In KatanaKit's own component kit we use `katanakit-css` instead,
so HyperUI markup is **not** drop-in for `.kk-*` pages.

## How this page works

| Piece                          | Where                                                  |
| ------------------------------ | ------------------------------------------------------ |
| Vendored snippets              | `docs/public/hyperui/**/*.html` (upstream `examples/`) |
| Tailwind build (v4, `?inline`) | `docs/.vitepress/theme/hyperui.css`                    |
| Preview component              | `HyperUiShowcase.vue` (iframe + copy bar)              |
| Regenerate a snippet           | re-download from `markmead/hyperui` `public/examples`  |

Adding a preview = drop the upstream HTML under `docs/public/hyperui/…` and add one
`<HyperUiShowcase />` — Tailwind picks up new classes through `@source`.

::: info License
HyperUI is released under the [MIT License](https://github.com/markmead/hyperui/blob/main/LICENSE).
Previews link back to the upstream source file.
:::
