# Class: DataUtils

Defined in: [src/core/services/utils.service.ts:6](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L6)

Data utilities implemented as a Singleton.

## Implements

- [`IDataUtils`](../interfaces/IDataUtils.md)

## Methods

### useChunk()

> **useChunk**&lt;`T`&gt;(`array`, `size`): `T`[][]

Defined in: [src/core/services/utils.service.ts:20](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L20)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

##### size

`number`

#### Returns

`T`[][]

#### Implementation of

[`IDataUtils`](../interfaces/IDataUtils.md).[`useChunk`](../interfaces/IDataUtils.md#usechunk)

***

### useDeepClone()

> **useDeepClone**&lt;`T`&gt;(`value`): `T`

Defined in: [src/core/services/utils.service.ts:44](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L44)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

#### Returns

`T`

#### Implementation of

[`IDataUtils`](../interfaces/IDataUtils.md).[`useDeepClone`](../interfaces/IDataUtils.md#usedeepclone)

***

### useDeepMerge()

> **useDeepMerge**&lt;`T`&gt;(`target`, `source`): `T`

Defined in: [src/core/services/utils.service.ts:51](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L51)

#### Type Parameters

##### T

`T` *extends* `Record`&lt;`string`, `unknown`&gt;

#### Parameters

##### target

`T`

##### source

`Record`&lt;`string`, `unknown`&gt;

#### Returns

`T`

#### Implementation of

[`IDataUtils`](../interfaces/IDataUtils.md).[`useDeepMerge`](../interfaces/IDataUtils.md#usedeepmerge)

***

### useGroupBy()

> **useGroupBy**&lt;`T`&gt;(`array`, `key`): `Record`&lt;`string`, `T`[]&gt;

Defined in: [src/core/services/utils.service.ts:27](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L27)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

##### key

keyof `T` \| ((`item`) => `string`)

#### Returns

`Record`&lt;`string`, `T`[]&gt;

#### Implementation of

[`IDataUtils`](../interfaces/IDataUtils.md).[`useGroupBy`](../interfaces/IDataUtils.md#usegroupby)

***

### useIsObject()

> **useIsObject**(`item`): `item is Record<string, unknown>`

Defined in: [src/core/services/utils.service.ts:41](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L41)

#### Parameters

##### item

`unknown`

#### Returns

`item is Record<string, unknown>`

#### Implementation of

[`IDataUtils`](../interfaces/IDataUtils.md).[`useIsObject`](../interfaces/IDataUtils.md#useisobject)

***

### useOmit()

> **useOmit**&lt;`T`, `K`&gt;(`obj`, `keys`): `Omit`&lt;`T`, `K`&gt;

Defined in: [src/core/services/utils.service.ts:81](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L81)

#### Type Parameters

##### T

`T` *extends* `object`

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### obj

`T`

##### keys

`K`[]

#### Returns

`Omit`&lt;`T`, `K`&gt;

#### Implementation of

[`IDataUtils`](../interfaces/IDataUtils.md).[`useOmit`](../interfaces/IDataUtils.md#useomit)

***

### usePick()

> **usePick**&lt;`T`, `K`&gt;(`obj`, `keys`): `Pick`&lt;`T`, `K`&gt;

Defined in: [src/core/services/utils.service.ts:71](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L71)

#### Type Parameters

##### T

`T` *extends* `object`

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### obj

`T`

##### keys

`K`[]

#### Returns

`Pick`&lt;`T`, `K`&gt;

#### Implementation of

[`IDataUtils`](../interfaces/IDataUtils.md).[`usePick`](../interfaces/IDataUtils.md#usepick)

***

### useUnique()

> **useUnique**&lt;`T`&gt;(`array`): `T`[]

Defined in: [src/core/services/utils.service.ts:18](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L18)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

#### Returns

`T`[]

#### Implementation of

[`IDataUtils`](../interfaces/IDataUtils.md).[`useUnique`](../interfaces/IDataUtils.md#useunique)

***

### getInstance()

> `static` **getInstance**(): `DataUtils`

Defined in: [src/core/services/utils.service.ts:11](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/utils.service.ts#L11)

#### Returns

`DataUtils`
