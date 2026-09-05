# Variable: useSetHtml

> **useSetHtml**: (`target`, `html`) => `void`

Defined in: [src/infrastructure/dom/dom.service.ts:188](https://github.com/senseikatana/katanakit-js/blob/671263249d5f5da09ae01d788489a7d1f8f3c5fc/src/infrastructure/dom/dom.service.ts#L188)

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
