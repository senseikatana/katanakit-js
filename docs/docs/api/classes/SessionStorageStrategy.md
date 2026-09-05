# Class: SessionStorageStrategy

Defined in: [src/infrastructure/storage/storage.service.ts:75](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/storage/storage.service.ts#L75)

Concrete strategy backed by `window.sessionStorage`.

## Extends

- `WebStorageStrategy`

## Constructors

### Constructor

> **new SessionStorageStrategy**(): `SessionStorageStrategy`

Defined in: [src/infrastructure/storage/storage.service.ts:76](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/storage/storage.service.ts#L76)

#### Returns

`SessionStorageStrategy`

#### Overrides

`WebStorageStrategy.constructor`

## Methods

### useClear()

> **useClear**(): `void`

Defined in: [src/infrastructure/storage/storage.service.ts:27](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/storage/storage.service.ts#L27)

#### Returns

`void`

#### Inherited from

`WebStorageStrategy.useClear`

***

### useGetItem()

> **useGetItem**&lt;`T`&gt;(`key`): `T` \| `null`

Defined in: [src/infrastructure/storage/storage.service.ts:9](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/storage/storage.service.ts#L9)

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

Defined in: [src/infrastructure/storage/storage.service.ts:23](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/storage/storage.service.ts#L23)

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

Defined in: [src/infrastructure/storage/storage.service.ts:18](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/storage/storage.service.ts#L18)

#### Parameters

##### key

`string`

##### value

`unknown`

#### Returns

`void`

#### Inherited from

`WebStorageStrategy.useSetItem`
