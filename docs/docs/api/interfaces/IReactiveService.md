# Interface: IReactiveService

Defined in: [src/types/index.ts:387](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L387)

Contract of the reactive facade.

## Methods

### useCreateBatch()

> **useCreateBatch**(): (`callback`) => `void`

Defined in: [src/types/index.ts:398](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L398)

#### Returns

(`callback`) => `void`

***

### useCreateDebouncedSignal()

> **useCreateDebouncedSignal**&lt;`T`&gt;(`initialValue`, `delayMs?`): \[[`SignalGetter`](SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

Defined in: [src/types/index.ts:397](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L397)

#### Type Parameters

##### T

`T`

#### Parameters

##### initialValue

`T`

##### delayMs?

`number`

#### Returns

\[[`SignalGetter`](SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

***

### useCreateEffect()

> **useCreateEffect**(`callback`, `signals`): () => `void`

Defined in: [src/types/index.ts:389](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L389)

#### Parameters

##### callback

() => `void` \| (() => `void`)

##### signals

[`Subscribable`](Subscribable.md)&lt;`unknown`&gt;[]

#### Returns

() => `void`

***

### useCreateMemo()

> **useCreateMemo**&lt;`T`&gt;(`computation`, `signals`): [`SignalGetter`](SignalGetter.md)&lt;`T`&gt;

Defined in: [src/types/index.ts:390](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L390)

#### Type Parameters

##### T

`T`

#### Parameters

##### computation

() => `T`

##### signals

[`Subscribable`](Subscribable.md)&lt;`unknown`&gt;[]

#### Returns

[`SignalGetter`](SignalGetter.md)&lt;`T`&gt;

***

### useCreateSignal()

> **useCreateSignal**&lt;`T`&gt;(`initialValue`): \[[`SignalGetter`](SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

Defined in: [src/types/index.ts:388](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L388)

#### Type Parameters

##### T

`T`

#### Parameters

##### initialValue

`T`

#### Returns

\[[`SignalGetter`](SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

***

### useCreateStorageSignal()

> **useCreateStorageSignal**&lt;`T`&gt;(`key`, `fallbackValue`, `target?`): \[[`SignalGetter`](SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

Defined in: [src/types/index.ts:392](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L392)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### fallbackValue

`T`

##### target?

[`StorageTarget`](../type-aliases/StorageTarget.md)

#### Returns

\[[`SignalGetter`](SignalGetter.md)&lt;`T`&gt;, [`SignalSetter`](../type-aliases/SignalSetter.md)&lt;`T`&gt;\]

***

### useCreateToggle()

> **useCreateToggle**(`initialValue?`): \[[`SignalGetter`](SignalGetter.md)&lt;`boolean`&gt;, [`ToggleSignalSetter`](ToggleSignalSetter.md)\]

Defined in: [src/types/index.ts:391](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L391)

#### Parameters

##### initialValue?

`boolean`

#### Returns

\[[`SignalGetter`](SignalGetter.md)&lt;`boolean`&gt;, [`ToggleSignalSetter`](ToggleSignalSetter.md)\]
