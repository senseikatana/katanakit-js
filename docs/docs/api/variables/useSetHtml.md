# Variable: useSetHtml

> **useSetHtml**: (`target`, `html`) => `void`

Defined in: [src/infrastructure/dom/dom.service.ts:188](https://github.com/senseikatana/katanakit-js/blob/7b860163683b97d645cfebc80bef622aba3bde3a/src/infrastructure/dom/dom.service.ts#L188)

Sets innerHTML on the target element.
WARNING: this is an XSS sink. Only pass trusted HTML. For user-supplied
content, use `useSetText` (textContent) instead, or sanitize with DOMPurify.

## Parameters

### target

`string` \| `Element`

### html

`string`

## Returns

`void`
