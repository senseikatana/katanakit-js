# Class: GeneratorService

Defined in: [src/core/services/generator.service.ts:47](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/generator.service.ts#L47)

Generator facade (Singleton + Strategy) for ids, slugs, tokens and hashing.

## Methods

### useEncrypt()

> **useEncrypt**(`plainText`, `salt?`): `Promise`&lt;`string`&gt;

Defined in: [src/core/services/generator.service.ts:95](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/generator.service.ts#L95)

#### Parameters

##### plainText

`string`

##### salt?

`string`

#### Returns

`Promise`&lt;`string`&gt;

***

### useNumericId()

> **useNumericId**(): `number`

Defined in: [src/core/services/generator.service.ts:66](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/generator.service.ts#L66)

#### Returns

`number`

***

### useSlugify()

> **useSlugify**(`text`): `string`

Defined in: [src/core/services/generator.service.ts:70](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/generator.service.ts#L70)

#### Parameters

##### text

`string`

#### Returns

`string`

***

### useToken()

> **useToken**(): `number`

Defined in: [src/core/services/generator.service.ts:86](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/generator.service.ts#L86)

#### Returns

`number`

***

### useUuid()

> **useUuid**(): `string`

Defined in: [src/core/services/generator.service.ts:68](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/generator.service.ts#L68)

#### Returns

`string`

***

### getInstance()

> `static` **getInstance**(): `GeneratorService`

Defined in: [src/core/services/generator.service.ts:59](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/core/services/generator.service.ts#L59)

#### Returns

`GeneratorService`
