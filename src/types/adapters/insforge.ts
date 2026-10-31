import type { z } from "zod";

import {
	IfConfigSchema,
	IfInsertRowsSchema,
	IfInvokeOptionsSchema,
	IfListOptionsSchema,
	IfOrderSchema,
	IfRpcCallSchema,
	IfStorageRefSchema,
	IfTableQuerySchema,
	IfUpdatePatchSchema,
	IfWriteQuerySchema,
} from "@/schemas/insforge.schema.js";

/**
 * Config for the InsForge adapter. InsForge is the database fallback
 * (primary data layer is Cloudflare); storage and edge functions
 * are also available through the same client.
 */
export type IfConfig = z.infer<typeof IfConfigSchema>;

/** Sort clause for table queries. */
export type IfOrder = z.infer<typeof IfOrderSchema>;

/** Options for a table read. Filters map to equality clauses. */
export type IfTableQuery = z.infer<typeof IfTableQuerySchema>;

/** Rows for insert (one or many). */
export type IfInsertRows = z.infer<typeof IfInsertRowsSchema>;

/** Patch for update (must be paired with filters — mass updates are refused). */
export type IfUpdatePatch = z.infer<typeof IfUpdatePatchSchema>;

/** Options for an update or delete. Filters are REQUIRED (no mass writes). */
export type IfWriteQuery = z.infer<typeof IfWriteQuerySchema>;

/** Postgres function (RPC) call. */
export type IfRpcCall = z.infer<typeof IfRpcCallSchema>;

/** Bucket + object key reference for storage operations. */
export type IfStorageRef = z.infer<typeof IfStorageRefSchema>;

/** Options for listing bucket objects. */
export type IfListOptions = z.infer<typeof IfListOptionsSchema>;

/** Edge function invocation. */
export type IfInvokeOptions = z.infer<typeof IfInvokeOptionsSchema>;
