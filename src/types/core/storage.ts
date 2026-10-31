import type { z } from "zod";

import { StorageTargetSchema } from "@/schemas/common.schema.js";

export type StorageTarget = z.infer<typeof StorageTargetSchema>;

/** Strategy contract: homogeneous storage without `any`. */
export interface StorageStrategy {
	useGetItem<T = unknown>(key: string): T | null;
	useSetItem(key: string, value: unknown): void;
	useRemoveItem(key: string): void;
	useClear(): void;
}
