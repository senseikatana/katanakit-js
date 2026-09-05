# Type Alias: AstroServiceResult&lt;T&gt;

> **AstroServiceResult**&lt;`T`&gt; = \{ `data`: `T`; `error`: `null`; `ok`: `true`; \} \| \{ `data`: `null`; `error`: [`AstroServiceError`](../interfaces/AstroServiceError.md); `ok`: `false`; \}

Defined in: [src/types/index.ts:537](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L537)

Safe Result (discriminated union without throwing).

## Type Parameters

### T

`T`
