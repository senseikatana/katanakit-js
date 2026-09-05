# Class: FormatterService

Defined in: [src/core/services/formatter.service.ts:11](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/formatter.service.ts#L11)

Number/currency/string formatter (Adapter + Singleton) over `Intl`.

## Implements

- [`IFormatterService`](../interfaces/IFormatterService.md)

## Methods

### useCapitalize()

> **useCapitalize**(`text`, `locale?`): `string`

Defined in: [src/core/services/formatter.service.ts:36](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/formatter.service.ts#L36)

#### Parameters

##### text

`string`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

#### Returns

`string`

#### Implementation of

[`IFormatterService`](../interfaces/IFormatterService.md).[`useCapitalize`](../interfaces/IFormatterService.md#usecapitalize)

***

### useFormatCurrency()

> **useFormatCurrency**(`options`): `string`

Defined in: [src/core/services/formatter.service.ts:42](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/formatter.service.ts#L42)

#### Parameters

##### options

[`CurrencyFormatOptions`](../interfaces/CurrencyFormatOptions.md)

#### Returns

`string`

#### Implementation of

[`IFormatterService`](../interfaces/IFormatterService.md).[`useFormatCurrency`](../interfaces/IFormatterService.md#useformatcurrency)

***

### useFormatNumber()

> **useFormatNumber**(`value`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:23](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/formatter.service.ts#L23)

#### Parameters

##### value

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### digits?

`number` = `2`

#### Returns

`string`

#### Implementation of

[`IFormatterService`](../interfaces/IFormatterService.md).[`useFormatNumber`](../interfaces/IFormatterService.md#useformatnumber)

***

### useJsonParse()

> **useJsonParse**&lt;`T`&gt;(`json`): `T`

Defined in: [src/core/services/formatter.service.ts:53](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/formatter.service.ts#L53)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### json

`string`

#### Returns

`T`

#### Implementation of

[`IFormatterService`](../interfaces/IFormatterService.md).[`useJsonParse`](../interfaces/IFormatterService.md#usejsonparse)

***

### useJsonStringify()

> **useJsonStringify**(`data`): `string`

Defined in: [src/core/services/formatter.service.ts:51](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/formatter.service.ts#L51)

#### Parameters

##### data

`unknown`

#### Returns

`string`

#### Implementation of

[`IFormatterService`](../interfaces/IFormatterService.md).[`useJsonStringify`](../interfaces/IFormatterService.md#usejsonstringify)

***

### useLowerCase()

> **useLowerCase**(`text`, `locale?`): `string`

Defined in: [src/core/services/formatter.service.ts:33](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/formatter.service.ts#L33)

#### Parameters

##### text

`string`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

#### Returns

`string`

#### Implementation of

[`IFormatterService`](../interfaces/IFormatterService.md).[`useLowerCase`](../interfaces/IFormatterService.md#uselowercase)

***

### useUpperCase()

> **useUpperCase**(`text`, `locale?`): `string`

Defined in: [src/core/services/formatter.service.ts:30](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/formatter.service.ts#L30)

#### Parameters

##### text

`string`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

#### Returns

`string`

#### Implementation of

[`IFormatterService`](../interfaces/IFormatterService.md).[`useUpperCase`](../interfaces/IFormatterService.md#useuppercase)

***

### getInstance()

> `static` **getInstance**(): `FormatterService`

Defined in: [src/core/services/formatter.service.ts:16](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/formatter.service.ts#L16)

#### Returns

`FormatterService`
