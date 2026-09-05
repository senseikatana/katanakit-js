# Variable: useQuerySelector

> **useQuerySelector**: \{&lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\] \| `null`; &lt;`E`&gt;(`selector`): `E` \| `null`; \}

Defined in: [src/infrastructure/dom/dom.service.ts:175](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L175)

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
