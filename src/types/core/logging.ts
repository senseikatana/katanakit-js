import type { z } from "zod";

import { LogLevelSchema } from "@/schemas/common.schema.js";

/** Native console methods used as log levels. */
export type LogLevel = z.infer<typeof LogLevelSchema>;
