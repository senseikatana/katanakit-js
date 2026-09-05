# Class: TimingService

Defined in: [src/core/services/timing.service.ts:10](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L10)

Timing utilities: delays, debouncing, throttling and timeouts.
Implemented as a Singleton facade with factory methods.

## Methods

### useDebounce()

> **useDebounce**&lt;`T`&gt;(`func`, `delayMs`): (...`args`) => `void`

Defined in: [src/core/services/timing.service.ts:118](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L118)

#### Type Parameters

##### T

`T` *extends* (...`args`) => `unknown`

#### Parameters

##### func

`T`

##### delayMs

`number`

#### Returns

(...`args`) => `void`

***

### useDebounceImmediate()

> **useDebounceImmediate**&lt;`T`&gt;(`func`, `delayMs`): (...`args`) => `void`

Defined in: [src/core/services/timing.service.ts:140](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L140)

#### Type Parameters

##### T

`T` *extends* (...`args`) => `unknown`

#### Parameters

##### func

`T`

##### delayMs

`number`

#### Returns

(...`args`) => `void`

***

### useDelay()

> **useDelay**(`ms`): `Promise`&lt;`void`&gt;

Defined in: [src/core/services/timing.service.ts:22](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L22)

#### Parameters

##### ms

`number`

#### Returns

`Promise`&lt;`void`&gt;

***

### useInterval()

> **useInterval**(`callback`, `ms`, `immediate?`): [`IntervalControl`](../interfaces/IntervalControl.md)

Defined in: [src/core/services/timing.service.ts:52](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L52)

#### Parameters

##### callback

() => `void` \| `Promise`&lt;`void`&gt;

##### ms

`number`

##### immediate?

`boolean` = `false`

#### Returns

[`IntervalControl`](../interfaces/IntervalControl.md)

***

### useRace()

> **useRace**&lt;`T`&gt;(`promise`, `timeoutMs`, `errorMessage?`): `Promise`&lt;`T`&gt;

Defined in: [src/core/services/timing.service.ts:251](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L251)

#### Type Parameters

##### T

`T`

#### Parameters

##### promise

`Promise`&lt;`T`&gt;

##### timeoutMs

`number`

##### errorMessage?

`string` = `"Operation timed out"`

#### Returns

`Promise`&lt;`T`&gt;

***

### useRepeat()

> **useRepeat**(`callback`, `iterations`, `delayMs?`): `Promise`&lt;`void`&gt;

Defined in: [src/core/services/timing.service.ts:233](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L233)

#### Parameters

##### callback

(`iteration`) => `void` \| `Promise`&lt;`void`&gt;

##### iterations

`number`

##### delayMs?

`number` = `0`

#### Returns

`Promise`&lt;`void`&gt;

***

### useSetTimeout()

> **useSetTimeout**&lt;`T`&gt;(`callback`, `ms`): [`TimeoutControl`](../interfaces/TimeoutControl.md)&lt;`T`&gt;

Defined in: [src/core/services/timing.service.ts:27](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L27)

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

() => `T` \| `Promise`&lt;`T`&gt;

##### ms

`number`

#### Returns

[`TimeoutControl`](../interfaces/TimeoutControl.md)&lt;`T`&gt;

***

### useSleep()

> **useSleep**(`ms`): `Promise`&lt;`void`&gt;

Defined in: [src/core/services/timing.service.ts:25](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L25)

Alias for delay, more semantic for sleep operations.

#### Parameters

##### ms

`number`

#### Returns

`Promise`&lt;`void`&gt;

***

### useThrottle()

> **useThrottle**&lt;`T`&gt;(`func`, `limitMs`): (...`args`) => `void`

Defined in: [src/core/services/timing.service.ts:179](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L179)

#### Type Parameters

##### T

`T` *extends* (...`args`) => `unknown`

#### Parameters

##### func

`T`

##### limitMs

`number`

#### Returns

(...`args`) => `void`

***

### useThrottleTrailing()

> **useThrottleTrailing**&lt;`T`&gt;(`func`, `limitMs`): (...`args`) => `void`

Defined in: [src/core/services/timing.service.ts:200](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L200)

#### Type Parameters

##### T

`T` *extends* (...`args`) => `unknown`

#### Parameters

##### func

`T`

##### limitMs

`number`

#### Returns

(...`args`) => `void`

***

### getInstance()

> `static` **getInstance**(): `TimingService`

Defined in: [src/core/services/timing.service.ts:15](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/timing.service.ts#L15)

#### Returns

`TimingService`
