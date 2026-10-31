import type {
	FieldErrors,
	FormDataValues,
	FormValidation,
	ValidationIssue,
	ValidationSchema,
} from "@/types/index.js";

/**
 * FormService - Singleton for native-form parsing and validation.
 *
 * The browser already collects values, validates inputs and reports them to
 * assistive tech; the missing piece is turning a `FormData` into the object a
 * schema expects and turning schema issues back into per-field messages. That
 * is all this service does — pure, no I/O, no framework — so the vanilla,
 * React, Vue or Astro adapter on top stays thin.
 *
 * Pairs with any {@link ValidationSchema}: Zod (`safeParse`), Valibot or a
 * Standard Schema object. Zod is the shape this repo ships for.
 */
export class FormService {
	private static instance: FormService;

	/** Constructor privado - enforce singleton. */
	private constructor() {}

	/**
	 * Returns the shared {@link FormService} instance (Singleton).
	 *
	 * @returns The singleton instance.
	 *
	 * @example
	 * ```ts
	 * const forms = FormService.getInstance();
	 * forms.useFormData(new FormData(event.currentTarget));
	 * ```
	 */
	static getInstance(): FormService {
		if (!FormService.instance) {
			FormService.instance = new FormService();
		}
		return FormService.instance;
	}

	/**
	 * Reads a native `FormData` into a plain object.
	 *
	 * Rules, chosen to match what the browser actually produces:
	 *
	 * - repeated names (checkbox groups, `multiple` selects) become arrays;
	 * - a lone `"on"` — the browser's value for a valueless checkbox — becomes
	 *   `true`, so `z.boolean()` works;
	 * - dotted names expand into nested objects (`"address.city"` →
	 *   `{ address: { city } }`), matching how Zod schemas read;
	 * - file inputs stay `File` objects.
	 *
	 * Unchecked checkboxes never reach `FormData`, so optional booleans need
	 * `.optional().default(false)` in the schema.
	 *
	 * @param data - The `FormData` collected from a form element.
	 * @returns A plain object ready for `schema.safeParse`.
	 *
	 * @example
	 * ```ts
	 * useFormData(new FormData(form)); // { email: "a@b.co", terms: true }
	 * ```
	 */
	useFormData(data: FormData): FormDataValues {
		const out: FormDataValues = {};
		for (const [key, value] of data.entries()) {
			const current = out[key];
			if (current === undefined) out[key] = value === "on" ? true : value;
			else if (Array.isArray(current)) current.push(value);
			else out[key] = [current, value];
		}

		// Expand dotted names into nested objects, in insertion order.
		const nested: FormDataValues = {};
		for (const [key, value] of Object.entries(out)) {
			if (!key.includes(".")) {
				nested[key] = value;
				continue;
			}
			const segments = key.replace(/^\.+|\.+$/g, "").split(".");
			let target = nested;
			for (let i = 0; i < segments.length - 1; i += 1) {
				const segment = segments[i];
				const next = target[segment];
				if (next === null || typeof next !== "object" || Array.isArray(next)) {
					target[segment] = {};
				}
				target = target[segment] as FormDataValues;
			}
			target[segments[segments.length - 1]] = value;
		}
		return nested;
	}

	/**
	 * Turns schema issues into one message per field.
	 *
	 * The first issue per path wins (the most specific message Zod emits), and
	 * a root-level issue — from `schema.refine(…)` — lands under `_form`.
	 *
	 * @param error - Anything with an `issues` array (a `ZodError` fits).
	 * @returns `{ fieldName: message }`, ready for the adapters to render.
	 *
	 * @example
	 * ```ts
	 * const parsed = schema.safeParse(raw);
	 * if (!parsed.success) useFieldErrors(parsed.error);
	 * // { email: "Invalid email", "address.city": "Required" }
	 * ```
	 */
	useFieldErrors(error: { issues?: ValidationIssue[] }): FieldErrors {
		const errors: FieldErrors = {};
		for (const issue of error.issues ?? []) {
			const name = issue.path.join(".") || "_form";
			if (name in errors) continue;
			errors[name] = issue.message;
		}
		return errors;
	}

	/**
	 * Validates a native form against a schema.
	 *
	 * Accepts the `FormData` itself (collected at submit time, so nothing is
	 * controlled) or an already-collected object.
	 *
	 * @typeParam T - The schema's output type (`z.infer`).
	 * @param schema - Any {@link ValidationSchema} exposing `safeParse`.
	 * @param data - `FormData` from the form, or a plain object of values.
	 * @returns {@link FormValidation} with typed values or field errors.
	 *
	 * @example
	 * ```ts
	 * const result = useParseForm(SignUpSchema, new FormData(form));
	 * if (result.ok) await signUp(result.values);
	 * else render(result.errors);
	 * ```
	 */
	useParseForm<T>(schema: ValidationSchema<T>, data: FormData | FormDataValues): FormValidation<T> {
		const raw = data instanceof FormData ? this.useFormData(data) : data;
		const parsed = schema.safeParse?.(raw);
		if (!parsed) {
			return { ok: false, values: null, errors: { _form: "Schema does not support safeParse()." } };
		}
		if (parsed.success) {
			return { ok: true, values: parsed.data, errors: {} };
		}
		return { ok: false, values: null, errors: this.useFieldErrors(parsed.error) };
	}

	/**
	 * Reads one field's message out of a {@link FieldErrors} map.
	 *
	 * @param errors - The map from {@link useParseForm} or {@link useFieldErrors}.
	 * @param name - Field name (dots for nested paths).
	 * @returns The message, or `undefined` when the field is valid.
	 */
	useFieldError(errors: FieldErrors, name: string): string | undefined {
		return errors[name];
	}
}

/**
 * Reads a native `FormData` into a plain object (nested by dots).
 * Wrapper over {@link FormService}.
 */
export function useFormData(data: FormData): FormDataValues {
	return FormService.getInstance().useFormData(data);
}

/**
 * Turns schema issues into one message per field.
 * Wrapper over {@link FormService}.
 */
export function useFieldErrors(error: { issues?: ValidationIssue[] }): FieldErrors {
	return FormService.getInstance().useFieldErrors(error);
}

/**
 * Validates a native form against a schema, returning typed values or field
 * errors. Wrapper over {@link FormService}.
 */
export function useParseForm<T>(
	schema: ValidationSchema<T>,
	data: FormData | FormDataValues,
): FormValidation<T> {
	return FormService.getInstance().useParseForm(schema, data);
}

/**
 * Reads one field's message out of a {@link FieldErrors} map.
 * Wrapper over {@link FormService}.
 */
export function useFieldError(errors: FieldErrors, name: string): string | undefined {
	return FormService.getInstance().useFieldError(errors, name);
}
