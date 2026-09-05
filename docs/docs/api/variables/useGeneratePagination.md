# Variable: useGeneratePagination

> **useGeneratePagination**: &lt;`T`, `TParam`&gt;(`items`, `pageSize`, `param`) => [`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, [`PaginationProps`](../interfaces/PaginationProps.md)&lt;`T`&gt;&gt;[]

Defined in: [src/adapters/astro/astro.service.ts:136](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/adapters/astro/astro.service.ts#L136)

## Type Parameters

### T

`T`

### TParam

`TParam` *extends* `string` = `"page"`

## Parameters

### items

`T`[]

### pageSize?

`number` = `10`

### param?

`TParam` = `...`

## Returns

[`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, [`PaginationProps`](../interfaces/PaginationProps.md)&lt;`T`&gt;&gt;[]
