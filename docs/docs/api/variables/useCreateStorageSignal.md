# Variable: useCreateStorageSignal

> **useCreateStorageSignal**: &lt;`T`&gt;(`key`, `fallbackValue`, `target`) => \[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

Defined in: [src/core/services/reactive.service.ts:219](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/reactive.service.ts#L219)

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
