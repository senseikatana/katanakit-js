# Interface: PathsOptions&lt;T, TParam, TProps&gt;

Defined in: [src/types/index.ts:512](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L512)

## Type Parameters

### T

`T`

### TParam

`TParam` *extends* `string` = `string`

### TProps

`TProps` = `T`

## Properties

### param?

> `optional` **param?**: `TParam`

Defined in: [src/types/index.ts:513](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L513)

***

### paramsFrom?

> `optional` **paramsFrom?**: (`item`) => `Record`&lt;`string`, `string`&gt;

Defined in: [src/types/index.ts:516](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L516)

#### Parameters

##### item

`T`

#### Returns

`Record`&lt;`string`, `string`&gt;

***

### propsFrom?

> `optional` **propsFrom?**: (`item`) => `TProps`

Defined in: [src/types/index.ts:515](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L515)

#### Parameters

##### item

`T`

#### Returns

`TProps`

***

### valueFrom?

> `optional` **valueFrom?**: (`item`) => `string` \| `number`

Defined in: [src/types/index.ts:514](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/types/index.ts#L514)

#### Parameters

##### item

`T`

#### Returns

`string` \| `number`
