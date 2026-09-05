# Interface: IDomService

Defined in: [src/types/index.ts:46](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L46)

Contract of the DOM facade.

## Methods

### useAddClass()

> **useAddClass**(`target`, `className`): `void`

Defined in: [src/types/index.ts:60](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L60)

#### Parameters

##### target

`string` \| `Element`

##### className

`string`

#### Returns

`void`

***

### useAppend()

> **useAppend**(`target`, `child`): `void`

Defined in: [src/types/index.ts:81](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L81)

#### Parameters

##### target

`string` \| `Element`

##### child

`string` \| `Element`

#### Returns

`void`

***

### useCreateElement()

> **useCreateElement**&lt;`T`&gt;(`tagName`, `options?`): `HTMLElementTagNameMap`\[`T`\]

Defined in: [src/types/index.ts:75](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L75)

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

***

### useGetAttribute()

> **useGetAttribute**(`target`, `attr`): `string` \| `null`

Defined in: [src/types/index.ts:64](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L64)

#### Parameters

##### target

`string` \| `Element`

##### attr

`string`

#### Returns

`string` \| `null`

***

### useGetBody()

> **useGetBody**(): `HTMLBodyElement` \| `null`

Defined in: [src/types/index.ts:49](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L49)

#### Returns

`HTMLBodyElement` \| `null`

***

### useGetDataAttribute()

> **useGetDataAttribute**(`target`, `key`): `string` \| `undefined`

Defined in: [src/types/index.ts:67](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L67)

#### Parameters

##### target

`string` \| `HTMLElement`

##### key

`string`

#### Returns

`string` \| `undefined`

***

### useGetElementByClass()

> **useGetElementByClass**&lt;`T`&gt;(`className`): `T` \| `null`

Defined in: [src/types/index.ts:51](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L51)

#### Type Parameters

##### T

`T` *extends* `HTMLElement` = `HTMLElement`

#### Parameters

##### className

`string`

#### Returns

`T` \| `null`

***

### useGetElementById()

> **useGetElementById**&lt;`T`&gt;(`id`): `T` \| `null`

Defined in: [src/types/index.ts:50](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L50)

#### Type Parameters

##### T

`T` *extends* `HTMLElement` = `HTMLElement`

#### Parameters

##### id

`string`

#### Returns

`T` \| `null`

***

### useGetRoot()

> **useGetRoot**(): `HTMLElement` \| `null`

Defined in: [src/types/index.ts:48](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L48)

#### Returns

`HTMLElement` \| `null`

***

### useHasClass()

> **useHasClass**(`target`, `className`): `boolean`

Defined in: [src/types/index.ts:63](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L63)

#### Parameters

##### target

`string` \| `Element`

##### className

`string`

#### Returns

`boolean`

***

### useIsBrowser()

> **useIsBrowser**(): `boolean`

Defined in: [src/types/index.ts:47](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L47)

#### Returns

`boolean`

***

### useOn()

> **useOn**&lt;`K`&gt;(`target`, `event`, `callback`, `options?`): (() => `void`) \| `null`

Defined in: [src/types/index.ts:69](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L69)

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

***

### useQuerySelector()

#### Call Signature

> **useQuerySelector**&lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\] \| `null`

Defined in: [src/types/index.ts:52](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L52)

##### Type Parameters

###### K

`K` *extends* keyof `HTMLElementTagNameMap`

##### Parameters

###### selector

`K`

##### Returns

`HTMLElementTagNameMap`\[`K`\] \| `null`

#### Call Signature

> **useQuerySelector**&lt;`E`&gt;(`selector`): `E` \| `null`

Defined in: [src/types/index.ts:55](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L55)

##### Type Parameters

###### E

`E` *extends* `Element` = `HTMLElement`

##### Parameters

###### selector

`string`

##### Returns

`E` \| `null`

***

### useQuerySelectorAll()

#### Call Signature

> **useQuerySelectorAll**&lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\][]

Defined in: [src/types/index.ts:56](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L56)

##### Type Parameters

###### K

`K` *extends* keyof `HTMLElementTagNameMap`

##### Parameters

###### selector

`K`

##### Returns

`HTMLElementTagNameMap`\[`K`\][]

#### Call Signature

> **useQuerySelectorAll**&lt;`E`&gt;(`selector`): `E`[]

Defined in: [src/types/index.ts:59](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L59)

##### Type Parameters

###### E

`E` *extends* `Element` = `HTMLElement`

##### Parameters

###### selector

`string`

##### Returns

`E`[]

***

### useRemove()

> **useRemove**(`target`): `void`

Defined in: [src/types/index.ts:82](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L82)

#### Parameters

##### target

`string` \| `Element`

#### Returns

`void`

***

### useRemoveAttribute()

> **useRemoveAttribute**(`target`, `attr`): `void`

Defined in: [src/types/index.ts:66](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L66)

#### Parameters

##### target

`string` \| `Element`

##### attr

`string`

#### Returns

`void`

***

### useRemoveClass()

> **useRemoveClass**(`target`, `className`): `void`

Defined in: [src/types/index.ts:61](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L61)

#### Parameters

##### target

`string` \| `Element`

##### className

`string` \| `string`[]

#### Returns

`void`

***

### useSetAttribute()

> **useSetAttribute**(`target`, `attr`, `value`): `void`

Defined in: [src/types/index.ts:65](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L65)

#### Parameters

##### target

`string` \| `Element`

##### attr

`string`

##### value

`string`

#### Returns

`void`

***

### useSetDataAttribute()

> **useSetDataAttribute**(`target`, `key`, `value`): `void`

Defined in: [src/types/index.ts:68](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L68)

#### Parameters

##### target

`string` \| `HTMLElement`

##### key

`string`

##### value

`string`

#### Returns

`void`

***

### useSetHtml()

> **useSetHtml**(`target`, `html`): `void`

Defined in: [src/types/index.ts:79](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L79)

#### Parameters

##### target

`string` \| `Element`

##### html

`string`

#### Returns

`void`

***

### useSetText()

> **useSetText**(`target`, `text`): `void`

Defined in: [src/types/index.ts:80](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L80)

#### Parameters

##### target

`string` \| `Element`

##### text

`string`

#### Returns

`void`

***

### useToggleClass()

> **useToggleClass**(`target`, `className`, `force?`): `boolean` \| `undefined`

Defined in: [src/types/index.ts:62](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L62)

#### Parameters

##### target

`string` \| `Element`

##### className

`string`

##### force?

`boolean`

#### Returns

`boolean` \| `undefined`
