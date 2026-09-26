/** Semantic badge variants. */
export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";

/** Options for {@link useBadge} and {@link useBadgeClass}. */
export interface BadgeOptions {
	/** Badge text. */
	label?: string;
	/** Semantic variant (default: `"neutral"`). */
	variant?: BadgeVariant;
}

/**
 * Pure class list for a badge.
 *
 * @param options - Variant.
 * @returns The `kk-badge` class list.
 */
export function useBadgeClass(options: Pick<BadgeOptions, "variant"> = {}): string {
	return `kk-badge kk-badge--${options.variant ?? "neutral"}`;
}

/**
 * Creates a badge (status pill).
 *
 * @param options - Label and variant.
 * @returns The badge element.
 * @throws {Error} Outside a DOM environment.
 *
 * @example
 * ```ts
 * cell.append(useBadge({ label: "Paid", variant: "success" }));
 * ```
 */
export function useBadge(options: BadgeOptions = {}): HTMLSpanElement {
	if (typeof document === "undefined") {
		throw new Error("[KatanaUI] useBadge() needs a DOM; use useBadgeClass() for SSR markup.");
	}

	const badge = document.createElement("span");
	badge.className = useBadgeClass(options);
	badge.textContent = options.label ?? "";
	return badge;
}
