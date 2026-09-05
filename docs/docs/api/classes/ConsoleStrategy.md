# Class: ConsoleStrategy

Defined in: [src/core/services/logger.service.ts:6](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/logger.service.ts#L6)

Concrete strategy: native console output.

## Implements

- [`LogStrategy`](../interfaces/LogStrategy.md)

## Constructors

### Constructor

> **new ConsoleStrategy**(): `ConsoleStrategy`

#### Returns

`ConsoleStrategy`

## Methods

### useOutput()

> **useOutput**(`level`, `message`, `data?`): `void`

Defined in: [src/core/services/logger.service.ts:7](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/logger.service.ts#L7)

#### Parameters

##### level

[`LogLevel`](../type-aliases/LogLevel.md)

##### message

`string`

##### data?

`unknown`

#### Returns

`void`

#### Implementation of

[`LogStrategy`](../interfaces/LogStrategy.md).[`useOutput`](../interfaces/LogStrategy.md#useoutput)
