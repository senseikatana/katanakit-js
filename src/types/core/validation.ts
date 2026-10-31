import type { z } from "zod";

import { FieldErrorsSchema, ValidationIssueSchema } from "@/schemas/core.schema.js";

/** A single field-level validation message keyed by field name. */
export type FieldErrors = z.infer<typeof FieldErrorsSchema>;

/** Minimal issue shape (`error.issues` entries). */
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

/** Minimal Zod-like success/failure result (`schema.safeParse`). */
export type ValidationParseResult<T> =
	{ success: true; data: T } | { success: false; error: { issues: ValidationIssue[] } };

/**
 * Schema-agnostic contract. Accepts Zod (`safeParse`), Valibot
 * (`safeParse`), Standard Schema (`~standard.validate`), Yup
 * (`validateSync`) or any object exposing one of those members.
 */
export interface ValidationSchema<T = unknown> {
	safeParse?: (data: unknown) => ValidationParseResult<T>;
	"~standard"?: {
		validate: (
			data: unknown,
		) => { issues?: ValidationIssue[] } | Promise<{ issues?: ValidationIssue[] }>;
	};
	validateSync?: (data: unknown) => unknown;
	validate?: (data: unknown) => unknown | Promise<unknown>;
}
