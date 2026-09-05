# Interface: Subscribable&lt;T&gt;

Defined in: [src/types/index.ts:371](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L371)

## Extended by

- [`SignalGetter`](SignalGetter.md)

## Type Parameters

### T

`T`

## Properties

### useSubscribe

> **useSubscribe**: (`listener`) => () => `void`

Defined in: [src/types/index.ts:372](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L372)

#### Parameters

##### listener

[`SignalListener`](../type-aliases/SignalListener.md)&lt;`T`&gt;

#### Returns

() => `void`
