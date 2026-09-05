# Variable: useCreateRssEndpointFromConfig

> **useCreateRssEndpointFromConfig**: (`siteConfig`, `items`) => (`context`) => `Promise`&lt;`Response`&gt;

Defined in: [src/adapters/astro/rss.service.ts:274](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/adapters/astro/rss.service.ts#L274)

Convenience method: creates an RSS endpoint from a SiteConfig.
Reads title, description, site, and rss settings from the config.

## Parameters

### siteConfig

[`SiteConfig`](../interfaces/SiteConfig.md)

### items

[`RssItem`](../interfaces/RssItem.md)[] \| (() => [`RssItem`](../interfaces/RssItem.md)[] \| `Promise`&lt;[`RssItem`](../interfaces/RssItem.md)[]&gt;)

## Returns

(`context`) => `Promise`&lt;`Response`&gt;

## Example

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
