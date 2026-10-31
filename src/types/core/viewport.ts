import type { z } from "zod";

import { ScrollPositionSchema, ViewportSizeSchema } from "@/schemas/core.schema.js";

/** Represents viewport dimensions. */
export type ViewportSize = z.infer<typeof ViewportSizeSchema>;

/** Represents scroll position. */
export type ScrollPosition = z.infer<typeof ScrollPositionSchema>;

/** Options for scrolling operations. */
export interface ScrollOptions {
	behavior?: ScrollBehavior;
	block?: ScrollLogicalPosition;
	inline?: ScrollLogicalPosition;
}
