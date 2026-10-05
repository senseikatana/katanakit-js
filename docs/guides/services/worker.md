---
title: Worker
description: "Spawn workers, run functions off-thread and manage worker pools."
---

# Worker

```ts
import { WorkerService } from "katanakit-js";

const workers = WorkerService.getInstance();

// One-shot: pure function + input (runs off-thread when Worker is available)
const result = await workers.useRun((n: number) => n * 2, 21);
console.log(result); // 42

// Named pool
workers.useCreatePool("square", (n: number) => n ** 2);
const squared = await workers.useRunPool<number, number>("square", 9);
workers.useTerminate("square");
```

---
