---
title: SEO
description: "Generate HTML head and Open Graph tags from a single flat config."
---

# SEO

One flat object: site fields + **HTML meta** + **Facebook Open Graph**.
No Twitter / Apple / MS tags. Optional `Omit` for keys you never pass:

```ts
import { useSeoMeta, type UseSeoMetaOptions } from "katanakit-js";

const seo = useSeoMeta({
  site: "https://myblog.com",
  siteTitle: "My Blog",
  title: "My Post",
  description: "A great post",
  ogTitle: "My Post",
  ogDescription: "A great post",
  ogImage: "https://myblog.com/og.png",
  ogType: "article",
  canonical: "https://myblog.com/posts/my-post/",
} satisfies UseSeoMetaOptions);

// Narrow further if you want:
useSeoMeta({ title: "Home" } as UseSeoMetaOptions<"rss" | "nav">);
```

`title` = page title · `siteTitle` = brand.

::: warning `SiteConfig` is fail-fast: `seo` and `rss` are required

`UseSeoMetaOptions` accepts partial `seo`/`rss` because the `defaults`
fill the gaps — but a full `SiteConfig` (your config or the `defaults`
you pass to `useSeoMeta`) must include `seo` and `rss`. `nav` stays
optional. When they are missing, `useSeoTag`, `useGenerateMetaTags`,
`useHeadTags`, `useRssHeadLink` and the `useSeoMeta` defaults throw
`[Seo] SiteConfig.seo is required (caller)` /
`[Seo] SiteConfig.rss is required (caller)` instead of a cryptic
`TypeError`.

:::

```ts
import { siteConfig, type SiteConfig } from "katanakit-js";

// Minimal valid config: spread the defaults so seo + rss travel along.
// nav can be omitted.
const config: SiteConfig = { ...siteConfig, site: "https://myblog.com", title: "My Blog" };

// Throws [Seo] SiteConfig.seo is required (useSeoTag):
useSeoTag({ ...config, seo: undefined as unknown as SiteConfig["seo"] }, { title: "Post" });
```

---
