/**
 * Toast notifications — framework-agnostic, zero runtime dependencies.
 *
 * Mirrors the dual surface of the rest of the kit:
 *
 * - **Pure** — {@link useToastClass} and {@link useToastContainerClass} return
 *   plain strings and never touch the DOM, so Astro/Nuxt templates can render
 *   markup directly: `<div class={useToastClass({ type: "success" })}>`.
 * - **Imperative** — {@link useToastStore} is the programmatic manager
 *   (`toast.success("Saved")`); {@link useToast} builds a single detached
 *   element for hand-rolled stacks.
 *
 * Accessibility: every stack is a polite live region (`role="region"` with
 * `aria-live="polite"`), and each toast escalates to `role="alert"` when its
 * type is `error`. Auto-dismiss timers pause on hover/focus, and the progress
 * bar freezes in step with the timer so the two never desync. All motion is
 * disabled under `prefers-reduced-motion`.
 *
 * @module ui/components/toast
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/** Semantic toast types. `loading` is indeterminate and never auto-dismisses. */
export type ToastType = "info" | "success" | "warning" | "error" | "loading";

/** Screen anchor for a toast stack. */
export type ToastPosition =
	"top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";

/** Toast sizes. */
export type ToastSize = "sm" | "md" | "lg";

/** Options accepted by {@link useToast}, {@link useToastClass} and the store. */
export interface ToastOptions {
	/** Semantic variant (default: `"info"`). */
	type?: ToastType;
	/** Bold heading line. */
	title?: string;
	/** Body message. */
	message?: string;
	/** Size (default: `"md"`). */
	size?: ToastSize;
	/** Stack anchor (default: `"top-right"`). */
	position?: ToastPosition;
	/**
	 * Milliseconds before auto-dismiss. `0` pins the toast open. Ignored for
	 * `loading`, which stays until dismissed or updated.
	 *
	 * @defaultValue 5000
	 */
	duration?: number;
	/** Renders the close button (default: `true`). */
	dismissible?: boolean;
	/** Accessible name for the close button (default: `"Dismiss notification"`). */
	closeLabel?: string;
	/** Called once the toast leaves the DOM. */
	onClose?: (id: string) => void;
}

/** Live reference to a mounted toast. */
export interface ToastHandle {
	/** Stable id assigned at creation. */
	readonly id: string;
	/** Replaces options in place, keeping position and stacking order. */
	update(options: Partial<ToastOptions>): void;
	/** Closes the toast, playing the exit animation. */
	dismiss(): void;
}

/** Programmatic toast manager. */
export interface ToastStore {
	/** Mounts a toast from a full options object. */
	show(options?: ToastOptions): ToastHandle;
	/** Informational toast. */
	info(message: string, options?: Partial<ToastOptions>): ToastHandle;
	/** Success toast. */
	success(message: string, options?: Partial<ToastOptions>): ToastHandle;
	/** Warning toast. */
	warning(message: string, options?: Partial<ToastOptions>): ToastHandle;
	/** Error toast; announced assertively and never auto-dismisses by default. */
	error(message: string, options?: Partial<ToastOptions>): ToastHandle;
	/** Indeterminate toast that stays until dismissed or updated. */
	loading(message: string, options?: Partial<ToastOptions>): ToastHandle;
	/** Closes one toast by id, or every toast in the stack when omitted. */
	dismiss(id?: string): void;
	/** Removes every mounted toast across all positions. */
	clear(): void;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

/** Default auto-dismiss delay in milliseconds. */
const DEFAULT_DURATION = 5000;

/** Fallback delay for `error` toasts, which should not vanish unannounced. */
const DEFAULT_ERROR_DURATION = 8000;

/**
 * Safety-net delay before a dismissing toast is force-removed.
 *
 * Removal normally rides on the CSS exit animation (`animationend`). This
 * catches environments where that event never arrives: stylesheet not loaded,
 * `prefers-reduced-motion` enabled, or the node detached mid-animation.
 */
export const TOAST_EXIT_FALLBACK_MS = 400;

/** Inline SVG paths per type. Authored constants — never user input. */
const TYPE_ICON: Record<ToastType, string> = {
	info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.75v.5"/>',
	success: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
	warning:
		'<path d="M10.6 4.2 2.5 18a1.4 1.4 0 0 0 1.2 2.1h16.6a1.4 1.4 0 0 0 1.2-2.1L13.4 4.2a1.4 1.4 0 0 0-2.8 0Z"/><path d="M12 9.5v4M12 16.75v.5"/>',
	error: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
	loading: "",
};

/* -------------------------------------------------------------------------- */
/* Pure surfaces (SSR-safe)                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Pure class list for a toast — safe to call during SSR or inside a framework
 * template.
 *
 * @param options - Variant, size and dismissibility.
 * @returns The `kk-toast` class list.
 *
 * @example
 * ```ts
 * useToastClass({ type: "success", size: "sm" });
 * // "kk-toast kk-toast--success kk-toast--sm kk-toast--dismissible"
 * ```
 */
export function useToastClass(
	options: Pick<ToastOptions, "type" | "size" | "dismissible"> = {},
): string {
	const classes = [
		"kk-toast",
		`kk-toast--${options.type ?? "info"}`,
		`kk-toast--${options.size ?? "md"}`,
	];
	if (options.dismissible !== false) classes.push("kk-toast--dismissible");
	return classes.join(" ");
}

/**
 * Pure class list for a toast stack — safe to call during SSR or inside a
 * framework template.
 *
 * @param options - Stack anchor.
 * @returns The `kk-toast-stack` class list.
 *
 * @example
 * ```ts
 * useToastContainerClass({ position: "bottom-center" });
 * // "kk-toast-stack kk-toast-stack--bottom-center"
 * ```
 */
export function useToastContainerClass(options: Pick<ToastOptions, "position"> = {}): string {
	return ["kk-toast-stack", `kk-toast-stack--${options.position ?? "top-right"}`].join(" ");
}

/* -------------------------------------------------------------------------- */
/* DOM construction                                                           */
/* -------------------------------------------------------------------------- */

function requireDom(api: string): Document {
	if (typeof document === "undefined") {
		throw new Error(`[KatanaUI] ${api}() needs a DOM; use useToastClass() for SSR markup.`);
	}
	return document;
}

/**
 * Resolves the effective auto-dismiss delay, honouring per-type defaults.
 *
 * @param options - Caller options; `duration` wins when provided.
 * @returns Milliseconds to wait, or `0` when the toast must stay pinned.
 */
function resolveDuration(options: ToastOptions): number {
	if (options.duration !== undefined) return Math.max(0, options.duration);
	if (options.type === "loading") return 0;
	return options.type === "error" ? DEFAULT_ERROR_DURATION : DEFAULT_DURATION;
}

/**
 * Builds the inline status icon for a toast type.
 *
 * @param type - Toast variant.
 * @returns An `aria-hidden` SVG element, or `null` for `loading` (CSS spinner).
 */
function buildIcon(type: ToastType): SVGSVGElement | null {
	if (type === "loading") return null;

	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("fill", "none");
	svg.setAttribute("stroke", "currentColor");
	svg.setAttribute("stroke-width", "1.75");
	svg.setAttribute("stroke-linecap", "round");
	svg.setAttribute("stroke-linejoin", "round");
	// The message text already carries the meaning — the glyph is decorative.
	svg.setAttribute("aria-hidden", "true");
	svg.setAttribute("focusable", "false");
	svg.classList.add("kk-toast__icon");
	svg.innerHTML = TYPE_ICON[type];
	return svg;
}

/**
 * Creates a standalone toast element with no auto-dismiss wiring.
 *
 * Use {@link useToastStore} for real notifications; this is for hand-rolled
 * stacks that own their own lifecycle.
 *
 * @param options - Variant, content, dismissibility and callback.
 * @returns The toast element.
 * @throws {Error} Outside a DOM environment.
 *
 * @example
 * ```ts
 * stack.append(useToast({ type: "error", message: "Upload failed." }));
 * ```
 */
export function useToast(options: ToastOptions = {}): HTMLDivElement {
	requireDom("useToast");

	const variant = options.type ?? "info";
	const toast = document.createElement("div");
	toast.className = useToastClass(options);
	// Errors interrupt; everything else waits its turn.
	toast.setAttribute("role", variant === "error" ? "alert" : "status");

	const icon = buildIcon(variant);
	if (icon) toast.append(icon);

	const content = document.createElement("div");
	content.className = "kk-toast__content";
	if (options.title) {
		const title = document.createElement("p");
		title.className = "kk-toast__title";
		title.textContent = options.title;
		content.append(title);
	}
	if (options.message) {
		const message = document.createElement("p");
		message.className = "kk-toast__message";
		message.textContent = options.message;
		content.append(message);
	}
	toast.append(content);

	if (options.dismissible !== false) {
		const close = document.createElement("button");
		close.type = "button";
		close.className = "kk-toast__close";
		close.setAttribute("aria-label", options.closeLabel ?? "Dismiss notification");
		close.textContent = "×";
		close.addEventListener("click", () => {
			toast.remove();
			options.onClose?.("");
		});
		toast.append(close);
	}

	return toast;
}

/**
 * Creates an empty toast stack container with the live-region wiring.
 *
 * @param options - Stack anchor.
 * @returns The stack element.
 * @throws {Error} Outside a DOM environment.
 *
 * @example
 * ```ts
 * document.body.append(useToastContainer({ position: "top-center" }));
 * ```
 */
export function useToastContainer(options: Pick<ToastOptions, "position"> = {}): HTMLDivElement {
	requireDom("useToastContainer");

	const stack = document.createElement("div");
	stack.className = useToastContainerClass(options);
	stack.setAttribute("role", "region");
	stack.setAttribute("aria-label", "Notifications");
	stack.setAttribute("aria-live", "polite");
	stack.setAttribute("aria-relevant", "additions");
	return stack;
}

/* -------------------------------------------------------------------------- */
/* Store                                                                      */
/* -------------------------------------------------------------------------- */

interface Mounted {
	element: HTMLDivElement;
	handle: ToastHandle;
	options: ToastOptions;
	timer: ReturnType<typeof setTimeout> | null;
	remaining: number;
	startedAt: number;
	/** Guards against a double dismissal firing the removal path twice. */
	removing: boolean;
}

/** Lazily built stacks, keyed by position. */
const stacks = new Map<ToastPosition, HTMLDivElement>();

/** Live toasts by id. */
const mounted = new Map<string, Mounted>();

/** Monotonic id counter — ids only need to be unique within a page. */
let sequence = 0;

function useStack(position: ToastPosition): HTMLDivElement {
	const existing = stacks.get(position);
	if (existing?.isConnected) return existing;

	const stack = useToastContainer({ position });
	document.body.append(stack);
	stacks.set(position, stack);
	return stack;
}

function useRemove(entry: Mounted, id: string): void {
	if (entry.timer) clearTimeout(entry.timer);
	entry.timer = null;
	// Both the animation event and the fallback timer can fire; run once.
	entry.removing = true;

	let done = false;
	const finish = () => {
		if (done) return;
		done = true;
		mounted.delete(id);

		// Read the parent before detaching — `remove()` clears `parentElement`.
		const parent = entry.element.parentElement;
		entry.element.remove();
		entry.options.onClose?.(id);

		// Keep the DOM tidy: drop an empty stack and release its cache slot.
		if (parent && parent.childElementCount === 0) {
			parent.remove();
			for (const [key, value] of stacks) if (value === parent) stacks.delete(key);
		}
	};

	entry.element.classList.add("kk-toast--leaving");
	const reduced =
		typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduced) finish();
	else entry.element.addEventListener("animationend", finish, { once: true });

	setTimeout(finish, TOAST_EXIT_FALLBACK_MS);
}

function useSchedule(entry: Mounted, id: string): void {
	if (entry.remaining <= 0) return;
	entry.startedAt = Date.now();
	entry.timer = setTimeout(() => useRemove(entry, id), entry.remaining);
}

/**
 * Binds hover/focus pause-resume to a toast element.
 *
 * Re-invoked after {@link ToastHandle.update} swaps the node, so listeners
 * never end up attached to a detached element.
 */
function useBindPause(entry: Mounted, id: string): void {
	const pause = () => {
		if (!entry.timer) return;
		clearTimeout(entry.timer);
		entry.timer = null;
		entry.remaining = Math.max(0, entry.remaining - (Date.now() - entry.startedAt));
		entry.element.classList.add("kk-toast--paused");
	};
	const resume = () => {
		if (entry.timer || entry.remaining <= 0) return;
		entry.element.classList.remove("kk-toast--paused");
		useSchedule(entry, id);
	};

	const element = entry.element;
	element.addEventListener("mouseenter", pause);
	element.addEventListener("mouseleave", resume);
	element.addEventListener("focusin", pause);
	element.addEventListener("focusout", resume);
}

function useShow(options: ToastOptions = {}): ToastHandle {
	requireDom("useToastStore");

	const position = options.position ?? "top-right";
	const stack = useStack(position);

	sequence += 1;
	const id = `kk-toast-${sequence}`;

	const entry: Mounted = {
		element: useToast(options),
		handle: {
			id,
			update(next: Partial<ToastOptions>) {
				const merged = { ...entry.options, ...next };
				entry.options = merged;

				const replacement = useToast(merged);
				replacement.dataset.toastId = id;
				const bar = entry.element.querySelector<HTMLElement>(".kk-toast__progress");
				if (bar) replacement.append(bar);
				entry.element.replaceWith(replacement);
				entry.element = replacement;

				entry.remaining = resolveDuration(merged);
				replacement.style.setProperty("--kk-toast-duration", `${entry.remaining}ms`);
				if (entry.timer) clearTimeout(entry.timer);
				entry.timer = null;
				// Re-bind: the node the listeners were attached to is gone.
				useBindPause(entry, id);
				// A dismissed toast must not be resurrected by a late update.
				if (!entry.removing) useSchedule(entry, id);
			},
			dismiss() {
				useRemove(entry, id);
			},
		},
		options,
		timer: null,
		remaining: resolveDuration(options),
		startedAt: 0,
		removing: false,
	};

	const element = entry.element;
	element.dataset.toastId = id;
	element.style.setProperty("--kk-toast-duration", `${entry.remaining}ms`);

	if (entry.remaining > 0) {
		const bar = document.createElement("span");
		bar.className = "kk-toast__progress";
		// Purely decorative timing cue; the live region carries the message.
		bar.setAttribute("aria-hidden", "true");
		element.append(bar);
	}

	// Pause on hover and on keyboard focus so the timer never races the user.
	useBindPause(entry, id);

	mounted.set(id, entry);
	stack.append(element);
	useSchedule(entry, id);

	return entry.handle;
}

/**
 * Returns the singleton toast manager.
 *
 * Repeated calls hand back the same store, so state survives module reloads
 * within a page. The returned object is a thin facade — it never needs to be
 * instantiated.
 *
 * @returns The shared {@link ToastStore}.
 * @throws {Error} Outside a DOM environment.
 *
 * @example
 * ```ts
 * const toast = useToastStore();
 * toast.success("Profile saved.");
 * toast.error("Upload failed.", { duration: 0 });
 * ```
 */
export function useToastStore(): ToastStore {
	requireDom("useToastStore");

	return {
		show: useShow,
		info: (message, options = {}) => useShow({ ...options, type: "info", message }),
		success: (message, options = {}) => useShow({ ...options, type: "success", message }),
		warning: (message, options = {}) => useShow({ ...options, type: "warning", message }),
		error: (message, options = {}) => useShow({ ...options, type: "error", message }),
		loading: (message, options = {}) => useShow({ ...options, type: "loading", message }),
		dismiss(id?: string) {
			if (id) {
				const entry = mounted.get(id);
				if (entry) useRemove(entry, id);
				return;
			}
			for (const [key, entry] of [...mounted]) useRemove(entry, key);
		},
		clear() {
			for (const [key, entry] of [...mounted]) useRemove(entry, key);
		},
	};
}

/**
 * Singleton accessor for the toast manager — escape hatch for call sites that
 * cannot import the factory (DI containers, framework plugins).
 *
 * @returns The shared {@link ToastStore}.
 *
 * @example
 * ```ts
 * ToastService.getInstance().success("Done.");
 * ```
 */
export const ToastService = {
	/** Returns the shared {@link ToastStore}. */
	getInstance(): ToastStore {
		return useToastStore();
	},
};
