# Class: ConverterService

Defined in: [src/core/services/formatter.service.ts:59](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L59)

Unit converter facade (Facade + Adapter + Singleton) built on FormatterService.

## Implements

- [`IConverterService`](../interfaces/IConverterService.md)

## Methods

### useToCelsius()

> **useToCelsius**(`fahrenheit`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:74](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L74)

#### Parameters

##### fahrenheit

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### digits?

`number` = `2`

#### Returns

`string`

#### Implementation of

[`IConverterService`](../interfaces/IConverterService.md).[`useToCelsius`](../interfaces/IConverterService.md#usetocelsius)

***

### useToCm()

> **useToCm**(`inches`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:89](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L89)

#### Parameters

##### inches

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### digits?

`number` = `2`

#### Returns

`string`

#### Implementation of

[`IConverterService`](../interfaces/IConverterService.md).[`useToCm`](../interfaces/IConverterService.md#usetocm)

***

### useToFahrenheit()

> **useToFahrenheit**(`celsius`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:77](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L77)

#### Parameters

##### celsius

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### digits?

`number` = `2`

#### Returns

`string`

#### Implementation of

[`IConverterService`](../interfaces/IConverterService.md).[`useToFahrenheit`](../interfaces/IConverterService.md#usetofahrenheit)

***

### useToInches()

> **useToInches**(`cm`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:86](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L86)

#### Parameters

##### cm

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### digits?

`number` = `2`

#### Returns

`string`

#### Implementation of

[`IConverterService`](../interfaces/IConverterService.md).[`useToInches`](../interfaces/IConverterService.md#usetoinches)

***

### useToKilometers()

> **useToKilometers**(`miles`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:80](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L80)

#### Parameters

##### miles

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### digits?

`number` = `2`

#### Returns

`string`

#### Implementation of

[`IConverterService`](../interfaces/IConverterService.md).[`useToKilometers`](../interfaces/IConverterService.md#usetokilometers)

***

### useToKilos()

> **useToKilos**(`pounds`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:92](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L92)

#### Parameters

##### pounds

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### digits?

`number` = `2`

#### Returns

`string`

#### Implementation of

[`IConverterService`](../interfaces/IConverterService.md).[`useToKilos`](../interfaces/IConverterService.md#usetokilos)

***

### useToMiles()

> **useToMiles**(`km`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:83](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L83)

#### Parameters

##### km

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### digits?

`number` = `2`

#### Returns

`string`

#### Implementation of

[`IConverterService`](../interfaces/IConverterService.md).[`useToMiles`](../interfaces/IConverterService.md#usetomiles)

***

### useToPounds()

> **useToPounds**(`kilos`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:95](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L95)

#### Parameters

##### kilos

`number`

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### digits?

`number` = `2`

#### Returns

`string`

#### Implementation of

[`IConverterService`](../interfaces/IConverterService.md).[`useToPounds`](../interfaces/IConverterService.md#usetopounds)

***

### getInstance()

> `static` **getInstance**(): `ConverterService`

Defined in: [src/core/services/formatter.service.ts:67](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/core/services/formatter.service.ts#L67)

#### Returns

`ConverterService`
