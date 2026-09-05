# Variable: useRssLinkTag

> **useRssLinkTag**: (`config`) => `string`

Defined in: [src/adapters/astro/rss.service.ts:272](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/rss.service.ts#L272)

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
