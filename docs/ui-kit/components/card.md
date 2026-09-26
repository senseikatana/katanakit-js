---
title: Card
description: Surface container with optional header, body children and footer.
---

# Card

`useCard(options)` creates an `<article class="kk-card">` with optional header, body
and footer. `useCardClass(options)` returns the classes for SSR markup.

## Demo

<div ref="cards" class="kk-demo-grid"></div>

```ts
import { useCard } from "@katanakit/ui";

grid.append(
  useCard({ title: "Revenue", children: ["$12,400"], footer: "Updated 5 min ago" }),
  useCard({ title: "Churn", children: ["2.1%"], elevated: true }),
);
```

## Options

| Option     | Type                  | Default | Notes                                    |
| ---------- | --------------------- | ------- | ---------------------------------------- |
| `title`    | `string`              | —       | Renders `.kk-card__header` + title.       |
| `children` | `Array<Node \| string>` | `[]`    | Appended to `.kk-card__body`.             |
| `footer`   | `string`              | —       | Renders `.kk-card__footer`.               |
| `elevated` | `boolean`             | `false` | Replaces the border with a shadow.        |

::: info Composition
Cards are plain containers: put any node (table, form, chart) in `children`.
The kit never owns the data — bind it to Safe Results from `katanakit-js`.
:::

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useCard } from "@katanakit/ui";

const cards = ref<HTMLElement>();

onMounted(() => {
	cards.value?.append(
		useCard({ title: "Revenue", children: ["$12,400"], footer: "Updated 5 min ago" }),
		useCard({ title: "Churn", children: ["2.1%"], elevated: true }),
		useCard({ title: "Open tickets", children: ["18"] }),
	);
});
</script>
