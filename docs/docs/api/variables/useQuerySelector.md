# Variable: useQuerySelector

> **useQuerySelector**: \{&lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\] \| `null`; &lt;`E`&gt;(`selector`): `E` \| `null`; \}

Defined in: [src/infrastructure/dom/dom.service.ts:175](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/dom/dom.service.ts#L175)

## Call Signature

> &lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\] \| `null`

### Type Parameters

#### K

`K` *extends* keyof `HTMLElementTagNameMap`

### Parameters

#### selector

`K`

### Returns

`HTMLElementTagNameMap`\[`K`\] \| `null`

## Call Signature

> &lt;`E`&gt;(`selector`): `E` \| `null`

### Type Parameters

#### E

`E` *extends* `Element` = `HTMLElement`

### Parameters

#### selector

`string`

### Returns

`E` \| `null`
