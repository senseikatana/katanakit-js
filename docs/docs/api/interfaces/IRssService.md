# Interface: IRssService

Defined in: [src/types/index.ts:623](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L623)

Contract of the RSS facade.

## Methods

### useCreateRssEndpoint()

> **useCreateRssEndpoint**(`config`): (`context`) => `Promise`&lt;`Response`&gt;

Defined in: [src/types/index.ts:629](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L629)

Generates an Astro GET endpoint handler for the RSS feed.

#### Parameters

##### config

`Omit`&lt;[`RssConfig`](RssConfig.md), `"items"`&gt; & `object`

#### Returns

(`context`) => `Promise`&lt;`Response`&gt;

***

### useCreateRssEndpointFromConfig()

> **useCreateRssEndpointFromConfig**(`siteConfig`, `items`): (`context`) => `Promise`&lt;`Response`&gt;

Defined in: [src/types/index.ts:633](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L633)

Convenience: creates an RSS endpoint from a SiteConfig.

#### Parameters

##### siteConfig

[`SiteConfig`](SiteConfig.md)

##### items

[`RssItem`](RssItem.md)[] \| (() => [`RssItem`](RssItem.md)[] \| `Promise`&lt;[`RssItem`](RssItem.md)[]&gt;)

#### Returns

(`context`) => `Promise`&lt;`Response`&gt;

***

### useGenerateRss()

> **useGenerateRss**(`config`): [`RssResult`](../type-aliases/RssResult.md)

Defined in: [src/types/index.ts:625](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L625)

Generates the RSS XML string from a config.

#### Parameters

##### config

[`RssConfig`](RssConfig.md)

#### Returns

[`RssResult`](../type-aliases/RssResult.md)

***

### useRssLinkTag()

> **useRssLinkTag**(`config`): `string`

Defined in: [src/types/index.ts:627](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L627)

Generates an HTML `<link>` tag for the RSS feed.

#### Parameters

##### config

`Pick`&lt;[`RssConfig`](RssConfig.md), `"title"` \| `"xmlPath"`&gt;

#### Returns

`string`
