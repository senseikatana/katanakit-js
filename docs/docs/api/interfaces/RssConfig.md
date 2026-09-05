# Interface: RssConfig

Defined in: [src/types/index.ts:594](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L594)

Configuration for generating an RSS feed.

## Properties

### customData?

> `optional` **customData?**: `string`

Defined in: [src/types/index.ts:608](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L608)

Custom XML to inject into the `<channel>` element.

***

### description

> **description**: `string`

Defined in: [src/types/index.ts:598](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L598)

Description of the feed.

***

### items

> **items**: [`RssItem`](RssItem.md)[]

Defined in: [src/types/index.ts:602](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L602)

Feed items.

***

### language?

> `optional` **language?**: `string`

Defined in: [src/types/index.ts:606](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L606)

Language code (default: "en").

***

### lastBuildDate?

> `optional` **lastBuildDate?**: `boolean`

Defined in: [src/types/index.ts:612](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L612)

Whether to include the `<lastBuildDate>` (default: true).

***

### site

> **site**: `string`

Defined in: [src/types/index.ts:600](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L600)

Base URL of the site (e.g. "https://example.com").

***

### title

> **title**: `string`

Defined in: [src/types/index.ts:596](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L596)

Title of the feed (e.g. "My Blog").

***

### trailingSlash?

> `optional` **trailingSlash?**: `boolean`

Defined in: [src/types/index.ts:614](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L614)

Trailing slash behavior for item links (default: true).

***

### xmlPath?

> `optional` **xmlPath?**: `string`

Defined in: [src/types/index.ts:604](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L604)

Output path (default: "/rss.xml").

***

### xslUrl?

> `optional` **xslUrl?**: `string`

Defined in: [src/types/index.ts:610](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L610)

XSL stylesheet URL for browser rendering (optional).
