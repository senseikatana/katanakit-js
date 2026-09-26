/** Visual variants shared by the Katana UI foundations. */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

/** Button sizes. */
export type ButtonSize = "sm" | "md" | "lg";

/** Options for {@link useButton} and {@link useButtonClass}. */
export interface ButtonOptions {
	/** Visible label. */
	label?: string;
	/** Visual variant (default: `"primary"`). */
	variant?: ButtonVariant;
	/** Size (default: `"md"`). */
	size?: ButtonSize;
	/** Native button type (default: `"button"`). */
	type?: "button" | "submit" | "reset";
	/** Shows a spinner and blocks interaction. */
	loading?: boolean;
	/** Disables the button. */
	disabled?: boolean;
	/** Click handler attached with `addEventListener`. */
	onClick?: (event: MouseEvent) => void;
}

/**
 * Pure class list for a button — safe to use for SSR markup or framework
 * templates (`<button class={useButtonClass({ variant: "ghost" })}>`).
 *
 * @param options - Variant, size and loading state.
 * @returns The `kk-btn` class list.
 *
 * @example
 * ```ts
 * useButtonClass({ variant: "danger", size: "sm" });
 * // "kk-btn kk-btn--danger kk-btn--sm"
 * ```
 */
export function useButtonClass(
	options: Pick<ButtonOptions, "variant" | "size" | "loading"> = {},
): string {
	const classes = [
		"kk-btn",
		`kk-btn--${options.variant ?? "primary"}`,
		`kk-btn--${options.size ?? "md"}`,
	];
	if (options.loading) classes.push("kk-btn--loading");
	return classes.join(" ");
}

/**
 * Creates a styled `<button>` element.
 *
 * @param options - Label, variant, size, state and click handler.
 * @returns The configured button.
 * @throws {Error} Outside a DOM environment (use {@link useButtonClass} for SSR).
 *
 * @example
 * ```ts
 * document.body.append(useButton({ label: "Save", onClick: () => save() }));
 * ```
 */
export function useButton(options: ButtonOptions = {}): HTMLButtonElement {
	if (typeof document === "undefined") {
		throw new Error("[KatanaUI] useButton() needs a DOM; use useButtonClass() for SSR markup.");
	}

	const button = document.createElement("button");
	button.type = options.type ?? "button";
	button.className = useButtonClass(options);
	button.textContent = options.label ?? "";

	if (options.loading) {
		button.setAttribute("aria-busy", "true");
	}
	if (options.disabled || options.loading) {
		button.disabled = true;
	}
	if (options.onClick) {
		button.addEventListener("click", options.onClick);
	}

	return button;
}
