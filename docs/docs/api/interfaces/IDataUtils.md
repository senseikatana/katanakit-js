# Interface: IDataUtils

Defined in: [src/types/index.ts:424](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L424)

Contract of the data utilities.

## Methods

### useChunk()

> **useChunk**&lt;`T`&gt;(`array`, `size`): `T`[][]

Defined in: [src/types/index.ts:426](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L426)

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

***

### useDeepClone()

> **useDeepClone**&lt;`T`&gt;(`value`): `T`

Defined in: [src/types/index.ts:429](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L429)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

#### Returns

`T`

***

### useDeepMerge()

> **useDeepMerge**&lt;`T`&gt;(`target`, `source`): `T`

Defined in: [src/types/index.ts:430](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L430)

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

***

### useGroupBy()

> **useGroupBy**&lt;`T`&gt;(`array`, `key`): `Record`&lt;`string`, `T`[]&gt;

Defined in: [src/types/index.ts:427](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L427)

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

***

### useIsObject()

> **useIsObject**(`item`): `item is Record<string, unknown>`

Defined in: [src/types/index.ts:428](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L428)

#### Parameters

##### item

`unknown`

#### Returns

`item is Record<string, unknown>`

***

### useOmit()

> **useOmit**&lt;`T`, `K`&gt;(`obj`, `keys`): `Omit`&lt;`T`, `K`&gt;

Defined in: [src/types/index.ts:432](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L432)

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

***

### usePick()

> **usePick**&lt;`T`, `K`&gt;(`obj`, `keys`): `Pick`&lt;`T`, `K`&gt;

Defined in: [src/types/index.ts:431](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L431)

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

***

### useUnique()

> **useUnique**&lt;`T`&gt;(`array`): `T`[]

Defined in: [src/types/index.ts:425](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/types/index.ts#L425)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

#### Returns

`T`[]
