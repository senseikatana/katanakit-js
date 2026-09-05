# Class: ErrorFactoryService

Defined in: [src/core/services/error.service.ts:26](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/error.service.ts#L26)

Error factory implemented as a singleton (Factory Method pattern).

## Implements

- [`IErrorFactory`](../interfaces/IErrorFactory.md)

## Methods

### useBadRequest()

> **useBadRequest**(`message?`): [`AppError`](AppError.md)

Defined in: [src/core/services/error.service.ts:38](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/error.service.ts#L38)

#### Parameters

##### message?

`string` = `"Bad Request"`

#### Returns

[`AppError`](AppError.md)

#### Implementation of

[`IErrorFactory`](../interfaces/IErrorFactory.md).[`useBadRequest`](../interfaces/IErrorFactory.md#usebadrequest)

***

### useCustom()

> **useCustom**(`message`, `code`): [`AppError`](AppError.md)

Defined in: [src/core/services/error.service.ts:48](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/error.service.ts#L48)

#### Parameters

##### message

`string`

##### code

`number`

#### Returns

[`AppError`](AppError.md)

#### Implementation of

[`IErrorFactory`](../interfaces/IErrorFactory.md).[`useCustom`](../interfaces/IErrorFactory.md#usecustom)

***

### useForbidden()

> **useForbidden**(`message?`): [`AppError`](AppError.md)

Defined in: [src/core/services/error.service.ts:42](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/error.service.ts#L42)

#### Parameters

##### message?

`string` = `"Forbidden"`

#### Returns

[`AppError`](AppError.md)

#### Implementation of

[`IErrorFactory`](../interfaces/IErrorFactory.md).[`useForbidden`](../interfaces/IErrorFactory.md#useforbidden)

***

### useInternal()

> **useInternal**(`message?`): [`AppError`](AppError.md)

Defined in: [src/core/services/error.service.ts:46](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/error.service.ts#L46)

#### Parameters

##### message?

`string` = `"Internal Server Error"`

#### Returns

[`AppError`](AppError.md)

#### Implementation of

[`IErrorFactory`](../interfaces/IErrorFactory.md).[`useInternal`](../interfaces/IErrorFactory.md#useinternal)

***

### useNotFound()

> **useNotFound**(`message?`): [`AppError`](AppError.md)

Defined in: [src/core/services/error.service.ts:44](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/error.service.ts#L44)

#### Parameters

##### message?

`string` = `"Not Found"`

#### Returns

[`AppError`](AppError.md)

#### Implementation of

[`IErrorFactory`](../interfaces/IErrorFactory.md).[`useNotFound`](../interfaces/IErrorFactory.md#usenotfound)

***

### useUnauthorized()

> **useUnauthorized**(`message?`): [`AppError`](AppError.md)

Defined in: [src/core/services/error.service.ts:40](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/error.service.ts#L40)

#### Parameters

##### message?

`string` = `"Unauthorized"`

#### Returns

[`AppError`](AppError.md)

#### Implementation of

[`IErrorFactory`](../interfaces/IErrorFactory.md).[`useUnauthorized`](../interfaces/IErrorFactory.md#useunauthorized)

***

### getInstance()

> `static` **getInstance**(): `ErrorFactoryService`

Defined in: [src/core/services/error.service.ts:31](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/error.service.ts#L31)

#### Returns

`ErrorFactoryService`
