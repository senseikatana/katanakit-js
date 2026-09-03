import {
	ADD_CLASS,
	ON_EVENT,
	REMOVE_CLASS,
	SET_ATTRIBUTE,
} from "@/infrastructure/dom-api/dom";
import { GET_STORAGE, REMOVE_STORAGE, SET_STORAGE } from "../localstorage";

/**
 * Supported theme modes.
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Options for theme initialization.
 */
export interface ThemeOptions {
	/** Default theme mode. Default: 'system' */
	defaultMode?: ThemeMode;
	/** LocalStorage key. Default: 'theme' */
	storageKey?: string;
	/** HTML attribute to set theme on. Default: 'data-theme' */
	attribute?: string;
	/** Element to apply theme attribute to. Default: document.documentElement */
	target?: HTMLElement;
	/** Callback fired when theme changes */
	onChange?: (mode: ThemeMode, resolved: "light" | "dark") => void;
}

/**
 * Singleton service for managing application theme (light/dark/system).
 * Persists user preference in localStorage and respects system preference.
 *
 * @example
 * ```typescript
 * const theme = ThemeService.getInstance();
 * theme.init({ defaultMode: 'system' });
 * theme.set('dark');
 * console.log(theme.get()); // 'dark'
 * console.log(theme.getResolved()); // 'dark'
 * ```
 */
export class ThemeService {
	private static instance: ThemeService;

	private mode: ThemeMode = "system";
	private storageKey = GET_STORAGE("theme") as string;
	private target: HTMLElement | null = null;
	private onChange?: (mode: ThemeMode, resolved: "light" | "dark") => void;
	private mediaQuery: MediaQueryList | null = null;
	private mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;

	private constructor() {}

	static getInstance(): ThemeService {
		if (!ThemeService.instance) {
			ThemeService.instance = new ThemeService();
		}
		return ThemeService.instance;
	}

	/**
	 * Checks if running in a browser environment.
	 */
	private isBrowser(): boolean {
		return typeof window !== "undefined" && typeof document !== "undefined";
	}

	/**
	 * Initializes the theme service. Call once at app startup.
	 * Reads stored preference, applies it, and listens for system changes.
	 *
	 * @param options - Configuration options
	 */
	INIT_THEME(options: ThemeOptions = {}): void {
		if (!this.isBrowser()) return;

		this.storageKey = options.storageKey ?? "theme";
		this.target = options.target ?? document.documentElement;
		this.onChange = options.onChange;

		// Load stored preference or use default
		const stored = GET_STORAGE(this.storageKey) as ThemeMode | null;
		this.mode = stored ?? options.defaultMode ?? "system";

		// Apply initial theme
		this.APPLY_THEME();

		// Listen for system preference changes (only when mode is 'system')
		this.setupMediaQueryListener();
	}

	/**
	 * Sets the theme mode and persists it to localStorage.
	 *
	 * @param mode - Theme mode: 'light', 'dark', or 'system'
	 */
	SET_THEME_MODE(mode: ThemeMode): void {
		if (!this.isBrowser()) return;

		this.mode = mode ?? "system";
		SET_STORAGE(this.storageKey, mode as ThemeMode, "localStorage");
		this.APPLY_THEME();
	}

	/**
	 * Gets the current theme mode (as stored, may be 'system').
	 */
	GET_THEME_MODE(): ThemeMode {
		return this.mode;
	}

	/**
	 * Gets the resolved theme ('light' or 'dark'), taking system preference into account.
	 */
	GET_RESOLVED(): "light" | "dark" {
		if (this.mode !== "system") return this.mode;
		return this.PREFERS_COLOR_SCHEME() ? "dark" : "light";
	}

	/**
	 * Checks if the user/system prefers dark mode.
	 */
	PREFERS_COLOR_SCHEME(): boolean {
		if (!this.isBrowser() || !window.matchMedia) return false;
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	}

	/**
	 * Toggles between light and dark mode (ignores 'system' state).
	 */
	TOGGLE_THEME(): void {
		const current = this.GET_RESOLVED();
		this.SET_THEME_MODE(current === "light" ? "dark" : "light");
	}

	/** * Clears stored preference and reverts to system default.	 */
	RESET_THEME(): void {
		if (!this.isBrowser()) return;
		REMOVE_STORAGE(this.storageKey);
		this.mode = "system" as ThemeMode;
		this.APPLY_THEME();
	}

	/**
	 * Destroys the service, removing event listeners.
	 * Call on app teardown if needed.
	 */
	DETROY_THEME_SERVICE(): void {
		if (this.mediaQuery && this.mediaQueryHandler) {
			this.mediaQuery.removeEventListener("change", this.mediaQueryHandler);
			this.mediaQueryHandler = null;
			this.mediaQuery = null;
		}
	}

	/**
	 * Applies the current theme to the target element.
	 */
	private APPLY_THEME(): void {
		if (!this.target) return;

		const resolved = this.GET_RESOLVED();
		SET_ATTRIBUTE(this.target, resolved, "");
		REMOVE_CLASS(this.target, ["light", "dark"]);
		ADD_CLASS(this.target, resolved);

		this.onChange?.(this.mode, resolved);
	}

	/**
	 * Sets up listener for system color scheme changes.
	 */
	private setupMediaQueryListener(): void {
		if (!this.isBrowser() || !window.matchMedia) return;
		this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		this.mediaQueryHandler = () => {
			if (this.mode === "system") {
				this.APPLY_THEME();
			}
		};
		ON_EVENT(this.mediaQuery, "change", () => this.mediaQueryHandler);
	}
}

// Export singleton instance
export const {
	GET_THEME_MODE,
	INIT_THEME,
	SET_THEME_MODE,
	TOGGLE_THEME,
}: ThemeService = ThemeService.getInstance();
