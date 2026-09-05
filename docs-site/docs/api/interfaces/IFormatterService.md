# Interface: IFormatterService

Defined in: [src/types/index.ts:318](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L318)

Contract of the formatter facade.

## Methods

### useCapitalize()

> **useCapitalize**(`text`, `locale?`): `string`

Defined in: [src/types/index.ts:319](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L319)

#### Parameters

##### text

`string`

##### locale?

[`Locale`](../type-aliases/Locale.md)

#### Returns

`string`

***

### useFormatCurrency()

> **useFormatCurrency**(`options`): `string`

Defined in: [src/types/index.ts:320](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L320)

#### Parameters

##### options

[`CurrencyFormatOptions`](CurrencyFormatOptions.md)

#### Returns

`string`

***

### useFormatNumber()

> **useFormatNumber**(`value`, `locale?`, `digits?`): `string`

Defined in: [src/types/index.ts:321](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L321)

#### Parameters

##### value

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md)

##### digits?

`number`

#### Returns

`string`

***

### useJsonParse()

> **useJsonParse**&lt;`T`&gt;(`json`): `T`

Defined in: [src/types/index.ts:322](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L322)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### json

`string`

#### Returns

`T`

***

### useJsonStringify()

> **useJsonStringify**(`data`): `string`

Defined in: [src/types/index.ts:323](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L323)

#### Parameters

##### data

`unknown`

#### Returns

`string`

***

### useLowerCase()

> **useLowerCase**(`text`, `locale?`): `string`

Defined in: [src/types/index.ts:324](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L324)

#### Parameters

##### text

`string`

##### locale?

[`Locale`](../type-aliases/Locale.md)

#### Returns

`string`

***

### useUpperCase()

> **useUpperCase**(`text`, `locale?`): `string`

Defined in: [src/types/index.ts:325](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L325)

#### Parameters

##### text

`string`

##### locale?

[`Locale`](../type-aliases/Locale.md)

#### Returns

`string`
