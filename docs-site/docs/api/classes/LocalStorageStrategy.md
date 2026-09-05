# Class: LocalStorageStrategy

Defined in: [src/infrastructure/storage/storage.service.ts:66](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/storage/storage.service.ts#L66)

Concrete strategy backed by `window.localStorage`.

## Extends

- `WebStorageStrategy`

## Constructors

### Constructor

> **new LocalStorageStrategy**(): `LocalStorageStrategy`

Defined in: [src/infrastructure/storage/storage.service.ts:67](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/storage/storage.service.ts#L67)

#### Returns

`LocalStorageStrategy`

#### Overrides

`WebStorageStrategy.constructor`

## Methods

### useClear()

> **useClear**(): `void`

Defined in: [src/infrastructure/storage/storage.service.ts:27](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/storage/storage.service.ts#L27)

#### Returns

`void`

#### Inherited from

`WebStorageStrategy.useClear`

***

### useGetItem()

> **useGetItem**&lt;`T`&gt;(`key`): `T` \| `null`

Defined in: [src/infrastructure/storage/storage.service.ts:9](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/storage/storage.service.ts#L9)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### key

`string`

#### Returns

`T` \| `null`

#### Inherited from

`WebStorageStrategy.useGetItem`

***

### useRemoveItem()

> **useRemoveItem**(`key`): `void`

Defined in: [src/infrastructure/storage/storage.service.ts:23](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/storage/storage.service.ts#L23)

#### Parameters

##### key

`string`

#### Returns

`void`

#### Inherited from

`WebStorageStrategy.useRemoveItem`

***

### useSetItem()

> **useSetItem**(`key`, `value`): `void`

Defined in: [src/infrastructure/storage/storage.service.ts:18](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/storage/storage.service.ts#L18)

#### Parameters

##### key

`string`

##### value

`unknown`

#### Returns

`void`

#### Inherited from

`WebStorageStrategy.useSetItem`
