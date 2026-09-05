# Class: ThemeService

Defined in: [src/infrastructure/theme/theme.service.ts:14](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L14)

Theme facade (Singleton) over the DOM and Storage, with a media-query listener.

## Implements

- [`IThemeService`](../interfaces/IThemeService.md)

## Methods

### useDestroyTheme()

> **useDestroyTheme**(): `void`

Defined in: [src/infrastructure/theme/theme.service.ts:85](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L85)

#### Returns

`void`

#### Implementation of

[`IThemeService`](../interfaces/IThemeService.md).[`useDestroyTheme`](../interfaces/IThemeService.md#usedestroytheme)

***

### useGetResolved()

> **useGetResolved**(): `"light"` \| `"dark"`

Defined in: [src/infrastructure/theme/theme.service.ts:63](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L63)

#### Returns

`"light"` \| `"dark"`

#### Implementation of

[`IThemeService`](../interfaces/IThemeService.md).[`useGetResolved`](../interfaces/IThemeService.md#usegetresolved)

***

### useGetThemeMode()

> **useGetThemeMode**(): [`ThemeMode`](../type-aliases/ThemeMode.md)

Defined in: [src/infrastructure/theme/theme.service.ts:61](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L61)

#### Returns

[`ThemeMode`](../type-aliases/ThemeMode.md)

#### Implementation of

[`IThemeService`](../interfaces/IThemeService.md).[`useGetThemeMode`](../interfaces/IThemeService.md#usegetthememode)

***

### useInitTheme()

> **useInitTheme**(`options?`): `void`

Defined in: [src/infrastructure/theme/theme.service.ts:38](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L38)

#### Parameters

##### options?

[`ThemeOptions`](../interfaces/ThemeOptions.md) = `{}`

#### Returns

`void`

#### Implementation of

[`IThemeService`](../interfaces/IThemeService.md).[`useInitTheme`](../interfaces/IThemeService.md#useinittheme)

***

### usePrefersColorScheme()

> **usePrefersColorScheme**(): `boolean`

Defined in: [src/infrastructure/theme/theme.service.ts:68](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L68)

#### Returns

`boolean`

#### Implementation of

[`IThemeService`](../interfaces/IThemeService.md).[`usePrefersColorScheme`](../interfaces/IThemeService.md#usepreferscolorscheme)

***

### useResetTheme()

> **useResetTheme**(): `void`

Defined in: [src/infrastructure/theme/theme.service.ts:78](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L78)

#### Returns

`void`

#### Implementation of

[`IThemeService`](../interfaces/IThemeService.md).[`useResetTheme`](../interfaces/IThemeService.md#useresettheme)

***

### useSetThemeMode()

> **useSetThemeMode**(`mode`): `void`

Defined in: [src/infrastructure/theme/theme.service.ts:53](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L53)

#### Parameters

##### mode

[`ThemeMode`](../type-aliases/ThemeMode.md)

#### Returns

`void`

#### Implementation of

[`IThemeService`](../interfaces/IThemeService.md).[`useSetThemeMode`](../interfaces/IThemeService.md#usesetthememode)

***

### useToggleTheme()

> **useToggleTheme**(): `void`

Defined in: [src/infrastructure/theme/theme.service.ts:73](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L73)

#### Returns

`void`

#### Implementation of

[`IThemeService`](../interfaces/IThemeService.md).[`useToggleTheme`](../interfaces/IThemeService.md#usetoggletheme)

***

### getInstance()

> `static` **getInstance**(): `ThemeService`

Defined in: [src/infrastructure/theme/theme.service.ts:27](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/theme/theme.service.ts#L27)

#### Returns

`ThemeService`
