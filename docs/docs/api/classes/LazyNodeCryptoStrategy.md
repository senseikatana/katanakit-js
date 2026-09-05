# Class: LazyNodeCryptoStrategy

Defined in: [src/core/services/generator.service.ts:9](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/generator.service.ts#L9)

Loads the Node.js `crypto` module lazily, only when `useEncrypt` is invoked.

NOTE: this is a one-way hash demo, not a credential store. Do not rely on the
fixed default salt for real password hashing; prefer scrypt/argon2id instead.

## Implements

- [`ICryptoStrategy`](../interfaces/ICryptoStrategy.md)

## Constructors

### Constructor

> **new LazyNodeCryptoStrategy**(): `LazyNodeCryptoStrategy`

#### Returns

`LazyNodeCryptoStrategy`

## Methods

### useEncrypt()

> **useEncrypt**(`plainText`, `salt?`): `Promise`&lt;`string`&gt;

Defined in: [src/core/services/generator.service.ts:10](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/generator.service.ts#L10)

#### Parameters

##### plainText

`string`

##### salt?

`string`

#### Returns

`Promise`&lt;`string`&gt;

#### Implementation of

[`ICryptoStrategy`](../interfaces/ICryptoStrategy.md).[`useEncrypt`](../interfaces/ICryptoStrategy.md#useencrypt)
