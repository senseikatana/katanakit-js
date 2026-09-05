# Interface: StorageStrategy

Defined in: [src/types/index.ts:125](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L125)

Strategy contract: homogeneous storage without `any`.

## Methods

### useClear()

> **useClear**(): `void`

Defined in: [src/types/index.ts:129](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L129)

#### Returns

`void`

***

### useGetItem()

> **useGetItem**&lt;`T`&gt;(`key`): `T` \| `null`

Defined in: [src/types/index.ts:126](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L126)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### key

`string`

#### Returns

`T` \| `null`

***

### useRemoveItem()

> **useRemoveItem**(`key`): `void`

Defined in: [src/types/index.ts:128](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L128)

#### Parameters

##### key

`string`

#### Returns

`void`

***

### useSetItem()

> **useSetItem**(`key`, `value`): `void`

Defined in: [src/types/index.ts:127](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/types/index.ts#L127)

#### Parameters

##### key

`string`

##### value

`unknown`

#### Returns

`void`
