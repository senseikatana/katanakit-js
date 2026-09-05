# Function: useHeadTags()

> **useHeadTags**(`config`, `meta`): `string`

Defined in: [src/config/seo.service.ts:185](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/config/seo.service.ts#L185)

Generates all default `<head>` meta tags for a page (title, description,
canonical, OG, Twitter, JSON-LD, RSS link).

Convenience wrapper around `useGenerateMetaTags` + `useRssHeadLink`.

## Parameters

### config

[`SiteConfig`](../interfaces/SiteConfig.md)

### meta

[`SeoMeta`](../interfaces/SeoMeta.md)

## Returns

`string`
