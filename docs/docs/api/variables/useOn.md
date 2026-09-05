# Variable: useOn

> **useOn**: &lt;`K`&gt;(`target`, `event`, `callback`, `options?`) => (() => `void`) \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:186](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/infrastructure/dom/dom.service.ts#L186)

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
