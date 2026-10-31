import type { z } from "zod";

import { GeometryFormatOptionsSchema } from "@/schemas/core.schema.js";

/** Options for number formatting in geometry calculations. */
export type GeometryFormatOptions = z.infer<typeof GeometryFormatOptionsSchema>;
