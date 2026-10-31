import type { z } from "zod";

import { SerializedErrorSchema } from "@/schemas/common.schema.js";

/** Serialized error shape. */
export type ISerializedError = z.infer<typeof SerializedErrorSchema>;
