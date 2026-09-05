# Class: ViewportService

Defined in: [src/infrastructure/viewport/viewport.service.ts:6](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L6)

Viewport, scroll and window utilities. All methods are SSR-safe.

## Methods

### useBlurActiveElement()

> **useBlurActiveElement**(): `void`

Defined in: [src/infrastructure/viewport/viewport.service.ts:117](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L117)

#### Returns

`void`

***

### useExitFullscreen()

> **useExitFullscreen**(): `Promise`&lt;`void`&gt;

Defined in: [src/infrastructure/viewport/viewport.service.ts:134](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L134)

#### Returns

`Promise`&lt;`void`&gt;

***

### useFocusElement()

> **useFocusElement**(`target`): `boolean`

Defined in: [src/infrastructure/viewport/viewport.service.ts:106](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L106)

#### Parameters

##### target

`string` \| `HTMLElement`

#### Returns

`boolean`

***

### useGetActiveElement()

> **useGetActiveElement**(): `Element` \| `null`

Defined in: [src/infrastructure/viewport/viewport.service.ts:122](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L122)

#### Returns

`Element` \| `null`

***

### useGetScrollPosition()

> **useGetScrollPosition**(): [`ScrollPosition`](../interfaces/ScrollPosition.md)

Defined in: [src/infrastructure/viewport/viewport.service.ts:40](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L40)

#### Returns

[`ScrollPosition`](../interfaces/ScrollPosition.md)

***

### useGetScrollProgress()

> **useGetScrollProgress**(): `number`

Defined in: [src/infrastructure/viewport/viewport.service.ts:45](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L45)

#### Returns

`number`

***

### useGetScrollX()

> **useGetScrollX**(): `number`

Defined in: [src/infrastructure/viewport/viewport.service.ts:38](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L38)

#### Returns

`number`

***

### useGetScrollY()

> **useGetScrollY**(): `number`

Defined in: [src/infrastructure/viewport/viewport.service.ts:36](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L36)

#### Returns

`number`

***

### useGetTitle()

> **useGetTitle**(): `string`

Defined in: [src/infrastructure/viewport/viewport.service.ts:155](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L155)

#### Returns

`string`

***

### useGetViewportSize()

> **useGetViewportSize**(): [`ViewportSize`](../interfaces/ViewportSize.md)

Defined in: [src/infrastructure/viewport/viewport.service.ts:21](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L21)

#### Returns

[`ViewportSize`](../interfaces/ViewportSize.md)

***

### useIsAtBottom()

> **useIsAtBottom**(`threshold?`): `boolean`

Defined in: [src/infrastructure/viewport/viewport.service.ts:54](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L54)

#### Parameters

##### threshold?

`number` = `50`

#### Returns

`boolean`

***

### useIsAtTop()

> **useIsAtTop**(`threshold?`): `boolean`

Defined in: [src/infrastructure/viewport/viewport.service.ts:52](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L52)

#### Parameters

##### threshold?

`number` = `0`

#### Returns

`boolean`

***

### useIsDocumentVisible()

> **useIsDocumentVisible**(): `boolean`

Defined in: [src/infrastructure/viewport/viewport.service.ts:141](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L141)

#### Returns

`boolean`

***

### useIsFullscreen()

> **useIsFullscreen**(): `boolean`

Defined in: [src/infrastructure/viewport/viewport.service.ts:139](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L139)

#### Returns

`boolean`

***

### useMatchesMedia()

> **useMatchesMedia**(`query`): `boolean`

Defined in: [src/infrastructure/viewport/viewport.service.ts:26](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L26)

#### Parameters

##### query

`string`

#### Returns

`boolean`

***

### useOnVisibilityChange()

> **useOnVisibilityChange**(`callback`): () => `void`

Defined in: [src/infrastructure/viewport/viewport.service.ts:146](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L146)

#### Parameters

##### callback

(`isVisible`) => `void`

#### Returns

() => `void`

***

### usePrefersDarkMode()

> **usePrefersDarkMode**(): `boolean`

Defined in: [src/infrastructure/viewport/viewport.service.ts:34](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L34)

#### Returns

`boolean`

***

### usePrefersReducedMotion()

> **usePrefersReducedMotion**(): `boolean`

Defined in: [src/infrastructure/viewport/viewport.service.ts:31](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L31)

#### Returns

`boolean`

***

### usePrintPage()

> **usePrintPage**(): `void`

Defined in: [src/infrastructure/viewport/viewport.service.ts:102](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L102)

#### Returns

`void`

***

### useRequestFullscreen()

> **useRequestFullscreen**(`target?`): `Promise`&lt;`void`&gt;

Defined in: [src/infrastructure/viewport/viewport.service.ts:125](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L125)

#### Parameters

##### target?

`HTMLElement`

#### Returns

`Promise`&lt;`void`&gt;

***

### useScrollTo()

> **useScrollTo**(`x?`, `y?`, `behavior?`): `void`

Defined in: [src/infrastructure/viewport/viewport.service.ts:60](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L60)

#### Parameters

##### x?

`number` = `0`

##### y?

`number` = `0`

##### behavior?

`ScrollBehavior` = `"smooth"`

#### Returns

`void`

***

### useScrollToBottom()

> **useScrollToBottom**(`smooth?`): `void`

Defined in: [src/infrastructure/viewport/viewport.service.ts:72](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L72)

#### Parameters

##### smooth?

`boolean` = `true`

#### Returns

`void`

***

### useScrollToElement()

> **useScrollToElement**(`target`, `options?`): `boolean`

Defined in: [src/infrastructure/viewport/viewport.service.ts:79](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L79)

#### Parameters

##### target

`string` \| `HTMLElement`

##### options?

[`ScrollOptions`](../interfaces/ScrollOptions.md) = `{}`

#### Returns

`boolean`

***

### useScrollToTop()

> **useScrollToTop**(`smooth?`): `void`

Defined in: [src/infrastructure/viewport/viewport.service.ts:66](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L66)

#### Parameters

##### smooth?

`boolean` = `true`

#### Returns

`void`

***

### useSetTempTitle()

> **useSetTempTitle**(`tempTitle`, `durationMs?`): `void`

Defined in: [src/infrastructure/viewport/viewport.service.ts:161](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L161)

#### Parameters

##### tempTitle

`string`

##### durationMs?

`number` = `3000`

#### Returns

`void`

***

### useSetTitle()

> **useSetTitle**(`title`): `void`

Defined in: [src/infrastructure/viewport/viewport.service.ts:157](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L157)

#### Parameters

##### title

`string`

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `ViewportService`

Defined in: [src/infrastructure/viewport/viewport.service.ts:11](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/viewport/viewport.service.ts#L11)

#### Returns

`ViewportService`
