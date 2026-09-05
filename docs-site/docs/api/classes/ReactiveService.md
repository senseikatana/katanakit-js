# Class: ReactiveService

Defined in: [src/core/services/reactive.service.ts:17](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/reactive.service.ts#L17)

Minimal reactive kernel (Observer / Publisher-Subscriber) implemented as a
Facade + Singleton. Signals are closures with explicit dependency tracking.

## Implements

- [`IReactiveService`](../interfaces/IReactiveService.md)

## Methods

### useCreateBatch()

> **useCreateBatch**(): (`callback`) => `void`

Defined in: [src/core/services/reactive.service.ts:194](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/reactive.service.ts#L194)

#### Returns

(`callback`) => `void`

#### Implementation of

[`IReactiveService`](../interfaces/IReactiveService.md).[`useCreateBatch`](../interfaces/IReactiveService.md#usecreatebatch)

***

### useCreateDebouncedSignal()

> **useCreateDebouncedSignal**&lt;`T`&gt;(`initialValue`, `delayMs?`): \[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

Defined in: [src/core/services/reactive.service.ts:173](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/reactive.service.ts#L173)

#### Type Parameters

##### T

`T`

#### Parameters

##### initialValue

`T`

##### delayMs?

`number` = `300`

#### Returns

\[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

#### Implementation of

[`IReactiveService`](../interfaces/IReactiveService.md).[`useCreateDebouncedSignal`](../interfaces/IReactiveService.md#usecreatedebouncedsignal)

***

### useCreateEffect()

> **useCreateEffect**(`callback`, `signals`): () => `void`

Defined in: [src/core/services/reactive.service.ts:73](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/reactive.service.ts#L73)

#### Parameters

##### callback

() => `void` \| (() => `void`)

##### signals

[`Subscribable`](../interfaces/Subscribable.md)&lt;`unknown`&gt;[]

#### Returns

() => `void`

#### Implementation of

[`IReactiveService`](../interfaces/IReactiveService.md).[`useCreateEffect`](../interfaces/IReactiveService.md#usecreateeffect)

***

### useCreateMemo()

> **useCreateMemo**&lt;`T`&gt;(`computation`, `signals`): [`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;

Defined in: [src/core/services/reactive.service.ts:118](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/reactive.service.ts#L118)

#### Type Parameters

##### T

`T`

#### Parameters

##### computation

() => `T`

##### signals

[`Subscribable`](../interfaces/Subscribable.md)&lt;`unknown`&gt;[]

#### Returns

[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;

#### Implementation of

[`IReactiveService`](../interfaces/IReactiveService.md).[`useCreateMemo`](../interfaces/IReactiveService.md#usecreatememo)

***

### useCreateSignal()

> **useCreateSignal**&lt;`T`&gt;(`initialValue`): \[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

Defined in: [src/core/services/reactive.service.ts:40](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/reactive.service.ts#L40)

#### Type Parameters

##### T

`T`

#### Parameters

##### initialValue

`T`

#### Returns

\[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

#### Implementation of

[`IReactiveService`](../interfaces/IReactiveService.md).[`useCreateSignal`](../interfaces/IReactiveService.md#usecreatesignal)

***

### useCreateStorageSignal()

> **useCreateStorageSignal**&lt;`T`&gt;(`key`, `fallbackValue`, `target?`): \[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

Defined in: [src/core/services/reactive.service.ts:138](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/reactive.service.ts#L138)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### fallbackValue

`T`

##### target?

[`StorageTarget`](../type-aliases/StorageTarget.md) = `"localStorage"`

#### Returns

\[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

#### Implementation of

[`IReactiveService`](../interfaces/IReactiveService.md).[`useCreateStorageSignal`](../interfaces/IReactiveService.md#usecreatestoragesignal)

***

### useCreateToggle()

> **useCreateToggle**(`initialValue?`): \[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`boolean`&gt;, [`ToggleSignalSetter`](../interfaces/ToggleSignalSetter.md)\]

Defined in: [src/core/services/reactive.service.ts:131](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/reactive.service.ts#L131)

#### Parameters

##### initialValue?

`boolean` = `false`

#### Returns

\[[`SignalGetter`](../interfaces/SignalGetter.md)&lt;`boolean`&gt;, [`ToggleSignalSetter`](../interfaces/ToggleSignalSetter.md)\]

#### Implementation of

[`IReactiveService`](../interfaces/IReactiveService.md).[`useCreateToggle`](../interfaces/IReactiveService.md#usecreatetoggle)

***

### getInstance()

> `static` **getInstance**(): `ReactiveService`

Defined in: [src/core/services/reactive.service.ts:25](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/core/services/reactive.service.ts#L25)

#### Returns

`ReactiveService`
