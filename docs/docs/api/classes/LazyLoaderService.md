# Class: LazyLoaderService

Defined in: [src/infrastructure/observer/observer.service.ts:128](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L128)

Singleton service for lazy loading images using IntersectionObserver.

## Methods

### useHas()

> **useHas**(`key`): `boolean`

Defined in: [src/infrastructure/observer/observer.service.ts:186](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L186)

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### useInit()

> **useInit**(`key?`, `selector?`, `rootMargin?`): `this`

Defined in: [src/infrastructure/observer/observer.service.ts:141](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L141)

#### Parameters

##### key?

`string` = `"default"`

##### selector?

`string` = `"img[data-src]"`

##### rootMargin?

`string` = `"200px"`

#### Returns

`this`

***

### useStop()

> **useStop**(`key`): `this`

Defined in: [src/infrastructure/observer/observer.service.ts:170](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L170)

#### Parameters

##### key

`string`

#### Returns

`this`

***

### useStopAll()

> **useStopAll**(): `this`

Defined in: [src/infrastructure/observer/observer.service.ts:179](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L179)

#### Returns

`this`

***

### getInstance()

> `static` **getInstance**(): `LazyLoaderService`

Defined in: [src/infrastructure/observer/observer.service.ts:134](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/observer/observer.service.ts#L134)

#### Returns

`LazyLoaderService`
