# Type Alias: AstroServiceResult&lt;T&gt;

> **AstroServiceResult**&lt;`T`&gt; = \{ `data`: `T`; `error`: `null`; `ok`: `true`; \} \| \{ `data`: `null`; `error`: [`AstroServiceError`](../interfaces/AstroServiceError.md); `ok`: `false`; \}

Defined in: [src/types/index.ts:537](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L537)

Safe Result (discriminated union without throwing).

## Type Parameters

### T

`T`
