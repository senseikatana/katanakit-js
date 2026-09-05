# Variable: useRssLinkTag

> **useRssLinkTag**: (`config`) => `string`

Defined in: [src/adapters/astro/rss.service.ts:272](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/adapters/astro/rss.service.ts#L272)

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
