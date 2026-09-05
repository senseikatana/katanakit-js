# Variable: useQuerySelectorAll

> **useQuerySelectorAll**: \{&lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\][]; &lt;`E`&gt;(`selector`): `E`[]; \}

Defined in: [src/infrastructure/dom/dom.service.ts:176](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/dom/dom.service.ts#L176)

## Call Signature

> &lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\][]

### Type Parameters

#### K

`K` *extends* keyof `HTMLElementTagNameMap`

### Parameters

#### selector

`K`

### Returns

`HTMLElementTagNameMap`\[`K`\][]

## Call Signature

> &lt;`E`&gt;(`selector`): `E`[]

### Type Parameters

#### E

`E` *extends* `Element` = `HTMLElement`

### Parameters

#### selector

`string`

### Returns

`E`[]
