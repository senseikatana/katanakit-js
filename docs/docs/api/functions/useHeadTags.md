# Function: useHeadTags()

> **useHeadTags**(`config`, `meta`): `string`

Defined in: [src/config/seo.service.ts:185](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/config/seo.service.ts#L185)

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
