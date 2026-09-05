# Class: MemoryStorageStrategy

Defined in: [src/infrastructure/storage/storage.service.ts:84](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L84)

Concrete strategy backed by an in-memory store (SSR fallback).

## Extends

- `WebStorageStrategy`

## Constructors

### Constructor

> **new MemoryStorageStrategy**(): `MemoryStorageStrategy`

Defined in: [src/infrastructure/storage/storage.service.ts:85](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L85)

#### Returns

`MemoryStorageStrategy`

#### Overrides

`WebStorageStrategy.constructor`

## Methods

### useClear()

> **useClear**(): `void`

Defined in: [src/infrastructure/storage/storage.service.ts:27](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L27)

#### Returns

`void`

#### Inherited from

`WebStorageStrategy.useClear`

***

### useGetItem()

> **useGetItem**&lt;`T`&gt;(`key`): `T` \| `null`

Defined in: [src/infrastructure/storage/storage.service.ts:9](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L9)

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

Defined in: [src/infrastructure/storage/storage.service.ts:23](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L23)

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

Defined in: [src/infrastructure/storage/storage.service.ts:18](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L18)

#### Parameters

##### key

`string`

##### value

`unknown`

#### Returns

`void`

#### Inherited from

`WebStorageStrategy.useSetItem`
