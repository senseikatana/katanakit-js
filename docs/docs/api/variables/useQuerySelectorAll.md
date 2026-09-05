# Variable: useQuerySelectorAll

> **useQuerySelectorAll**: \{&lt;`K`&gt;(`selector`): `HTMLElementTagNameMap`\[`K`\][]; &lt;`E`&gt;(`selector`): `E`[]; \}

Defined in: [src/infrastructure/dom/dom.service.ts:176](https://github.com/senseikatana/katanakit-js/blob/5e558a8367455e6129bb2647b2f6a540281bfea4/src/infrastructure/dom/dom.service.ts#L176)

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
