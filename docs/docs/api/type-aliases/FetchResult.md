# Type Alias: FetchResult&lt;T&gt;

> **FetchResult**&lt;`T`&gt; = \{ `data`: `T`; `error`: `null`; `ok`: `true`; `status`: `number`; `url`: `string`; \} \| \{ `data`: `null`; `error`: [`ApiError`](../interfaces/ApiError.md); `ok`: `false`; `status`: `number`; `url`: `string`; \}

Defined in: [src/types/index.ts:242](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L242)

Safe result, discriminated union (Astro Actions style) without throwing.
The `ok` flag narrows the union between the success and error branches.

## Type Parameters

### T

`T` = `unknown`
