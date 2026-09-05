# Class: WorkerService

Defined in: [src/infrastructure/worker/worker.service.ts:7](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L7)

Worker facade (Singleton + Pool pattern) for running pure functions off the
main thread, with an SSR/main-thread fallback when Worker is unavailable.

## Methods

### useCreatePool()

> **useCreatePool**&lt;`TInput`, `TOutput`&gt;(`key`, `workerFunc`): `this`

Defined in: [src/infrastructure/worker/worker.service.ts:83](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L83)

Creates a reusable Worker pool under a unique key.

#### Type Parameters

##### TInput

`TInput`

##### TOutput

`TOutput`

#### Parameters

##### key

`string`

##### workerFunc

[`WorkerFunc`](../type-aliases/WorkerFunc.md)&lt;`TInput`, `TOutput`&gt;

#### Returns

`this`

***

### useHasWorker()

> **useHasWorker**(`key`): `boolean`

Defined in: [src/infrastructure/worker/worker.service.ts:169](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L169)

Checks whether a pool exists.

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### useKeys()

> **useKeys**(): `string`[]

Defined in: [src/infrastructure/worker/worker.service.ts:176](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L176)

Lists all active pool keys.

#### Returns

`string`[]

***

### useRun()

> **useRun**&lt;`TInput`, `TOutput`&gt;(`workerFunc`, `data`): `Promise`&lt;`TOutput`&gt;

Defined in: [src/infrastructure/worker/worker.service.ts:27](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L27)

Runs a pure function in a one-shot Worker and destroys it afterwards.

#### Type Parameters

##### TInput

`TInput`

##### TOutput

`TOutput`

#### Parameters

##### workerFunc

[`WorkerFunc`](../type-aliases/WorkerFunc.md)&lt;`TInput`, `TOutput`&gt;

##### data

`TInput`

#### Returns

`Promise`&lt;`TOutput`&gt;

***

### useRunPool()

> **useRunPool**&lt;`TInput`, `TOutput`&gt;(`key`, `data`): `Promise`&lt;`TOutput`&gt;

Defined in: [src/infrastructure/worker/worker.service.ts:112](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L112)

Runs a task on an existing pool. Tasks are queued to prevent race conditions
when multiple calls target the same pool key concurrently.

#### Type Parameters

##### TInput

`TInput`

##### TOutput

`TOutput`

#### Parameters

##### key

`string`

##### data

`TInput`

#### Returns

`Promise`&lt;`TOutput`&gt;

***

### useTerminate()

> **useTerminate**(`key`): `this`

Defined in: [src/infrastructure/worker/worker.service.ts:146](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L146)

Terminates a specific pool.

#### Parameters

##### key

`string`

#### Returns

`this`

***

### useTerminateAll()

> **useTerminateAll**(): `this`

Defined in: [src/infrastructure/worker/worker.service.ts:159](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L159)

Terminates all active pools.

#### Returns

`this`

***

### getInstance()

> `static` **getInstance**(): `WorkerService`

Defined in: [src/infrastructure/worker/worker.service.ts:13](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L13)

#### Returns

`WorkerService`

***

### useIsSupported()

> `static` **useIsSupported**(): `boolean`

Defined in: [src/infrastructure/worker/worker.service.ts:20](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/worker/worker.service.ts#L20)

#### Returns

`boolean`
