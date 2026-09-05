# Interface: ISystemUtils

Defined in: [src/types/index.ts:436](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L436)

Contract of the system utilities.

## Methods

### useAverage()

> **useAverage**(`numbers`): `number`

Defined in: [src/types/index.ts:442](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L442)

#### Parameters

##### numbers

`number`[]

#### Returns

`number`

***

### useCopyToClipboard()

> **useCopyToClipboard**(`text`): `Promise`&lt;`boolean`&gt;

Defined in: [src/types/index.ts:439](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L439)

#### Parameters

##### text

`string`

#### Returns

`Promise`&lt;`boolean`&gt;

***

### useGetUrlParams()

> **useGetUrlParams**(`urlString`): `Record`&lt;`string`, `string`&gt;

Defined in: [src/types/index.ts:440](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L440)

#### Parameters

##### urlString

`string`

#### Returns

`Record`&lt;`string`, `string`&gt;

***

### useRetry()

> **useRetry**&lt;`T`&gt;(`fn`, `retries?`, `delayMs?`): `Promise`&lt;`T`&gt;

Defined in: [src/types/index.ts:438](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L438)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`&lt;`T`&gt;

##### retries?

`number`

##### delayMs?

`number`

#### Returns

`Promise`&lt;`T`&gt;

***

### useRound()

> **useRound**(`value`, `decimals?`): `number`

Defined in: [src/types/index.ts:441](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L441)

#### Parameters

##### value

`string` \| `number`

##### decimals?

`number`

#### Returns

`number`

***

### useSleep()

> **useSleep**(`ms`): `Promise`&lt;`void`&gt;

Defined in: [src/types/index.ts:437](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L437)

#### Parameters

##### ms

`number`

#### Returns

`Promise`&lt;`void`&gt;
