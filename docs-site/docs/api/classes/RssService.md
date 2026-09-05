# Class: RssService

Defined in: [src/adapters/astro/rss.service.ts:85](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/rss.service.ts#L85)

RSS service (Singleton + Facade). Generates RSS 2.0 feeds for Astro projects.
Pure implementation — no external dependencies required.

For projects using `@astrojs/rss`, use `useCreateRssEndpoint` which returns
an Astro-compatible GET handler. For lighter setups, use `useGenerateRss`
to get the raw XML string.

## Implements

- [`IRssService`](../interfaces/IRssService.md)

## Methods

### useCreateRssEndpoint()

> **useCreateRssEndpoint**(`config`): (`context`) => `Promise`&lt;`Response`&gt;

Defined in: [src/adapters/astro/rss.service.ts:184](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/rss.service.ts#L184)

Creates an Astro-compatible GET endpoint handler for the RSS feed.
Use this in `src/pages/rss.xml.ts` to serve the feed.

`items` can be a static array or a function (sync/async) that returns items.
This allows using `getCollection` or any data source.

#### Parameters

##### config

`Omit`&lt;[`RssConfig`](../interfaces/RssConfig.md), `"items"`&gt; & `object`

#### Returns

(`context`) => `Promise`&lt;`Response`&gt;

#### Example

```ts
// src/pages/rss.xml.ts
import { RssService } from "katanakit";
import { getCollection } from "astro:content";

const { useCreateRssEndpoint } = RssService.getInstance();

export const GET = useCreateRssEndpoint({
  title: "My Blog",
  description: "Posts about TypeScript",
  site: "https://example.com",
  items: async () => {
    const posts = await getCollection("blog");
    return posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      description: post.data.description,
    }));
  },
});
```

#### Implementation of

[`IRssService`](../interfaces/IRssService.md).[`useCreateRssEndpoint`](../interfaces/IRssService.md#usecreaterssendpoint)

***

### useCreateRssEndpointFromConfig()

> **useCreateRssEndpointFromConfig**(`siteConfig`, `items`): (`context`) => `Promise`&lt;`Response`&gt;

Defined in: [src/adapters/astro/rss.service.ts:254](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/rss.service.ts#L254)

Convenience method: creates an RSS endpoint from a SiteConfig.
Reads title, description, site, and rss settings from the config.

#### Parameters

##### siteConfig

[`SiteConfig`](../interfaces/SiteConfig.md)

##### items

[`RssItem`](../interfaces/RssItem.md)[] \| (() => [`RssItem`](../interfaces/RssItem.md)[] \| `Promise`&lt;[`RssItem`](../interfaces/RssItem.md)[]&gt;)

#### Returns

(`context`) => `Promise`&lt;`Response`&gt;

#### Example

```ts
// src/pages/rss.xml.ts
import { RssService } from "katanakit";
import { siteConfig } from "@/config/site.config";
import { getCollection } from "astro:content";

const { useCreateRssEndpointFromConfig } = RssService.getInstance();

export const GET = useCreateRssEndpointFromConfig(siteConfig, async () => {
  const posts = await getCollection("blog");
  return posts.map(post => ({
    title: post.data.title,
    pubDate: post.data.date,
    link: `/blog/${post.slug}/`,
    description: post.data.description,
  }));
});
```

#### Implementation of

[`IRssService`](../interfaces/IRssService.md).[`useCreateRssEndpointFromConfig`](../interfaces/IRssService.md#usecreaterssendpointfromconfig)

***

### useGenerateRss()

> **useGenerateRss**(`config`): [`RssResult`](../type-aliases/RssResult.md)

Defined in: [src/adapters/astro/rss.service.ts:113](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/rss.service.ts#L113)

Generates the RSS XML string from a config.
Returns a Safe Result (no throwing).

#### Parameters

##### config

[`RssConfig`](../interfaces/RssConfig.md)

#### Returns

[`RssResult`](../type-aliases/RssResult.md)

#### Example

```ts
const { useGenerateRss } = RssService.getInstance();
const result = useGenerateRss({
  title: "My Blog",
  description: "Posts about TypeScript",
  site: "https://example.com",
  items: [{ title: "Hello", pubDate: new Date(), link: "/blog/hello/" }],
});
if (result.ok) console.log(result.data); // XML string
```

#### Implementation of

[`IRssService`](../interfaces/IRssService.md).[`useGenerateRss`](../interfaces/IRssService.md#usegeneraterss)

***

### useRssLinkTag()

> **useRssLinkTag**(`config`): `string`

Defined in: [src/adapters/astro/rss.service.ts:148](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/rss.service.ts#L148)

Generates an HTML `<link>` tag for the RSS feed.
Paste this into your Astro layout's `<head>`.

#### Parameters

##### config

`Pick`&lt;[`RssConfig`](../interfaces/RssConfig.md), `"title"` \| `"xmlPath"`&gt;

#### Returns

`string`

#### Example

```ts
const { useRssLinkTag } = RssService.getInstance();
const tag = useRssLinkTag({ title: "My Blog" });
// <link rel="alternate" type="application/rss+xml" title="My Blog" href="/rss.xml" />
```

#### Implementation of

[`IRssService`](../interfaces/IRssService.md).[`useRssLinkTag`](../interfaces/IRssService.md#usersslinktag)

***

### getInstance()

> `static` **getInstance**(): `RssService`

Defined in: [src/adapters/astro/rss.service.ts:90](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/rss.service.ts#L90)

#### Returns

`RssService`
