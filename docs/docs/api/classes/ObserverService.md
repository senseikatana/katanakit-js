# Class: ObserverService

Defined in: [src/infrastructure/observer/observer.service.ts:14](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L14)

Singleton wrapper around the native IntersectionObserver API.

## Methods

### useCreate()

> **useCreate**(`key`, `callback`, `options?`, `autoUnobserve?`): `this`

Defined in: [src/infrastructure/observer/observer.service.ts:31](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L31)

#### Parameters

##### key

`string`

##### callback

[`ObserverCallback`](../type-aliases/ObserverCallback.md)

##### options?

`IntersectionObserverInit` = `...`

##### autoUnobserve?

`boolean` = `true`

#### Returns

`this`

***

### useDisconnect()

> **useDisconnect**(`key`): `this`

Defined in: [src/infrastructure/observer/observer.service.ts:99](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L99)

#### Parameters

##### key

`string`

#### Returns

`this`

***

### useDisconnectAll()

> **useDisconnectAll**(): `this`

Defined in: [src/infrastructure/observer/observer.service.ts:109](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L109)

#### Returns

`this`

***

### useHas()

> **useHas**(`key`): `boolean`

Defined in: [src/infrastructure/observer/observer.service.ts:116](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L116)

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### useKeys()

> **useKeys**(): `string`[]

Defined in: [src/infrastructure/observer/observer.service.ts:120](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L120)

#### Returns

`string`[]

***

### useObserve()

> **useObserve**(`key`, `element`): `this`

Defined in: [src/infrastructure/observer/observer.service.ts:67](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L67)

#### Parameters

##### key

`string`

##### element

[`ObserverTarget`](../type-aliases/ObserverTarget.md)

#### Returns

`this`

***

### useObserveAll()

> **useObserveAll**(`key`, `selector`): `this`

Defined in: [src/infrastructure/observer/observer.service.ts:82](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L82)

#### Parameters

##### key

`string`

##### selector

`string`

#### Returns

`this`

***

### useUnobserve()

> **useUnobserve**(`key`, `element`): `this`

Defined in: [src/infrastructure/observer/observer.service.ts:90](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L90)

#### Parameters

##### key

`string`

##### element

`HTMLElement`

#### Returns

`this`

***

### getInstance()

> `static` **getInstance**(): `ObserverService`

Defined in: [src/infrastructure/observer/observer.service.ts:20](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L20)

#### Returns

`ObserverService`

***

### useIsSupported()

> `static` **useIsSupported**(): `boolean`

Defined in: [src/infrastructure/observer/observer.service.ts:27](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L27)

#### Returns

`boolean`
