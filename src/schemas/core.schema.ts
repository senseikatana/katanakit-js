import { z } from "zod";

import { AiToolCallSchema } from "./ai.schema.js";
import { LocaleSchema } from "./common.schema.js";

/** Represents a geographic position with latitude, longitude and accuracy. */
export const GeoPositionSchema = z.object({
	lat: z.number(),
	lng: z.number(),
	accuracy: z.number(),
});

/** Supported ISO currency codes. */
export const CurrencySchema = z.enum([
	"EUR",
	"USD",
	"GBP",
	"JPY",
	"CAD",
	"MXN",
	"CHF",
	"AUD",
	"BRL",
	"CNY",
	"ARS",
	"COP",
	"CLP",
]);

/** Options for currency formatting. */
export const CurrencyFormatOptionsSchema = z.object({
	amount: z.number(),
	currency: CurrencySchema.optional(),
	/**
	 * Tax rate: percentage when `> 1` (e.g. `21` → 21%), or decimal fraction
	 * when in `(0, 1]` (e.g. `0.21` → 21%). Prefer a fraction for rates ≤ 1%.
	 */
	taxes: z.number().optional(),
	locale: LocaleSchema.optional(),
});

/** Options for plain number formatting. */
export const NumberFormatOptionsSchema = z.object({
	locale: LocaleSchema.optional(),
	digits: z.number().int().nonnegative().optional(),
});

/** Date format parts (subset of `Intl.DateTimeFormatOptions`). */
export const AppDateFormatOptionsSchema = z.object({
	year: z.enum(["numeric", "2-digit"]).optional(),
	month: z.enum(["numeric", "2-digit", "long", "short", "narrow"]).optional(),
	day: z.enum(["numeric", "2-digit"]).optional(),
});

/** Options for number formatting in geometry calculations. */
export const GeometryFormatOptionsSchema = z.object({
	locale: z.string().optional(),
	digits: z.number().int().nonnegative().optional(),
	unit: z.string().optional(),
});

/** Represents viewport dimensions. */
export const ViewportSizeSchema = z.object({
	width: z.number(),
	height: z.number(),
});

/** Represents scroll position. */
export const ScrollPositionSchema = z.object({
	x: z.number(),
	y: z.number(),
});

/** Internal registry entry for lazy loading configurations. */
export const LazyLoaderEntrySchema = z.object({
	selector: z.string().min(1),
	observerKey: z.string().min(1),
});

/** Safe error returned on non-2xx or network failures (AI boundary). */
export const AiErrorSchema = z.object({
	message: z.string(),
	status: z.number(),
	details: z.unknown().optional(),
});

/** One round of tool execution inside the agent loop. */
export const AgentStepSchema = z.object({
	toolCalls: z.array(AiToolCallSchema),
	toolResults: z.array(z.unknown()),
});

/** Payload returned by a successful `useRunAgent` call. */
export const AgentDataSchema = z.object({
	finalMessage: z.string(),
	steps: z.array(AgentStepSchema),
});

/** Payload returned by a successful assistant reply. */
export const AssistantReplySchema = z.object({
	reply: z.string(),
	sessionId: z.string().min(1),
});

/** A single field-level validation message keyed by field name. */
export const FieldErrorsSchema = z.record(z.string(), z.string());

/** Minimal issue shape (`error.issues` entries). */
export const ValidationIssueSchema = z.object({
	path: z.array(z.union([z.string(), z.number()])),
	message: z.string(),
});

/** Demo product shape (Express adapter). */
export const ProductTypeSchema = z.object({
	id: z.number(),
	name: z.string(),
	price: z.number(),
});

/** Error shape for Astro content operations. */
export const AstroServiceErrorSchema = z.object({
	message: z.string(),
	collectionName: z.string().optional(),
	details: z.unknown().optional(),
});
