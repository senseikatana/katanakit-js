# Variable: useGetStaticPaths

> **useGetStaticPaths**: &lt;`TData`, `TParam`, `TProps`&gt;(`getCollectionFn`, `collectionName`, `options`) => `Promise`&lt;[`AstroServiceResult`](../type-aliases/AstroServiceResult.md)&lt;[`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, `TProps`&gt;[]&gt;&gt;

Defined in: [src/adapters/astro/astro.service.ts:134](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/astro.service.ts#L134)

## Type Parameters

### TData

`TData` = `unknown`

### TParam

`TParam` *extends* `string` = `"slug"`

### TProps

`TProps` = [`CollectionEntryLike`](../interfaces/CollectionEntryLike.md)&lt;`TData`&gt;

## Parameters

### getCollectionFn

(`collection`) => `Promise`&lt;[`CollectionEntryLike`](../interfaces/CollectionEntryLike.md)&lt;`TData`&gt;[]&gt;

### collectionName

`string`

### options?

[`PathsOptions`](../interfaces/PathsOptions.md)&lt;[`CollectionEntryLike`](../interfaces/CollectionEntryLike.md)&lt;`TData`&gt;, `TParam`, `TProps`&gt; = `{}`

## Returns

`Promise`&lt;[`AstroServiceResult`](../type-aliases/AstroServiceResult.md)&lt;[`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, `TProps`&gt;[]&gt;&gt;
