# Interface: SignalGetter()&lt;T&gt;

Defined in: [src/types/index.ts:375](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L375)

## Extends

- [`Subscribable`](Subscribable.md)&lt;`T`&gt;

## Type Parameters

### T

`T`

> **SignalGetter**(): `T`

Defined in: [src/types/index.ts:376](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L376)

## Returns

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

#### Inherited from

[`Subscribable`](Subscribable.md).[`useSubscribe`](Subscribable.md#usesubscribe)
