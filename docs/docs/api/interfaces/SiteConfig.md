# Interface: SiteConfig

Defined in: [src/config/site.config.ts:15](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L15)

Site-wide configuration for KatanaKit-powered Astro projects.

Import this in your layouts, RSS endpoint, and SEO components
to keep everything consistent.

## Example

```ts
// astro.config.mjs
import { siteConfig } from "./src/config/site.config.js";
export default defineConfig({ site: siteConfig.site });
```

## Properties

### author

> **author**: `string`

Defined in: [src/config/site.config.ts:25](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L25)

Author name for RSS and meta tags.

***

### description

> **description**: `string`

Defined in: [src/config/site.config.ts:21](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L21)

Default meta description.

***

### lang

> **lang**: `string`

Defined in: [src/config/site.config.ts:23](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L23)

Language code (e.g. "en", "es").

***

### nav?

> `optional` **nav?**: `object`[]

Defined in: [src/config/site.config.ts:57](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L57)

Navigation links (optional, for header/footer).

#### external?

> `optional` **external?**: `boolean`

#### href

> **href**: `string`

#### label

> **label**: `string`

***

### ogImage?

> `optional` **ogImage?**: `string`

Defined in: [src/config/site.config.ts:27](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L27)

Social/OG image URL (absolute or relative to public/).

***

### rss

> **rss**: `object`

Defined in: [src/config/site.config.ts:31](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L31)

RSS feed configuration.

#### description?

> `optional` **description?**: `string`

Feed description (defaults to site description).

#### enabled

> **enabled**: `boolean`

Whether to enable the RSS feed (default: true).

#### limit

> **limit**: `number`

Number of items to include (default: 20).

#### path

> **path**: `string`

Output path (default: "/rss.xml").

#### title?

> `optional` **title?**: `string`

Feed title (defaults to site title).

***

### seo

> **seo**: `object`

Defined in: [src/config/site.config.ts:44](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L44)

Default SEO settings.

#### canonical

> **canonical**: `boolean`

Whether to add the canonical URL (default: true).

#### jsonLd

> **jsonLd**: `boolean`

Whether to add JSON-LD structured data (default: true).

#### noindex

> **noindex**: `boolean`

Whether to add noindex to all pages (default: false).

#### openGraph

> **openGraph**: `boolean`

Whether to add Open Graph tags (default: true).

#### twitterCard

> **twitterCard**: `boolean`

Whether to add Twitter Card tags (default: true).

***

### site

> **site**: `string`

Defined in: [src/config/site.config.ts:17](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L17)

Base URL of the site (no trailing slash).

***

### title

> **title**: `string`

Defined in: [src/config/site.config.ts:19](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L19)

Site title (used in `<title>`, RSS, Open Graph).

***

### twitter?

> `optional` **twitter?**: `string`

Defined in: [src/config/site.config.ts:29](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/config/site.config.ts#L29)

Twitter handle (without @).
