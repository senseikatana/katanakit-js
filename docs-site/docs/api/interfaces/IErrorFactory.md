# Interface: IErrorFactory

Defined in: [src/types/index.ts:304](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L304)

Contract of the error factory.

## Methods

### useBadRequest()

> **useBadRequest**(`message?`): [`AppError`](../classes/AppError.md)

Defined in: [src/types/index.ts:305](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L305)

#### Parameters

##### message?

`string`

#### Returns

[`AppError`](../classes/AppError.md)

***

### useCustom()

> **useCustom**(`message`, `code`): [`AppError`](../classes/AppError.md)

Defined in: [src/types/index.ts:310](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L310)

#### Parameters

##### message

`string`

##### code

`number`

#### Returns

[`AppError`](../classes/AppError.md)

***

### useForbidden()

> **useForbidden**(`message?`): [`AppError`](../classes/AppError.md)

Defined in: [src/types/index.ts:307](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L307)

#### Parameters

##### message?

`string`

#### Returns

[`AppError`](../classes/AppError.md)

***

### useInternal()

> **useInternal**(`message?`): [`AppError`](../classes/AppError.md)

Defined in: [src/types/index.ts:309](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L309)

#### Parameters

##### message?

`string`

#### Returns

[`AppError`](../classes/AppError.md)

***

### useNotFound()

> **useNotFound**(`message?`): [`AppError`](../classes/AppError.md)

Defined in: [src/types/index.ts:308](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L308)

#### Parameters

##### message?

`string`

#### Returns

[`AppError`](../classes/AppError.md)

***

### useUnauthorized()

> **useUnauthorized**(`message?`): [`AppError`](../classes/AppError.md)

Defined in: [src/types/index.ts:306](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L306)

#### Parameters

##### message?

`string`

#### Returns

[`AppError`](../classes/AppError.md)
