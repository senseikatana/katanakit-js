# Type Alias: AstroServiceResult&lt;T&gt;

> **AstroServiceResult**&lt;`T`&gt; = \{ `data`: `T`; `error`: `null`; `ok`: `true`; \} \| \{ `data`: `null`; `error`: [`AstroServiceError`](../interfaces/AstroServiceError.md); `ok`: `false`; \}

Defined in: [src/types/index.ts:537](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L537)

Safe Result (discriminated union without throwing).

## Type Parameters

### T

`T`
