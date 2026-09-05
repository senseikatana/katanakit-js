# Class: NativeUuidStrategy

Defined in: [src/core/services/generator.service.ts:28](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/generator.service.ts#L28)

Native UUID strategy using `globalThis.crypto.randomUUID`, with a fallback.

## Implements

- [`IUuidStrategy`](../interfaces/IUuidStrategy.md)

## Constructors

### Constructor

> **new NativeUuidStrategy**(): `NativeUuidStrategy`

#### Returns

`NativeUuidStrategy`

## Methods

### useGenerate()

> **useGenerate**(): `string`

Defined in: [src/core/services/generator.service.ts:29](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/generator.service.ts#L29)

#### Returns

`string`

#### Implementation of

[`IUuidStrategy`](../interfaces/IUuidStrategy.md).[`useGenerate`](../interfaces/IUuidStrategy.md#usegenerate)
