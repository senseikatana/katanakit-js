# Type Alias: FetchResult&lt;T&gt;

> **FetchResult**&lt;`T`&gt; = \{ `data`: `T`; `error`: `null`; `ok`: `true`; `status`: `number`; `url`: `string`; \} \| \{ `data`: `null`; `error`: [`ApiError`](../interfaces/ApiError.md); `ok`: `false`; `status`: `number`; `url`: `string`; \}

Defined in: [src/types/index.ts:242](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L242)

Safe result, discriminated union (Astro Actions style) without throwing.
The `ok` flag narrows the union between the success and error branches.

## Type Parameters

### T

`T` = `unknown`
