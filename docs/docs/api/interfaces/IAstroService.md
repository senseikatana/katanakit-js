# Interface: IAstroService

Defined in: [src/types/index.ts:542](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L542)

Contract of the Astro facade.

## Methods

### useExtractUniqueValues()

> **useExtractUniqueValues**&lt;`T`, `V`&gt;(`items`, `keyFrom`): `V`[]

Defined in: [src/types/index.ts:566](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L566)

#### Type Parameters

##### T

`T`

##### V

`V`

#### Parameters

##### items

`T`[]

##### keyFrom

(`item`) => `V` \| `V`[]

#### Returns

`V`[]

***

### useFindEntry()

> **useFindEntry**&lt;`T`&gt;(`items`, `value`, `keyFrom?`): `T` \| `null`

Defined in: [src/types/index.ts:556](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L556)

#### Type Parameters

##### T

`T`

#### Parameters

##### items

`T`[]

##### value

`string`

##### keyFrom?

(`item`) => `string` \| `number`

#### Returns

`T` \| `null`

***

### useGeneratePagination()

> **useGeneratePagination**&lt;`T`, `TParam`&gt;(`items`, `pageSize?`, `param?`): [`AstroPath`](AstroPath.md)&lt;`TParam`, [`PaginationProps`](PaginationProps.md)&lt;`T`&gt;&gt;[]

Defined in: [src/types/index.ts:557](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L557)

#### Type Parameters

##### T

`T`

##### TParam

`TParam` *extends* `string` = `"page"`

#### Parameters

##### items

`T`[]

##### pageSize?

`number`

##### param?

`TParam`

#### Returns

[`AstroPath`](AstroPath.md)&lt;`TParam`, [`PaginationProps`](PaginationProps.md)&lt;`T`&gt;&gt;[]

***

### useGetStaticPaths()

> **useGetStaticPaths**&lt;`TData`, `TParam`, `TProps`&gt;(`getCollectionFn`, `collectionName`, `options?`): `Promise`&lt;[`AstroServiceResult`](../type-aliases/AstroServiceResult.md)&lt;[`AstroPath`](AstroPath.md)&lt;`TParam`, `TProps`&gt;[]&gt;&gt;

Defined in: [src/types/index.ts:547](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L547)

#### Type Parameters

##### TData

`TData` = `unknown`

##### TParam

`TParam` *extends* `string` = `"slug"`

##### TProps

`TProps` = [`CollectionEntryLike`](CollectionEntryLike.md)&lt;`TData`&gt;

#### Parameters

##### getCollectionFn

(`collection`) => `Promise`&lt;[`CollectionEntryLike`](CollectionEntryLike.md)&lt;`TData`&gt;[]&gt;

##### collectionName

`string`

##### options?

[`PathsOptions`](PathsOptions.md)&lt;[`CollectionEntryLike`](CollectionEntryLike.md)&lt;`TData`&gt;, `TParam`, `TProps`&gt;

#### Returns

`Promise`&lt;[`AstroServiceResult`](../type-aliases/AstroServiceResult.md)&lt;[`AstroPath`](AstroPath.md)&lt;`TParam`, `TProps`&gt;[]&gt;&gt;

***

### usePathsFrom()

> **usePathsFrom**&lt;`T`, `TParam`, `TProps`&gt;(`items`, `options?`): [`AstroPath`](AstroPath.md)&lt;`TParam`, `TProps`&gt;[]

Defined in: [src/types/index.ts:543](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L543)

#### Type Parameters

##### T

`T`

##### TParam

`TParam` *extends* `string` = `"slug"`

##### TProps

`TProps` = `T`

#### Parameters

##### items

`T`[]

##### options?

[`PathsOptions`](PathsOptions.md)&lt;`T`, `TParam`, `TProps`&gt;

#### Returns

[`AstroPath`](AstroPath.md)&lt;`TParam`, `TProps`&gt;[]

***

### usePathsFromValues()

> **usePathsFromValues**&lt;`TParam`&gt;(`values`, `param?`): [`AstroPath`](AstroPath.md)&lt;`TParam`, `string` \| `number`&gt;[]

Defined in: [src/types/index.ts:562](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L562)

#### Type Parameters

##### TParam

`TParam` *extends* `string` = `"slug"`

#### Parameters

##### values

(`string` \| `number`)[]

##### param?

`TParam`

#### Returns

[`AstroPath`](AstroPath.md)&lt;`TParam`, `string` \| `number`&gt;[]
