# Interface: Subscribable&lt;T&gt;

Defined in: [src/types/index.ts:371](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L371)

## Extended by

- [`SignalGetter`](SignalGetter.md)

## Type Parameters

### T

`T`

## Properties

### useSubscribe

> **useSubscribe**: (`listener`) => () => `void`

Defined in: [src/types/index.ts:372](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L372)

#### Parameters

##### listener

[`SignalListener`](../type-aliases/SignalListener.md)&lt;`T`&gt;

#### Returns

() => `void`
