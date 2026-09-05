# Variable: useOn

> **useOn**: &lt;`K`&gt;(`target`, `event`, `callback`, `options?`) => (() => `void`) \| `null`

Defined in: [src/infrastructure/dom/dom.service.ts:186](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/dom/dom.service.ts#L186)

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
