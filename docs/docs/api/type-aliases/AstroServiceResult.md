# Type Alias: AstroServiceResult&lt;T&gt;

> **AstroServiceResult**&lt;`T`&gt; = \{ `data`: `T`; `error`: `null`; `ok`: `true`; \} \| \{ `data`: `null`; `error`: [`AstroServiceError`](../interfaces/AstroServiceError.md); `ok`: `false`; \}

Defined in: [src/types/index.ts:537](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L537)

Safe Result (discriminated union without throwing).

## Type Parameters

### T

`T`
