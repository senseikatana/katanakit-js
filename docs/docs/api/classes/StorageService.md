# Class: StorageService

Defined in: [src/infrastructure/storage/storage.service.ts:94](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L94)

Storage facade (Singleton + Strategy). Lazily picks browser storage or an
in-memory fallback so importing this module never crashes in SSR (Node/Bun).

## Methods

### useClearStorage()

> **useClearStorage**(`target?`): `void`

Defined in: [src/infrastructure/storage/storage.service.ts:132](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L132)

#### Parameters

##### target?

[`StorageTarget`](../type-aliases/StorageTarget.md) = `"localStorage"`

#### Returns

`void`

***

### useGetStorage()

> **useGetStorage**&lt;`T`&gt;(`key`, `target?`): `T` \| `null`

Defined in: [src/infrastructure/storage/storage.service.ts:118](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L118)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### key

`string`

##### target?

[`StorageTarget`](../type-aliases/StorageTarget.md) = `"localStorage"`

#### Returns

`T` \| `null`

***

### useRemoveStorage()

> **useRemoveStorage**(`key`, `target?`): `void`

Defined in: [src/infrastructure/storage/storage.service.ts:129](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L129)

#### Parameters

##### key

`string`

##### target?

[`StorageTarget`](../type-aliases/StorageTarget.md) = `"localStorage"`

#### Returns

`void`

***

### useSetStorage()

> **useSetStorage**(`key`, `value`, `target?`): `void`

Defined in: [src/infrastructure/storage/storage.service.ts:123](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L123)

#### Parameters

##### key

`string`

##### value

`unknown`

##### target?

[`StorageTarget`](../type-aliases/StorageTarget.md) = `"localStorage"`

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `StorageService`

Defined in: [src/infrastructure/storage/storage.service.ts:100](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/storage/storage.service.ts#L100)

#### Returns

`StorageService`
