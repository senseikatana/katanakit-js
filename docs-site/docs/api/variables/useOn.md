# Variable: useOn

> **useOn**: &lt;`K`&gt;(`target`, `event`, `callback`, `options?`) => (() => `void`) \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:186](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L186)

## Type Parameters

### K

`K` *extends* keyof `HTMLElementEventMap`

## Parameters

### target

`string` \| `EventTarget`

### event

`K`

### callback

(`event`) => `void`

### options?

`boolean` \| `AddEventListenerOptions`

## Returns

(() => `void`) \| `null`
