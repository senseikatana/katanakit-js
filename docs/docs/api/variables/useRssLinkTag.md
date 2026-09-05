# Variable: useRssLinkTag

> **useRssLinkTag**: (`config`) => `string`

Defined in: [src/adapters/astro/rss.service.ts:272](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/adapters/astro/rss.service.ts#L272)

Generates an HTML `<link>` tag for the RSS feed.
Paste this into your Astro layout's `<head>`.

## Parameters

### config

`Pick`&lt;[`RssConfig`](../interfaces/RssConfig.md), `"title"` \| `"xmlPath"`&gt;

## Returns

`string`

## Example

```ts
const { useRssLinkTag } = RssService.getInstance();
const tag = useRssLinkTag({ title: "My Blog" });
// <link rel="alternate" type="application/rss+xml" title="My Blog" href="/rss.xml" />
```
