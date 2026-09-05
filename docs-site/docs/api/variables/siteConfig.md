# Variable: siteConfig

> `const` **siteConfig**: [`SiteConfig`](../interfaces/SiteConfig.md)

Defined in: [src/config/site.config.ts:90](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/site.config.ts#L90)

Default site configuration. Override in your project.

## Example

```ts
// src/config/site.config.ts
import { type SiteConfig } from "katanakit";

export const siteConfig: SiteConfig = {
  site: "https://myblog.com",
  title: "My Blog",
  description: "A blog about TypeScript",
  lang: "en",
  author: "John Doe",
  ogImage: "/og-default.png",
  twitter: "johndoe",
  rss: { enabled: true, path: "/rss.xml", limit: 20 },
  seo: { noindex: false, canonical: true, openGraph: true, twitterCard: true, jsonLd: true },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "GitHub", href: "https://github.com/...", external: true },
  ],
};
```
