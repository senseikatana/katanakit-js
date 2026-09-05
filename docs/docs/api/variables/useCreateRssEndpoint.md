# Variable: useCreateRssEndpoint

> **useCreateRssEndpoint**: (`config`) => (`context`) => `Promise`&lt;`Response`&gt;

Defined in: [src/adapters/astro/rss.service.ts:273](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/adapters/astro/rss.service.ts#L273)

Creates an Astro-compatible GET endpoint handler for the RSS feed.
Use this in `src/pages/rss.xml.ts` to serve the feed.

`items` can be a static array or a function (sync/async) that returns items.
This allows using `getCollection` or any data source.

## Parameters

### config

`Omit`&lt;[`RssConfig`](../interfaces/RssConfig.md), `"items"`&gt; & `object`

## Returns

(`context`) => `Promise`&lt;`Response`&gt;

## Example

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
