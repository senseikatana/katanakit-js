// services/theme.service.ts
import {
	ADD_CLASS,
	GET_ROOT,
	ON,
	REMOVE_CLASS,
	SET_ATTRIBUTE,
} from "@/infrastructure/dom-api/dom";
import { GET_STORAGE, REMOVE_STORAGE, SET_STORAGE } from "../localstorage";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeOptions {
	defaultMode?: ThemeMode;
	storageKey?: string;
	attribute?: string;
	target?: HTMLElement;
	onChange?: (mode: ThemeMode, resolved: "light" | "dark") => void;
}

export interface IThemeService {
	INIT_THEME(options?: ThemeOptions): void;
	SET_THEME_MODE(mode: ThemeMode): void;
	GET_THEME_MODE(): ThemeMode;
	GET_RESOLVED(): "light" | "dark";
	PREFERS_COLOR_SCHEME(): boolean;
	TOGGLE_THEME(): void;
	RESET_THEME(): void;
	DESTROY_THEME(): void;
}

export class ThemeService implements IThemeService {
	private static instance: ThemeService;

	private mode: ThemeMode = "system";
	private storageKey: string = "theme";
	private attribute: string = "data-theme";
	private target: HTMLElement | null = null;
	private onChange?: (mode: ThemeMode, resolved: "light" | "dark") => void;
	private mediaQuery: MediaQueryList | null = null;
	private cleanMediaQueryListener: (() => void) | null = null;

	private constructor() {}

	public static getInstance(): ThemeService {
		if (!ThemeService.instance) {
			ThemeService.instance = new ThemeService();
		}
		return ThemeService.instance;
	}

	private IS_BROWSER = (): boolean => {
		return typeof window !== "undefined" && typeof document !== "undefined";
	};

	public INIT_THEME = (options: ThemeOptions = {}): void => {
		if (!this.IS_BROWSER()) return;

		this.storageKey = options.storageKey ?? "theme";
		this.attribute = options.attribute ?? "data-theme";
		this.target = options.target ?? GET_ROOT();
		this.onChange = options.onChange;

		const stored = GET_STORAGE(this.storageKey) as ThemeMode | null;
		this.mode = stored ?? options.defaultMode ?? "system";

		this.APPLY_THEME();
		this.SETUP_MEDIA_QUERY_LISTENER();
	};

	public SET_THEME_MODE = (mode: ThemeMode): void => {
		if (!this.IS_BROWSER()) return;

		this.mode = mode ?? "system";
		SET_STORAGE(this.storageKey, this.mode, "localStorage");
		this.APPLY_THEME();
	};

	public GET_THEME_MODE = (): ThemeMode => {
		return this.mode;
	};

	public GET_RESOLVED = (): "light" | "dark" => {
		if (this.mode !== "system") return this.mode;
		return this.PREFERS_COLOR_SCHEME() ? "dark" : "light";
	};

	public PREFERS_COLOR_SCHEME = (): boolean => {
		if (!this.IS_BROWSER() || !window.matchMedia) return false;
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	};

	public TOGGLE_THEME = (): void => {
		const current = this.GET_RESOLVED();
		this.SET_THEME_MODE(current === "light" ? "dark" : "light");
	};

	public RESET_THEME = (): void => {
		if (!this.IS_BROWSER()) return;
		REMOVE_STORAGE(this.storageKey);
		this.mode = "system";
		this.APPLY_THEME();
	};

	public DESTROY_THEME = (): void => {
		if (this.cleanMediaQueryListener) {
			this.cleanMediaQueryListener();
			this.cleanMediaQueryListener = null;
			this.mediaQuery = null;
		}
	};

	private APPLY_THEME = (): void => {
		if (!this.target) return;

		const resolved = this.GET_RESOLVED();

		// Asigna atributo: ej. data-theme="dark"
		SET_ATTRIBUTE(this.target, this.attribute, resolved);

		// Alterna clases CSS
		REMOVE_CLASS(this.target, ["light", "dark"]);
		ADD_CLASS(this.target, resolved);

		this.onChange?.(this.mode, resolved);
	};

	private SETUP_MEDIA_QUERY_LISTENER = (): void => {
		if (!this.IS_BROWSER() || !window.matchMedia) return;

		this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		// Registra listener usando tu DomService
		this.cleanMediaQueryListener = ON(this.mediaQuery, "change", () => {
			if (this.mode === "system") {
				this.APPLY_THEME();
			}
		});
	};
}

// Instancia única y exportación segura
export const THEME_SERVICE: ThemeService = ThemeService.getInstance();

export const {
	INIT_THEME,
	SET_THEME_MODE,
	GET_THEME_MODE,
	GET_RESOLVED,
	TOGGLE_THEME,
	RESET_THEME,
	DESTROY_THEME,
}: ThemeService = THEME_SERVICE;
