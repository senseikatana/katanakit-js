# Variable: useOn

> **useOn**: &lt;`K`&gt;(`target`, `event`, `callback`, `options?`) => (() => `void`) \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:186](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/dom/dom.service.ts#L186)

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
