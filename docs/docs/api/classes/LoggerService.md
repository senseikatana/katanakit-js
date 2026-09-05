# Class: LoggerService

Defined in: [src/core/services/logger.service.ts:20](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/logger.service.ts#L20)

Singleton context: holds the active strategy and keeps `this` bound through
arrow-function methods so destructured exports remain safe.

## Properties

### useLog

> **useLog**: \{(`message`, `data?`): `void`; (`level`, `message`, `data?`): `void`; \}

Defined in: [src/core/services/logger.service.ts:45](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/logger.service.ts#L45)

Overloads allow:
- message only: `useLog("message")`
- message + data: `useLog("message", { id: 1 })`
- level + message + data: `useLog("error", "something failed", { code: 500 })`

#### Call Signature

> (`message`, `data?`): `void`

##### Parameters

###### message

`string`

###### data?

`unknown`

##### Returns

`void`

#### Call Signature

> (`level`, `message`, `data?`): `void`

##### Parameters

###### level

[`LogLevel`](../type-aliases/LogLevel.md)

###### message

`string`

###### data?

`unknown`

##### Returns

`void`

## Methods

### useClear()

> **useClear**(): `void`

Defined in: [src/core/services/logger.service.ts:65](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/logger.service.ts#L65)

#### Returns

`void`

***

### useError()

> **useError**(`message`, `data?`): `void`

Defined in: [src/core/services/logger.service.ts:61](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/logger.service.ts#L61)

#### Parameters

##### message

`string`

##### data?

`unknown`

#### Returns

`void`

***

### useSetStrategy()

> **useSetStrategy**(`strategy`): `void`

Defined in: [src/core/services/logger.service.ts:35](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/logger.service.ts#L35)

#### Parameters

##### strategy

[`LogStrategy`](../interfaces/LogStrategy.md)

#### Returns

`void`

***

### useTable()

> **useTable**(`data`): `void`

Defined in: [src/core/services/logger.service.ts:69](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/logger.service.ts#L69)

#### Parameters

##### data

`unknown`

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `LoggerService`

Defined in: [src/core/services/logger.service.ts:28](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/logger.service.ts#L28)

#### Returns

`LoggerService`
