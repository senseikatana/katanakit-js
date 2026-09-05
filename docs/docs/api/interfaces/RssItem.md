# Interface: RssItem

Defined in: [src/types/index.ts:574](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L574)

A single item in an RSS feed.

## Properties

### author?

> `optional` **author?**: `string`

Defined in: [src/types/index.ts:588](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L588)

Optional author name.

***

### categories?

> `optional` **categories?**: `string`[]

Defined in: [src/types/index.ts:586](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L586)

Optional categories/tags.

***

### content?

> `optional` **content?**: `string`

Defined in: [src/types/index.ts:584](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L584)

Optional full content (HTML allowed).

***

### customData?

> `optional` **customData?**: `string`

Defined in: [src/types/index.ts:590](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L590)

Optional custom data (e.g. enclosure for podcasts).

***

### description?

> `optional` **description?**: `string`

Defined in: [src/types/index.ts:582](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L582)

Optional description or excerpt.

***

### link

> **link**: `string`

Defined in: [src/types/index.ts:580](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L580)

URL of the item (relative to site, e.g. "/blog/my-post/").

***

### pubDate

> **pubDate**: `string` \| `Date`

Defined in: [src/types/index.ts:578](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L578)

Publication date (Date object or ISO string).

***

### title

> **title**: `string`

Defined in: [src/types/index.ts:576](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L576)

Title of the item.
