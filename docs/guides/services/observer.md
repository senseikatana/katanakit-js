---
title: Observer
description: "Create and manage Intersection, Resize and Mutation observers."
---

# Observer

```ts
import { ObserverService } from "katanakit-js";

const observer = ObserverService.getInstance();

observer.useCreate("reveal", (entry) => {
  if (entry.isIntersecting) {
    console.log("Element is visible!", entry.target);
  }
}, { threshold: 0.5 });

observer.useObserve("reveal", document.querySelector(".card")!);
observer.useObserveAll("reveal", ".lazy-img");
observer.useDisconnect("reveal");
// or: observer.useDisconnectAll();
```

---
