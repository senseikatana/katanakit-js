# Variable: useCreateStorageSignal

> **useCreateStorageSignal**: &lt;`T`&gt;(`key`, `fallbackValue`, `target`) => \[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

Defined in: [src/core/services/reactive.service.ts:219](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/reactive.service.ts#L219)

## Type Parameters

### T

`T`

## Parameters

### key

`string`

### fallbackValue

`T`

### target?

[`StorageTarget`](../type-aliases/StorageTarget.md) = `"localStorage"`

## Returns

\[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]
