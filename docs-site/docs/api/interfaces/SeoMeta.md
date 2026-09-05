# Interface: SeoMeta

Defined in: [src/config/seo.service.ts:6](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L6)

SEO meta tag configuration for a single page.

## Properties

### author?

> `optional` **author?**: `string`

Defined in: [src/config/seo.service.ts:24](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L24)

Article author (for og:type=article).

***

### canonical?

> `optional` **canonical?**: `string`

Defined in: [src/config/seo.service.ts:12](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L12)

Canonical URL (absolute). If omitted, derived from `url`.

***

### description?

> `optional` **description?**: `string`

Defined in: [src/config/seo.service.ts:10](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L10)

Page description (falls back to site description).

***

### modifiedTime?

> `optional` **modifiedTime?**: `string`

Defined in: [src/config/seo.service.ts:22](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L22)

Article modified date (ISO string, for og:type=article).

***

### noindex?

> `optional` **noindex?**: `boolean`

Defined in: [src/config/seo.service.ts:28](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L28)

Whether to add noindex (default: false).

***

### ogImage?

> `optional` **ogImage?**: `string`

Defined in: [src/config/seo.service.ts:16](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L16)

OG image URL (absolute). Falls back to site config.

***

### ogType?

> `optional` **ogType?**: `"article"` \| `"website"` \| `"profile"`

Defined in: [src/config/seo.service.ts:18](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L18)

Content type: "website" | "article" | "profile" (default: "website").

***

### publishedTime?

> `optional` **publishedTime?**: `string`

Defined in: [src/config/seo.service.ts:20](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L20)

Article published date (ISO string, for og:type=article).

***

### tags?

> `optional` **tags?**: `string`[]

Defined in: [src/config/seo.service.ts:26](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L26)

Article tags (for og:type=article).

***

### title

> **title**: `string`

Defined in: [src/config/seo.service.ts:8](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L8)

Page title (will be suffixed with site title).

***

### url?

> `optional` **url?**: `string`

Defined in: [src/config/seo.service.ts:14](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/config/seo.service.ts#L14)

Page URL (absolute, e.g. "https://example.com/blog/post/").
