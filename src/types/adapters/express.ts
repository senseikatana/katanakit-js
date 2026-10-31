import type { z } from "zod";

import { ProductTypeSchema } from "@/schemas/core.schema.js";

export type ProductType = z.infer<typeof ProductTypeSchema>;
