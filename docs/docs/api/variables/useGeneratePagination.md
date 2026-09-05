# Variable: useGeneratePagination

> **useGeneratePagination**: &lt;`T`, `TParam`&gt;(`items`, `pageSize`, `param`) => [`AstroPath`](../interfaces/AstroPath.md)&lt;`TParam`, [`PaginationProps`](../interfaces/PaginationProps.md)&lt;`T`&gt;&gt;[]

Defined in: [src/adapters/astro/astro.service.ts:136](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/adapters/astro/astro.service.ts#L136)

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
