---
title: Error helpers
description: "Turn unknown throws into stable errors: attempt, JSON parsing, normalize and serialize."
---

# Error helpers

```ts
import {
  useErrorSerialize, useErrorCustom,
  useErrorNormalize, useAttempt, useLogger,
} from "katanakit-js";

// Serialize a plain error object (defaults come from the status code)
useErrorSerialize("User not found", 404); // { message: "User not found", code: 404 }
useErrorSerialize("", 500);               // { message: "Internal Server Error", code: 500 }

// Alias with the same shape, handy for logging
const err = useErrorCustom("Validation failed", 422);
useLogger(err.message, err, "error");

// Normalize any thrown value into the shared ApiError shape
const result = await useAttempt(() => sdk.call());
if (!result.ok) console.error(result.error.status, result.error.message);
```

`useErrorNormalize()` is the default mapper behind `useAttempt()`; see
[Error Handling](/guides/errors) for the full Safe Result contract.

---
