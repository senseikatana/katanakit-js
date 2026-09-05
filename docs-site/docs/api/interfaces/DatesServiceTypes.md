# Interface: DatesServiceTypes

Defined in: [src/types/index.ts:188](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L188)

Contract of the dates facade.

## Methods

### useAddDays()

> **useAddDays**(`date`, `days`): `string`

Defined in: [src/types/index.ts:193](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L193)

#### Parameters

##### date

`string` \| `PlainDate`

##### days

`number`

#### Returns

`string`

***

### useDiff()

> **useDiff**(`start`, `end`): `string`

Defined in: [src/types/index.ts:189](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L189)

#### Parameters

##### start

`string` \| `PlainDate`

##### end

`string` \| `PlainDate`

#### Returns

`string`

***

### useFirstDayOfMonth()

> **useFirstDayOfMonth**(`date?`): `string`

Defined in: [src/types/index.ts:198](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L198)

#### Parameters

##### date?

`string` \| `PlainDate`

#### Returns

`string`

***

### useFormat()

> **useFormat**(`dateInput`, `locale?`, `options?`): `string`

Defined in: [src/types/index.ts:190](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L190)

#### Parameters

##### dateInput

[`TemporalInput`](../type-aliases/TemporalInput.md)

##### locale?

[`Locale`](../type-aliases/Locale.md)

##### options?

`DateTimeFormatOptions`

#### Returns

`string`

***

### useIsAfter()

> **useIsAfter**(`date1`, `date2`): `boolean`

Defined in: [src/types/index.ts:197](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L197)

#### Parameters

##### date1

`string` \| `PlainDate`

##### date2

`string` \| `PlainDate`

#### Returns

`boolean`

***

### useIsBefore()

> **useIsBefore**(`date1`, `date2`): `boolean`

Defined in: [src/types/index.ts:196](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L196)

#### Parameters

##### date1

`string` \| `PlainDate`

##### date2

`string` \| `PlainDate`

#### Returns

`boolean`

***

### useIsEqual()

> **useIsEqual**(`date1`, `date2`): `boolean`

Defined in: [src/types/index.ts:195](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L195)

#### Parameters

##### date1

`string` \| `PlainDate`

##### date2

`string` \| `PlainDate`

#### Returns

`boolean`

***

### useLastDayOfMonth()

> **useLastDayOfMonth**(`date?`): `string`

Defined in: [src/types/index.ts:199](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L199)

#### Parameters

##### date?

`string` \| `PlainDate`

#### Returns

`string`

***

### useNow()

> **useNow**(): `string`

Defined in: [src/types/index.ts:191](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L191)

#### Returns

`string`

***

### useNowDateTime()

> **useNowDateTime**(): `string`

Defined in: [src/types/index.ts:192](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L192)

#### Returns

`string`

***

### useSubtractDays()

> **useSubtractDays**(`date`, `days`): `string`

Defined in: [src/types/index.ts:194](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L194)

#### Parameters

##### date

`string` \| `PlainDate`

##### days

`number`

#### Returns

`string`
