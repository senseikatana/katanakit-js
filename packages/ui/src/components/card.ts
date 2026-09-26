/** Options for {@link useCard} and {@link useCardClass}. */
export interface CardOptions {
	/** Optional header title. */
	title?: string;
	/** Body content (nodes or plain strings). */
	children?: Array<Node | string>;
	/** Optional footer text. */
	footer?: string;
	/** Replaces the border with an elevation shadow. */
	elevated?: boolean;
}

/**
 * Pure class list for a card.
 *
 * @param options - Elevated state.
 * @returns The `kk-card` class list.
 */
export function useCardClass(options: Pick<CardOptions, "elevated"> = {}): string {
	return options.elevated ? "kk-card kk-card--elevated" : "kk-card";
}

/**
 * Creates a card container with optional header, body and footer.
 *
 * @param options - Title, children, footer and elevation.
 * @returns The card element.
 * @throws {Error} Outside a DOM environment.
 *
 * @example
 * ```ts
 * document.body.append(useCard({ title: "Revenue", children: ["$12,400"] }));
 * ```
 */
export function useCard(options: CardOptions = {}): HTMLElement {
	if (typeof document === "undefined") {
		throw new Error("[KatanaUI] useCard() needs a DOM; use useCardClass() for SSR markup.");
	}

	const card = document.createElement("article");
	card.className = useCardClass(options);

	if (options.title) {
		const header = document.createElement("header");
		header.className = "kk-card__header";
		const title = document.createElement("h3");
		title.className = "kk-card__title";
		title.textContent = options.title;
		header.append(title);
		card.append(header);
	}

	const body = document.createElement("div");
	body.className = "kk-card__body";
	for (const child of options.children ?? []) {
		body.append(child);
	}
	card.append(body);

	if (options.footer) {
		const footer = document.createElement("footer");
		footer.className = "kk-card__footer";
		footer.textContent = options.footer;
		card.append(footer);
	}

	return card;
}
