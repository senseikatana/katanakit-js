import type { FieldErrors } from "./validation.js";

/**
 * Outcome of validating a native form: the parsed values, or the per-field
 * messages that blocked them. Both shapes carry `errors` so the caller can
 * render an empty map on success without a branch.
 */
export type FormValidation<T> =
	{ ok: true; values: T; errors: FieldErrors } | { ok: false; values: null; errors: FieldErrors };

/**
 * Receives the parsed, typed values once validation passes. May be async;
 * the adapters keep the submit button busy until it settles.
 */
export type FormSubmitHandler<T> = (values: T) => void | Promise<void>;

/**
 * Flat `name` → value map read from a native `FormData`, with dotted names
 * expanded into nested objects (`"address.city"` → `{ address: { city } }`)
 * so field names line up with a nested Zod schema.
 */
export type FormDataValues = Record<string, unknown>;
