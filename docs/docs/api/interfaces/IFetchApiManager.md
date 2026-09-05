# Interface: IFetchApiManager

Defined in: [src/types/index.ts:259](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L259)

Contract of the fetch facade.

## Methods

### useBuildUrl()

> **useBuildUrl**(`apiName`, `endpointName`, `options?`): `string`

Defined in: [src/types/index.ts:262](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L262)

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### options?

[`UrlOptions`](UrlOptions.md)

#### Returns

`string`

***

### useDelete()

> **useDelete**&lt;`T`&gt;(`apiName`, `endpointName`, `urlOptions?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/types/index.ts:285](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L285)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### urlOptions?

[`UrlOptions`](UrlOptions.md)

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

***

### useFetch()

> **useFetch**&lt;`T`&gt;(`apiName`, `endpointName`, `options?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/types/index.ts:263](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L263)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### options?

[`FetchOptions`](FetchOptions.md)

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

***

### useGet()

> **useGet**&lt;`T`&gt;(`apiName`, `endpointName`, `urlOptions?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/types/index.ts:268](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L268)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### apiName

`string`

##### endpointName

`string`

##### urlOptions?

[`UrlOptions`](UrlOptions.md)

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

***

### useGetApis()

> **useGetApis**(): [`ApisConfig`](../type-aliases/ApisConfig.md)

Defined in: [src/types/index.ts:261](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L261)

#### Returns

[`ApisConfig`](../type-aliases/ApisConfig.md)

***

### useInit()

> **useInit**(`apis`): `void`

Defined in: [src/types/index.ts:260](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L260)

#### Parameters

##### apis

[`ApisConfig`](../type-aliases/ApisConfig.md)

#### Returns

`void`

***

### usePost()

> **usePost**&lt;`T`&gt;(`apiName`, `endpointName`, `body?`, `urlOptions?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/types/index.ts:273](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L273)

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

[`UrlOptions`](UrlOptions.md)

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

***

### usePut()

> **usePut**&lt;`T`&gt;(`apiName`, `endpointName`, `body?`, `urlOptions?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/types/index.ts:279](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L279)

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

[`UrlOptions`](UrlOptions.md)

#### Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;
