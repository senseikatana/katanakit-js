# Variable: useGenerateRss

> **useGenerateRss**: (`config`) => [`RssResult`](../type-aliases/RssResult.md)

Defined in: [src/adapters/astro/rss.service.ts:271](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/adapters/astro/rss.service.ts#L271)

Generates the RSS XML string from a config.
Returns a Safe Result (no throwing).

## Parameters

### config

[`RssConfig`](../interfaces/RssConfig.md)

## Returns

[`RssResult`](../type-aliases/RssResult.md)

## Example

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
