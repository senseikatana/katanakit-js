# Class: DomService

Defined in: [src/infrastructure/dom/dom.service.ts:6](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L6)

Contract of the DOM facade.

## Implements

- [`IDomService`](../interfaces/IDomService.md)

## Properties

### useQuerySelector

> **useQuerySelector**: \{&lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\] \| `null`; &lt;`E`&gt;(`selector`): `E` \| `null`; \}

Defined in: [src/infrastructure/dom/dom.service.ts:48](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L48)

#### Call Signature

> &lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\] \| `null`

##### Type Parameters

###### K

`K` *extends* keyof `HTMLElementTagNameMap`

##### Parameters

###### selector

`K`

##### Returns

`HTMLElementTagNameMap`\[`K`\] \| `null`

#### Call Signature

> &lt;`E`&gt;(`selector`): `E` \| `null`

##### Type Parameters

###### E

`E` *extends* `Element` = `HTMLElement`

##### Parameters

###### selector

`string`

##### Returns

`E` \| `null`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useQuerySelector`](../interfaces/IDomService.md#usequeryselector)

***

### useQuerySelectorAll

> **useQuerySelectorAll**: \{&lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\][]; &lt;`E`&gt;(`selector`): `E`[]; \}

Defined in: [src/infrastructure/dom/dom.service.ts:56](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L56)

#### Call Signature

> &lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\][]

##### Type Parameters

###### K

`K` *extends* keyof `HTMLElementTagNameMap`

##### Parameters

###### selector

`K`

##### Returns

`HTMLElementTagNameMap`\[`K`\][]

#### Call Signature

> &lt;`E`&gt;(`selector`): `E`[]

##### Type Parameters

###### E

`E` *extends* `Element` = `HTMLElement`

##### Parameters

###### selector

`string`

##### Returns

`E`[]

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useQuerySelectorAll`](../interfaces/IDomService.md#usequeryselectorall)

## Methods

### useAddClass()

> **useAddClass**(`target`, `className`): `void`

Defined in: [src/infrastructure/dom/dom.service.ts:64](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L64)

#### Parameters

##### target

`string` \| `Element`

##### className

`string`

#### Returns

`void`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useAddClass`](../interfaces/IDomService.md#useaddclass)

***

### useAppend()

> **useAppend**(`target`, `child`): `void`

Defined in: [src/infrastructure/dom/dom.service.ts:155](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L155)

#### Parameters

##### target

`string` \| `Element`

##### child

`string` \| `Element`

#### Returns

`void`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useAppend`](../interfaces/IDomService.md#useappend)

***

### useCreateElement()

> **useCreateElement**&lt;`T`&gt;(`tagName`, `options?`): `HTMLElementTagNameMap`\[`T`\]

Defined in: [src/infrastructure/dom/dom.service.ts:130](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L130)

#### Type Parameters

##### T

`T` *extends* keyof `HTMLElementTagNameMap`

#### Parameters

##### tagName

`T`

##### options?

`ElementCreationOptions`

#### Returns

`HTMLElementTagNameMap`\[`T`\]

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useCreateElement`](../interfaces/IDomService.md#usecreateelement)

***

### useGetAttribute()

> **useGetAttribute**(`target`, `attr`): `string` \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:90](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L90)

#### Parameters

##### target

`string` \| `Element`

##### attr

`string`

#### Returns

`string` \| `null`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useGetAttribute`](../interfaces/IDomService.md#usegetattribute)

***

### useGetBody()

> **useGetBody**(): `HTMLBodyElement` \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:26](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L26)

#### Returns

`HTMLBodyElement` \| `null`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useGetBody`](../interfaces/IDomService.md#usegetbody)

***

### useGetDataAttribute()

> **useGetDataAttribute**(`target`, `key`): `string` \| `undefined`

Defined in: [src/infrastructure/dom/dom.service.ts:106](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L106)

#### Parameters

##### target

`string` \| `HTMLElement`

##### key

`string`

#### Returns

`string` \| `undefined`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useGetDataAttribute`](../interfaces/IDomService.md#usegetdataattribute)

***

### useGetElementByClass()

> **useGetElementByClass**&lt;`T`&gt;(`className`): `T` \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:40](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L40)

#### Type Parameters

##### T

`T` *extends* `HTMLElement` = `HTMLElement`

#### Parameters

##### className

`string`

#### Returns

`T` \| `null`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useGetElementByClass`](../interfaces/IDomService.md#usegetelementbyclass)

***

### useGetElementById()

> **useGetElementById**&lt;`T`&gt;(`id`): `T` \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:35](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L35)

#### Type Parameters

##### T

`T` *extends* `HTMLElement` = `HTMLElement`

#### Parameters

##### id

`string`

#### Returns

`T` \| `null`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useGetElementById`](../interfaces/IDomService.md#usegetelementbyid)

***

### useGetRoot()

> **useGetRoot**(): `HTMLElement` \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:21](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L21)

#### Returns

`HTMLElement` \| `null`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useGetRoot`](../interfaces/IDomService.md#usegetroot)

***

### useHasClass()

> **useHasClass**(`target`, `className`): `boolean`

Defined in: [src/infrastructure/dom/dom.service.ts:86](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L86)

#### Parameters

##### target

`string` \| `Element`

##### className

`string`

#### Returns

`boolean`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useHasClass`](../interfaces/IDomService.md#usehasclass)

***

### useIsBrowser()

> **useIsBrowser**(): `boolean`

Defined in: [src/infrastructure/dom/dom.service.ts:18](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L18)

#### Returns

`boolean`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useIsBrowser`](../interfaces/IDomService.md#useisbrowser)

***

### useOn()

> **useOn**&lt;`K`&gt;(`target`, `event`, `callback`, `options?`): (() => `void`) \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:115](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L115)

#### Type Parameters

##### K

`K` *extends* keyof `HTMLElementEventMap`

#### Parameters

##### target

`string` \| `EventTarget`

##### event

`K`

##### callback

(`event`) => `void`

##### options?

`boolean` \| `AddEventListenerOptions`

#### Returns

(() => `void`) \| `null`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useOn`](../interfaces/IDomService.md#useon)

***

### useRemove()

> **useRemove**(`target`): `void`

Defined in: [src/infrastructure/dom/dom.service.ts:161](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L161)

#### Parameters

##### target

`string` \| `Element`

#### Returns

`void`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useRemove`](../interfaces/IDomService.md#useremove)

***

### useRemoveAttribute()

> **useRemoveAttribute**(`target`, `attr`): `void`

Defined in: [src/infrastructure/dom/dom.service.ts:102](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L102)

#### Parameters

##### target

`string` \| `Element`

##### attr

`string`

#### Returns

`void`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useRemoveAttribute`](../interfaces/IDomService.md#useremoveattribute)

***

### useRemoveClass()

> **useRemoveClass**(`target`, `className`): `void`

Defined in: [src/infrastructure/dom/dom.service.ts:68](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L68)

#### Parameters

##### target

`string` \| `Element`

##### className

`string` \| `string`[]

#### Returns

`void`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useRemoveClass`](../interfaces/IDomService.md#useremoveclass)

***

### useSetAttribute()

> **useSetAttribute**(`target`, `attr`, `value`): `void`

Defined in: [src/infrastructure/dom/dom.service.ts:94](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L94)

#### Parameters

##### target

`string` \| `Element`

##### attr

`string`

##### value

`string`

#### Returns

`void`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useSetAttribute`](../interfaces/IDomService.md#usesetattribute)

***

### useSetDataAttribute()

> **useSetDataAttribute**(`target`, `key`, `value`): `void`

Defined in: [src/infrastructure/dom/dom.service.ts:110](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L110)

#### Parameters

##### target

`string` \| `HTMLElement`

##### key

`string`

##### value

`string`

#### Returns

`void`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useSetDataAttribute`](../interfaces/IDomService.md#usesetdataattribute)

***

### useSetHtml()

> **useSetHtml**(`target`, `html`): `void`

Defined in: [src/infrastructure/dom/dom.service.ts:145](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L145)

Sets innerHTML on the target element.
WARNING: this is an XSS sink. Only pass trusted HTML. For user-supplied
content, use `useSetText` (textContent) instead, or sanitize with DOMPurify.

#### Parameters

##### target

`string` \| `Element`

##### html

`string`

#### Returns

`void`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useSetHtml`](../interfaces/IDomService.md#usesethtml)

***

### useSetText()

> **useSetText**(`target`, `text`): `void`

Defined in: [src/infrastructure/dom/dom.service.ts:150](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L150)

#### Parameters

##### target

`string` \| `Element`

##### text

`string`

#### Returns

`void`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useSetText`](../interfaces/IDomService.md#usesettext)

***

### useToggleClass()

> **useToggleClass**(`target`, `className`, `force?`): `boolean` \| `undefined`

Defined in: [src/infrastructure/dom/dom.service.ts:78](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L78)

#### Parameters

##### target

`string` \| `Element`

##### className

`string`

##### force?

`boolean`

#### Returns

`boolean` \| `undefined`

#### Implementation of

[`IDomService`](../interfaces/IDomService.md).[`useToggleClass`](../interfaces/IDomService.md#usetoggleclass)

***

### getInstance()

> `static` **getInstance**(): `DomService`

Defined in: [src/infrastructure/dom/dom.service.ts:11](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L11)

#### Returns

`DomService`
