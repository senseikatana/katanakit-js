# Variable: useCreateMemo

> **useCreateMemo**: &lt;`T`&gt;(`computation`, `signals`) => [`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;

Defined in: [src/core/services/reactive.service.ts:217](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/reactive.service.ts#L217)

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
