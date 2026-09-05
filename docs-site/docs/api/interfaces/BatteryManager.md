# Interface: BatteryManager

Defined in: [src/types/index.ts:97](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L97)

Type for the experimental Battery API.

## Extends

- `EventTarget`

## Properties

### charging

> **charging**: `boolean`

Defined in: [src/types/index.ts:98](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L98)

***

### chargingTime

> **chargingTime**: `number`

Defined in: [src/types/index.ts:99](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L99)

***

### dischargingTime

> **dischargingTime**: `number`

Defined in: [src/types/index.ts:100](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L100)

***

### level

> **level**: `number`

Defined in: [src/types/index.ts:101](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/types/index.ts#L101)

## Methods

### addEventListener()

#### Call Signature

> **addEventListener**(`type`, `callback`, `options?`): `void`

Defined in: docs-site/node\_modules/typescript/lib/lib.dom.d.ts:14380

The **`addEventListener()`** method of the EventTarget interface sets up a function that will be called whenever the specified event is delivered to the target.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

##### Parameters

###### type

`string`

###### callback

`EventListenerOrEventListenerObject` \| `null`

###### options?

`boolean` \| `AddEventListenerOptions`

##### Returns

`void`

##### Inherited from

`EventTarget.addEventListener`

#### Call Signature

> **addEventListener**(`type`, `listener`, `options?`): `void`

Defined in: node\_modules/bun-types/globals.d.ts:327

Adds a new handler for the `type` event. Any given `listener` is added only once per `type` and per `capture` option value.

If the `once` option is true, the `listener` is removed after the next time a `type` event is dispatched.

The `capture` option is not used by Node.js in any functional way other than tracking registered event listeners per the `EventTarget` specification.
Specifically, the `capture` option is used as part of the key when registering a `listener`.
Any individual `listener` may be added once with `capture = false`, and once with `capture = true`.

##### Parameters

###### type

`string`

###### listener

`EventListener` \| `EventListenerObject`

###### options?

`boolean` \| `AddEventListenerOptions`

##### Returns

`void`

##### Inherited from

`EventTarget.addEventListener`

***

### dispatchEvent()

#### Call Signature

> **dispatchEvent**(`event`): `boolean`

Defined in: docs-site/node\_modules/typescript/lib/lib.dom.d.ts:14386

The **`dispatchEvent()`** method of the EventTarget sends an Event to the object, (synchronously) invoking the affected event listeners in the appropriate order. The normal event processing rules (including the capturing and optional bubbling phase) also apply to events dispatched manually with dispatchEvent().

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

##### Parameters

###### event

`Event`

##### Returns

`boolean`

##### Inherited from

`EventTarget.dispatchEvent`

#### Call Signature

> **dispatchEvent**(`event`): `boolean`

Defined in: node\_modules/bun-types/globals.d.ts:333

Dispatches a synthetic event `event` to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

##### Parameters

###### event

`Event`

##### Returns

`boolean`

##### Inherited from

`EventTarget.dispatchEvent`

***

### removeEventListener()

#### Call Signature

> **removeEventListener**(`type`, `callback`, `options?`): `void`

Defined in: docs-site/node\_modules/typescript/lib/lib.dom.d.ts:14392

The **`removeEventListener()`** method of the EventTarget interface removes an event listener previously registered with EventTarget.addEventListener() from the target. The event listener to be removed is identified using a combination of the event type, the event listener function itself, and various optional options that may affect the matching process; see Matching event listeners for removal.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

##### Parameters

###### type

`string`

###### callback

`EventListenerOrEventListenerObject` \| `null`

###### options?

`boolean` \| `EventListenerOptions`

##### Returns

`void`

##### Inherited from

`EventTarget.removeEventListener`

#### Call Signature

> **removeEventListener**(`type`, `listener`, `options?`): `void`

Defined in: node\_modules/bun-types/globals.d.ts:335

Removes the event listener in target's event listener list with the same type, callback, and options.

##### Parameters

###### type

`string`

###### listener

`EventListener` \| `EventListenerObject`

###### options?

`boolean` \| `EventListenerOptions`

##### Returns

`void`

##### Inherited from

`EventTarget.removeEventListener`
