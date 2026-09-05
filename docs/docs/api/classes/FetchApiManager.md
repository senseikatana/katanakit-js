# Class: FetchApiManager

Defined in: [src/core/services/http.service.ts:14](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L14)

Framework-agnostic HTTP client: builds safe URLs from a JSON-defined registry
and wraps `fetch` in a Safe Result. Implemented as a Facade + Singleton.

## Implements

- [`IFetchApiManager`](../interfaces/IFetchApiManager.md)

## Methods

### useBuildUrl()

> **useBuildUrl**(`apiName`, `endpointName`, `options?`): `string`

Defined in: [src/core/services/http.service.ts:41](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L41)

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### options?

[`UrlOptions`](../interfaces/UrlOptions.md) = `{}`

#### Returns

`string`

#### Implementation of

[`IFetchApiManager`](../interfaces/IFetchApiManager.md).[`useBuildUrl`](../interfaces/IFetchApiManager.md#usebuildurl)

***

### useDelete()

> **useDelete**&lt;`T`&gt;(`apiName`, `endpointName`, `urlOptions?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/core/services/http.service.ts:173](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L173)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### urlOptions?

[`UrlOptions`](../interfaces/UrlOptions.md)

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

#### Implementation of

[`IFetchApiManager`](../interfaces/IFetchApiManager.md).[`useDelete`](../interfaces/IFetchApiManager.md#usedelete)

***

### useFetch()

> **useFetch**&lt;`T`&gt;(`apiName`, `endpointName`, `__namedParameters?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/core/services/http.service.ts:82](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L82)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### \_\_namedParameters?

[`FetchOptions`](../interfaces/FetchOptions.md) = `{}`

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

#### Implementation of

[`IFetchApiManager`](../interfaces/IFetchApiManager.md).[`useFetch`](../interfaces/IFetchApiManager.md#usefetch)

***

### useGet()

> **useGet**&lt;`T`&gt;(`apiName`, `endpointName`, `urlOptions?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/core/services/http.service.ts:140](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L140)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### urlOptions?

[`UrlOptions`](../interfaces/UrlOptions.md)

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

#### Implementation of

[`IFetchApiManager`](../interfaces/IFetchApiManager.md).[`useGet`](../interfaces/IFetchApiManager.md#useget)

***

### useGetApis()

> **useGetApis**(): [`ApisConfig`](../type-aliases/ApisConfig.md)

Defined in: [src/core/services/http.service.ts:31](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L31)

#### Returns

[`ApisConfig`](../type-aliases/ApisConfig.md)

#### Implementation of

[`IFetchApiManager`](../interfaces/IFetchApiManager.md).[`useGetApis`](../interfaces/IFetchApiManager.md#usegetapis)

***

### useInit()

> **useInit**(`apis`): `void`

Defined in: [src/core/services/http.service.ts:27](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L27)

#### Parameters

##### apis

[`ApisConfig`](../type-aliases/ApisConfig.md)

#### Returns

`void`

#### Implementation of

[`IFetchApiManager`](../interfaces/IFetchApiManager.md).[`useInit`](../interfaces/IFetchApiManager.md#useinit)

***

### usePost()

> **usePost**&lt;`T`&gt;(`apiName`, `endpointName`, `body?`, `urlOptions?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/core/services/http.service.ts:147](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L147)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### body?

`unknown`

##### urlOptions?

[`UrlOptions`](../interfaces/UrlOptions.md)

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

#### Implementation of

[`IFetchApiManager`](../interfaces/IFetchApiManager.md).[`usePost`](../interfaces/IFetchApiManager.md#usepost)

***

### usePut()

> **usePut**&lt;`T`&gt;(`apiName`, `endpointName`, `body?`, `urlOptions?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/core/services/http.service.ts:160](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L160)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### body?

`unknown`

##### urlOptions?

[`UrlOptions`](../interfaces/UrlOptions.md)

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

#### Implementation of

[`IFetchApiManager`](../interfaces/IFetchApiManager.md).[`usePut`](../interfaces/IFetchApiManager.md#useput)

***

### getInstance()

> `static` **getInstance**(): `FetchApiManager`

Defined in: [src/core/services/http.service.ts:20](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/core/services/http.service.ts#L20)

#### Returns

`FetchApiManager`
