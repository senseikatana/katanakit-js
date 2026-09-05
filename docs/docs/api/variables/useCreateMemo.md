# Variable: useCreateMemo

> **useCreateMemo**: &lt;`T`&gt;(`computation`, `signals`) => [`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;

Defined in: [src/core/services/reactive.service.ts:217](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/reactive.service.ts#L217)

## Type Parameters

### T

`T`

## Parameters

### computation

() => `T`

### signals

[`Subscribable`](../interfaces/Subscribable.md)&lt;`unknown`&gt;[]

## Returns

[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;
