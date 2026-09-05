# Function: useGenerateMetaTags()

> **useGenerateMetaTags**(`config`, `meta`): `string`

Defined in: [src/config/seo.service.ts:58](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L58)

Generates all `<head>` meta tags for SEO, Open Graph, Twitter Card,
canonical URL, and JSON-LD structured data.

## Parameters

### config

[`SiteConfig`](../interfaces/SiteConfig.md)

Site-wide configuration.

### meta

[`SeoMeta`](../interfaces/SeoMeta.md)

Page-specific meta.

## Returns

`string`

HTML string of meta tags to inject in `<head>`.

## Example

```astro
---
import { siteConfig } from "@/config/site.config";
import { useGenerateMetaTags } from "@/config/seo.service";

const metaTags = useGenerateMetaTags(siteConfig, {
  title: "My Blog Post",
  description: "A great post about TypeScript",
  url: "https://example.com/blog/my-post/",
  ogType: "article",
  publishedTime: "2024-01-15T00:00:00Z",
});
---
<head>
  <Fragment set:html={metaTags} />
</head>
```
