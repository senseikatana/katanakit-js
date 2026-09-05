# Class: SystemUtils

Defined in: [src/core/services/utils.service.ts:91](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/utils.service.ts#L91)

System utilities implemented as a Singleton.

## Implements

- [`ISystemUtils`](../interfaces/ISystemUtils.md)

## Methods

### useAverage()

> **useAverage**(`numbers`): `number`

Defined in: [src/core/services/utils.service.ts:140](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/utils.service.ts#L140)

#### Parameters

##### numbers

`number`[]

#### Returns

`number`

#### Implementation of

[`ISystemUtils`](../interfaces/ISystemUtils.md).[`useAverage`](../interfaces/ISystemUtils.md#useaverage)

***

### useCopyToClipboard()

> **useCopyToClipboard**(`text`): `Promise`&lt;`boolean`&gt;

Defined in: [src/core/services/utils.service.ts:115](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/utils.service.ts#L115)

#### Parameters

##### text

`string`

#### Returns

`Promise`&lt;`boolean`&gt;

#### Implementation of

[`ISystemUtils`](../interfaces/ISystemUtils.md).[`useCopyToClipboard`](../interfaces/ISystemUtils.md#usecopytoclipboard)

***

### useGetUrlParams()

> **useGetUrlParams**(`urlString`): `Record`&lt;`string`, `string`&gt;

Defined in: [src/core/services/utils.service.ts:124](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/utils.service.ts#L124)

#### Parameters

##### urlString

`string`

#### Returns

`Record`&lt;`string`, `string`&gt;

#### Implementation of

[`ISystemUtils`](../interfaces/ISystemUtils.md).[`useGetUrlParams`](../interfaces/ISystemUtils.md#usegeturlparams)

***

### useRetry()

> **useRetry**&lt;`T`&gt;(`fn`, `retries?`, `delayMs?`): `Promise`&lt;`T`&gt;

Defined in: [src/core/services/utils.service.ts:105](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/utils.service.ts#L105)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`&lt;`T`&gt;

##### retries?

`number` = `3`

##### delayMs?

`number` = `1000`

#### Returns

`Promise`&lt;`T`&gt;

#### Implementation of

[`ISystemUtils`](../interfaces/ISystemUtils.md).[`useRetry`](../interfaces/ISystemUtils.md#useretry)

***

### useRound()

> **useRound**(`value`, `decimals?`): `number`

Defined in: [src/core/services/utils.service.ts:133](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/utils.service.ts#L133)

#### Parameters

##### value

`string` \| `number`

##### decimals?

`number` = `2`

#### Returns

`number`

#### Implementation of

[`ISystemUtils`](../interfaces/ISystemUtils.md).[`useRound`](../interfaces/ISystemUtils.md#useround)

***

### useSleep()

> **useSleep**(`ms`): `Promise`&lt;`void`&gt;

Defined in: [src/core/services/utils.service.ts:103](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/utils.service.ts#L103)

#### Parameters

##### ms

`number`

#### Returns

`Promise`&lt;`void`&gt;

#### Implementation of

[`ISystemUtils`](../interfaces/ISystemUtils.md).[`useSleep`](../interfaces/ISystemUtils.md#usesleep)

***

### getInstance()

> `static` **getInstance**(): `SystemUtils`

Defined in: [src/core/services/utils.service.ts:96](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/utils.service.ts#L96)

#### Returns

`SystemUtils`
