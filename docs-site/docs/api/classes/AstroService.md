# Class: AstroService

Defined in: [src/adapters/astro/astro.service.ts:14](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/astro.service.ts#L14)

Astro adapter (Facade + Adapter + Singleton). Converts arbitrary collections
into the `getStaticPaths` format Astro expects, wrapped in a Safe Result.

## Implements

- [`IAstroService`](../interfaces/IAstroService.md)

## Methods

### useExtractUniqueValues()

> **useExtractUniqueValues**&lt;`T`, `V`&gt;(`items`, `keyFrom`): `V`[]

Defined in: [src/adapters/astro/astro.service.ts:125](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/astro.service.ts#L125)

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

#### Implementation of

[`IAstroService`](../interfaces/IAstroService.md).[`useExtractUniqueValues`](../interfaces/IAstroService.md#useextractuniquevalues)

***

### useFindEntry()

> **useFindEntry**&lt;`T`&gt;(`items`, `value`, `keyFrom?`): `T` \| `null`

Defined in: [src/adapters/astro/astro.service.ts:79](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/astro.service.ts#L79)

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

#### Implementation of

[`IAstroService`](../interfaces/IAstroService.md).[`useFindEntry`](../interfaces/IAstroService.md#usefindentry)

***

### useGeneratePagination()

> **useGeneratePagination**&lt;`T`, `TParam`&gt;(`items`, `pageSize?`, `param?`): [`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, [`PaginationProps`](../interfaces/PaginationProps.md)&lt;`T`&gt;&gt;[]

Defined in: [src/adapters/astro/astro.service.ts:93](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/astro.service.ts#L93)

#### Type Parameters

##### T

`T`

##### TParam

`TParam` *extends* `string` = `"page"`

#### Parameters

##### items

`T`[]

##### pageSize?

`number` = `10`

##### param?

`TParam` = `...`

#### Returns

[`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, [`PaginationProps`](../interfaces/PaginationProps.md)&lt;`T`&gt;&gt;[]

#### Implementation of

[`IAstroService`](../interfaces/IAstroService.md).[`useGeneratePagination`](../interfaces/IAstroService.md#usegeneratepagination)

***

### useGetStaticPaths()

> **useGetStaticPaths**&lt;`TData`, `TParam`, `TProps`&gt;(`getCollectionFn`, `collectionName`, `options?`): `Promise`&lt;[`AstroServiceResult`](../type-aliases/AstroServiceResult.md)&lt;[`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, `TProps`&gt;[]&gt;&gt;

Defined in: [src/adapters/astro/astro.service.ts:49](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/astro.service.ts#L49)

#### Type Parameters

##### TData

`TData` = `unknown`

##### TParam

`TParam` *extends* `string` = `"slug"`

##### TProps

`TProps` = [`CollectionEntryLike`](../interfaces/CollectionEntryLike.md)&lt;`TData`&gt;

#### Parameters

##### getCollectionFn

(`collection`) => `Promise`&lt;[`CollectionEntryLike`](../interfaces/CollectionEntryLike.md)&lt;`TData`&gt;[]&gt;

##### collectionName

`string`

##### options?

[`PathsOptions`](../interfaces/PathsOptions.md)&lt;[`CollectionEntryLike`](../interfaces/CollectionEntryLike.md)&lt;`TData`&gt;, `TParam`, `TProps`&gt; = `{}`

#### Returns

`Promise`&lt;[`AstroServiceResult`](../type-aliases/AstroServiceResult.md)&lt;[`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, `TProps`&gt;[]&gt;&gt;

#### Implementation of

[`IAstroService`](../interfaces/IAstroService.md).[`useGetStaticPaths`](../interfaces/IAstroService.md#usegetstaticpaths)

***

### usePathsFrom()

> **usePathsFrom**&lt;`T`, `TParam`, `TProps`&gt;(`items`, `options?`): [`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, `TProps`&gt;[]

Defined in: [src/adapters/astro/astro.service.ts:26](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/astro.service.ts#L26)

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

[`PathsOptions`](../interfaces/PathsOptions.md)&lt;`T`, `TParam`, `TProps`&gt; = `{}`

#### Returns

[`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, `TProps`&gt;[]

#### Implementation of

[`IAstroService`](../interfaces/IAstroService.md).[`usePathsFrom`](../interfaces/IAstroService.md#usepathsfrom)

***

### usePathsFromValues()

> **usePathsFromValues**&lt;`TParam`&gt;(`values`, `param?`): [`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, `string` \| `number`&gt;[]

Defined in: [src/adapters/astro/astro.service.ts:115](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/astro.service.ts#L115)

#### Type Parameters

##### TParam

`TParam` *extends* `string` = `"slug"`

#### Parameters

##### values

(`string` \| `number`)[]

##### param?

`TParam` = `...`

#### Returns

[`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, `string` \| `number`&gt;[]

#### Implementation of

[`IAstroService`](../interfaces/IAstroService.md).[`usePathsFromValues`](../interfaces/IAstroService.md#usepathsfromvalues)

***

### getInstance()

> `static` **getInstance**(): `AstroService`

Defined in: [src/adapters/astro/astro.service.ts:19](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/adapters/astro/astro.service.ts#L19)

#### Returns

`AstroService`
