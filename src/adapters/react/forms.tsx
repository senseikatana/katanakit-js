import {
	type ButtonHTMLAttributes,
	createContext,
	createElement,
	type FormEventHandler,
	forwardRef,
	type InputHTMLAttributes,
	type ReactElement,
	type ReactNode,
	type SelectHTMLAttributes,
	type TextareaHTMLAttributes,
	useCallback,
	useContext,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";

import { useParseForm } from "@/core/services/form.service.js";
import type { FieldErrors, FormSubmitHandler, ValidationSchema } from "@/types/index.js";

/* -------------------------------------------------------------------------- */
/* Contexts                                                                   */
/* -------------------------------------------------------------------------- */

interface FieldContextValue {
	/** `id` shared by the label and the control. */
	id: string;
	/** Field name, as `FormData` reports it (dots for nested paths). */
	name: string;
	/** `id` of the error paragraph, when there is one. */
	errorId: string;
	/** Composed `aria-describedby` (hint + error), or `undefined`. */
	describedBy?: string;
	/** Whether the field currently carries a message. */
	invalid: boolean;
	/** Ready-to-spread props for a custom control: `id`, `name`, `aria-*`. */
	inputProps: {
		id: string;
		name: string;
		"aria-describedby"?: string;
		"aria-invalid"?: true;
	};
}

/** Wiring published by {@link Field}; `null` when a control stands alone. */
const FieldContext = createContext<FieldContextValue | null>(null);

/** Per-field messages owned by {@link Form}. */
const ErrorsContext = createContext<FieldErrors>({});

/** Whether the surrounding {@link Form} has a submit in flight. */
const PendingContext = createContext(false);

/**
 * Field wiring for a custom control placed inside {@link Field}.
 *
 * Returns `null` outside a field, so the control also works standalone.
 *
 * ```tsx
 * function PriceInput() {
 *   const field = useField();
 *   return <input id={field?.id} name={field?.name} aria-describedby={field?.describedBy} />;
 * }
 * ```
 */
export function useField(): FieldContextValue | null {
	return useContext(FieldContext);
}

/** Whether the surrounding {@link Form} has a submit in flight. */
export function useFormPending(): boolean {
	return useContext(PendingContext);
}

/** The current per-field messages of the surrounding {@link Form}. */
export function useFormErrors(): FieldErrors {
	return useContext(ErrorsContext);
}

/* -------------------------------------------------------------------------- */
/* Form                                                                       */
/* -------------------------------------------------------------------------- */

/** Props for {@link Form}. */
export interface FormProps<T> {
	/** Any {@link ValidationSchema} — Zod, Valibot or Standard Schema. */
	schema: ValidationSchema<T>;
	/** Receives the parsed, typed values once validation passes. */
	onSubmit: FormSubmitHandler<T>;
	/** Called with the error map when validation fails. */
	onInvalid?: (errors: FieldErrors) => void;
	/** Clears the native fields after a successful submit. */
	resetOnSuccess?: boolean;
	/** Native props for the `<form>` itself (`className`, `id`, `aria-*`, …). */
	formProps?: Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "noValidate">;
	children: ReactNode;
}

/**
 * Native `<form>` validated against a schema on submit.
 *
 * Fields stay **uncontrolled**: the browser owns their state, so typing does
 * not re-render anything and values are read once, with `FormData`. After a
 * failed submit the invalid fields are marked, the first one is focused, and
 * each field clears itself as soon as it passes on blur or input.
 *
 * Renders `noValidate` on purpose — the schema is the single source of truth
 * for messages — while `type`, `required` and `autocomplete` remain on the
 * inputs for keyboards, autofill and assistive technology.
 *
 * @example
 * ```tsx
 * import { Form, Field, Input, Submit } from "katanakit-js/adapters/react";
 *
 * <Form schema={SignUpSchema} onSubmit={(values) => signUp(values)}>
 *   <Field name="email" label="Email">
 *     <Input type="email" autoComplete="email" required />
 *   </Field>
 *   <Submit pendingLabel="Signing up…">Create account</Submit>
 * </Form>
 * ```
 */
export function Form<T>({
	schema,
	onSubmit,
	onInvalid,
	resetOnSuccess = false,
	formProps,
	children,
}: FormProps<T>): ReactElement {
	const [errors, setErrors] = useState<FieldErrors>({});
	const [pending, setPending] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	// The handlers below run natively and must read the *current* map without
	// being re-created (and re-attached) on every keystroke.
	const errorsRef = useRef<FieldErrors>({});
	const submittedRef = useRef(false);

	const commit = useCallback((next: FieldErrors) => {
		errorsRef.current = next;
		setErrors(next);
	}, []);

	const focusFirstInvalid = useCallback((map: FieldErrors) => {
		const [first] = Object.keys(map).filter((name) => name !== "_form");
		if (!first) return;
		const element = formRef.current?.elements.namedItem(first);
		if (element instanceof HTMLElement) element.focus();
	}, []);

	/** Re-runs validation and keeps only `name`'s message in sync. */
	const revalidateField = useCallback(
		(name: string) => {
			const form = formRef.current;
			if (!form) return;
			const result = useParseForm(schema, new FormData(form));
			const message = result.ok ? undefined : result.errors[name];
			const current = errorsRef.current;
			if (message === current[name]) return;
			const updated = { ...current };
			if (message) updated[name] = message;
			else delete updated[name];
			commit(updated);
		},
		[commit, schema],
	);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		submittedRef.current = true;

		const result = useParseForm(schema, new FormData(form));
		if (!result.ok) {
			commit(result.errors);
			onInvalid?.(result.errors);
			focusFirstInvalid(result.errors);
			return;
		}

		commit({});
		setPending(true);
		try {
			await onSubmit(result.values);
			if (resetOnSuccess) {
				form.reset();
				submittedRef.current = false;
			}
		} finally {
			setPending(false);
		}
	};

	/** After the first failed submit, re-check each field as the user leaves it. */
	const handleBlur: FormEventHandler<HTMLFormElement> = (event) => {
		const name = (event.target as HTMLInputElement).name;
		if (!name) return;
		if (!submittedRef.current && !errorsRef.current[name]) return;
		revalidateField(name);
	};

	/** A marked field clears itself as soon as it passes. */
	const handleInput: FormEventHandler<HTMLFormElement> = (event) => {
		const name = (event.target as HTMLInputElement).name;
		if (!name || !errorsRef.current[name]) return;
		revalidateField(name);
	};

	const { className, ...restFormProps } = formProps ?? {};

	return createElement(
		"form",
		{
			...restFormProps,
			ref: formRef,
			className,
			noValidate: true,
			onSubmit: handleSubmit,
			onBlur: handleBlur,
			onInput: handleInput,
		},
		createElement(
			ErrorsContext.Provider,
			{ value: errors },
			createElement(PendingContext.Provider, { value: pending }, children),
		),
	);
}

/* -------------------------------------------------------------------------- */
/* Field                                                                      */
/* -------------------------------------------------------------------------- */

/** Props for {@link Field}. */
export interface FieldProps {
	/** Field name; dots address nested paths (`"address.city"`). */
	name: string;
	/** Visible label, wired to the control with `htmlFor`. */
	label: string;
	/** Help text rendered before the error, linked with `aria-describedby`. */
	hint?: string;
	/** Class for the wrapping element. */
	className?: string;
	/** A single native control ({@link Input}, {@link Select}, …). */
	children: ReactNode;
}

/**
 * Label + control + hint/error slot for one field of a {@link Form}.
 *
 * Publishes `id`, `name` and `aria-describedby` through context, so the
 * controls in this module need no manual accessibility wiring. The error
 * paragraph uses `role="status"` (`aria-live="polite"`): a failed validation
 * is announced without interrupting whoever is typing.
 *
 * @example
 * ```tsx
 * <Field name="email" label="Email" hint="Only used for receipts.">
 *   <Input type="email" autoComplete="email" />
 * </Field>
 * ```
 */
export function Field({ name, label, hint, className, children }: FieldProps): ReactElement {
	const reactId = useId();
	const id = `katana-${reactId}-${name}`.replace(/[^a-zA-Z0-9_-]/g, "-");
	const errorId = `${id}-error`;
	const hintId = hint ? `${id}-hint` : undefined;
	const error = useContext(ErrorsContext)[name];
	const invalid = Boolean(error);
	const describedBy = [hintId, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

	const context = useMemo<FieldContextValue>(
		() => ({
			describedBy,
			errorId,
			id,
			invalid,
			inputProps: {
				id,
				name,
				"aria-describedby": describedBy,
				"aria-invalid": invalid || undefined,
			},
			name,
		}),
		[describedBy, errorId, id, invalid, name],
	);

	return createElement(
		"div",
		{ className },
		createElement("label", { htmlFor: id }, label),
		hint ? createElement("p", { id: hintId }, hint) : null,
		createElement(FieldContext.Provider, { value: context }, children),
		error ? createElement("p", { id: errorId, role: "status", "aria-live": "polite" }, error) : null,
	);
}

/* -------------------------------------------------------------------------- */
/* Native controls                                                            */
/* -------------------------------------------------------------------------- */

/** Shared props every control accepts on top of its native attributes. */
interface ControlBase {
	/** `name`; inherits the surrounding {@link Field} when omitted. */
	name?: string;
	/** Overrides the inherited `id` (custom labelling). */
	id?: string;
}

function useControlWiring(props: ControlBase) {
	const field = useField();
	return {
		id: props.id ?? field?.id,
		name: props.name ?? field?.name,
		"aria-describedby": field?.describedBy,
		"aria-invalid": field?.invalid || undefined,
	};
}

/** Props for {@link Input}. */
export type InputProps = InputHTMLAttributes<HTMLInputElement> & ControlBase;

/**
 * Native `<input>` that inherits `id`, `name` and `aria-describedby` from the
 * surrounding {@link Field}. Any native prop passes through; styling is yours
 * (`className`), the component only handles identity and accessibility.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
	const { name, id, ...rest } = props;
	return createElement("input", { ...rest, ...useControlWiring({ name, id }), ref });
});

/** Props for {@link Textarea}. */
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & ControlBase;

/** Native `<textarea>` with the same field wiring as {@link Input}. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea(props, ref) {
		const { name, id, ...rest } = props;
		return createElement("textarea", { ...rest, ...useControlWiring({ name, id }), ref });
	},
);

/** Props for {@link Select}. */
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & ControlBase;

/** Native `<select>` with the same field wiring as {@link Input}. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(props, ref) {
	const { name, id, ...rest } = props;
	return createElement("select", { ...rest, ...useControlWiring({ name, id }), ref });
});

/** Props for {@link Checkbox}. */
export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & ControlBase;

/**
 * Native `<input type="checkbox">` with the same field wiring as {@link Input}.
 *
 * A checked box without a `value` reaches the schema as `true`; unchecked
 * boxes are absent, so an optional flag reads `z.boolean().optional().default(false)`
 * and a required agreement reads `z.literal(true)`.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
	const { name, id, ...rest } = props;
	return createElement("input", {
		...rest,
		...useControlWiring({ name, id }),
		type: "checkbox",
		ref,
	});
});

/** Props for {@link Submit}. */
export interface SubmitProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/** Label shown while the submit is in flight (defaults to `children`). */
	pendingLabel?: ReactNode;
}

/**
 * Native `<button type="submit">` that reflects the form's pending state:
 * `disabled` and `aria-busy` while `onSubmit` settles, with an optional
 * `pendingLabel`. The button therefore stays enabled until the request starts.
 *
 * @example
 * ```tsx
 * <Submit pendingLabel="Saving…">Save changes</Submit>
 * ```
 */
export const Submit = forwardRef<HTMLButtonElement, SubmitProps>(function Submit(props, ref) {
	const { children, pendingLabel, disabled, ...rest } = props;
	const pending = useFormPending();
	return createElement(
		"button",
		{ ...rest, type: "submit", disabled: disabled || pending, "aria-busy": pending, ref },
		pending ? (pendingLabel ?? children) : children,
	);
});
