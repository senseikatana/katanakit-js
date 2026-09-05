# Class: NativeUuidStrategy

Defined in: [src/core/services/generator.service.ts:28](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/generator.service.ts#L28)

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

Defined in: [src/core/services/generator.service.ts:29](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/generator.service.ts#L29)

#### Returns

`string`

#### Implementation of

[`IUuidStrategy`](../interfaces/IUuidStrategy.md).[`useGenerate`](../interfaces/IUuidStrategy.md#usegenerate)
