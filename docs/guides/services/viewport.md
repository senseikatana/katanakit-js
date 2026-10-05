---
title: Viewport
description: "Viewport size, scroll position, media queries and prefers-* state."
---

# Viewport

```ts
import {
  useMatchesMedia, useScrollTo, useScrollToElement, usePrefersReducedMotion,
} from "katanakit-js";

useMatchesMedia("(min-width: 768px)");
useScrollTo(0, 0); // x, y
useScrollToElement("#section-2");
usePrefersReducedMotion();
```

---
