// ============================================================
// 1. CONTRATO DE LA FACHADA DOM (INTERFAZ)
// ============================================================

export interface IDomService {
	IS_BROWSER(): boolean;
	GET_ROOT(): HTMLElement | null;
	GET_BODY(): HTMLBodyElement | null;
	GET_ELEMENT_BY_ID<T extends HTMLElement = HTMLElement>(id: string): T | null;
	GET_ELEMENT_BY_CLASS<T extends HTMLElement = HTMLElement>(className: string): T | null;

	// QUERY_SELECTOR overloads
	QUERY_SELECTOR<K extends keyof HTMLElementTagNameMap>(
		selector: K,
	): HTMLElementTagNameMap[K] | null;
	QUERY_SELECTOR<E extends Element = HTMLElement>(selector: string): E | null;

	// QUERY_SELECTOR_ALL overloads
	QUERY_SELECTOR_ALL<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][];
	QUERY_SELECTOR_ALL<E extends Element = HTMLElement>(selector: string): E[];

	ADD_CLASS(target: Element | string, className: string): void;
	REMOVE_CLASS(target: Element | string, className: string | string[]): void;
	TOGGLE_CLASS(target: Element | string, className: string, force?: boolean): boolean | undefined;
	HAS_CLASS(target: Element | string, className: string): boolean;
	GET_ATTRIBUTE(target: Element | string, attr: string): string | null;
	SET_ATTRIBUTE(target: Element | string, attr: string, value: string): void;
	REMOVE_ATTRIBUTE(target: Element | string, attr: string): void;
	GET_DATA_ATTRIBUTE(target: HTMLElement | string, key: string): string | undefined;
	SET_DATA_ATTRIBUTE(target: HTMLElement | string, key: string, value: string): void;
	ON<K extends keyof HTMLElementEventMap>(
		target: EventTarget | string,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void,
		options?: boolean | AddEventListenerOptions,
	): (() => void) | null;
	CREATE_ELEMENT<T extends keyof HTMLElementTagNameMap>(
		tagName: T,
		options?: ElementCreationOptions,
	): HTMLElementTagNameMap[T];
	SET_HTML(target: Element | string, html: string): void;
	SET_TEXT(target: Element | string, text: string): void;
	APPEND(target: Element | string, child: Element | string): void;
	REMOVE(target: Element | string): void;
}

// ============================================================
// 2. IMPLEMENTACIÓN FACHADA + SINGLETON
// ============================================================

export class DomService implements IDomService {
	private static instance: DomService;

	private constructor() {}

	public static getInstance(): DomService {
		if (!DomService.instance) {
			DomService.instance = new DomService();
		}
		return DomService.instance;
	}

	public IS_BROWSER = (): boolean => {
		return typeof window !== "undefined" && typeof document !== "undefined";
	};

	// Safe access to document.documentElement (<html>).
	public GET_ROOT = (): HTMLElement | null => {
		if (!this.IS_BROWSER()) return null;
		return document.documentElement;
	};

	// Safe access to document.body (<body>).
	public GET_BODY = (): HTMLBodyElement | null => {
		if (!this.IS_BROWSER()) return null;
		return document.body as HTMLBodyElement | null;
	};

	private RESOLVE = <T extends Element = HTMLElement>(target: T | string): T | null => {
		return typeof target === "string" ? this.QUERY_SELECTOR<T>(target) : target;
	};

	public GET_ELEMENT_BY_ID = <T extends HTMLElement = HTMLElement>(id: string): T | null => {
		if (!this.IS_BROWSER()) return null;
		return document.getElementById(id) as T | null;
	};

	public GET_ELEMENT_BY_CLASS = <T extends HTMLElement = HTMLElement>(
		className: string,
	): T | null => {
		if (!this.IS_BROWSER()) return null;
		const formattedSelector = className.startsWith(".") ? className : `.${className}`;
		return document.querySelector<T>(formattedSelector);
	};

	public QUERY_SELECTOR: {
		<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
		<E extends Element = HTMLElement>(selector: string): E | null;
	} = <E extends Element = HTMLElement>(selector: string): E | null => {
		if (!this.IS_BROWSER()) return null;
		return document.querySelector<E>(selector);
	};

	public QUERY_SELECTOR_ALL: {
		<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][];
		<E extends Element = HTMLElement>(selector: string): E[];
	} = <E extends Element = HTMLElement>(selector: string): E[] => {
		if (!this.IS_BROWSER()) return [];
		return Array.from(document.querySelectorAll<E>(selector));
	};

	public ADD_CLASS = (target: Element | string, className: string): void => {
		this.RESOLVE(target)?.classList.add(className);
	};

	public REMOVE_CLASS = (target: Element | string, className: string | string[]): void => {
		const el = this.RESOLVE(target);
		if (!el) return;
		if (Array.isArray(className)) {
			el.classList.remove(...className);
		} else {
			el.classList.remove(className);
		}
	};

	public TOGGLE_CLASS = (
		target: Element | string,
		className: string,
		force?: boolean,
	): boolean | undefined => {
		return this.RESOLVE(target)?.classList.toggle(className, force);
	};

	public HAS_CLASS = (target: Element | string, className: string): boolean => {
		return this.RESOLVE(target)?.classList.contains(className) ?? false;
	};

	public GET_ATTRIBUTE = (target: Element | string, attr: string): string | null => {
		return this.RESOLVE(target)?.getAttribute(attr) ?? null;
	};

	public SET_ATTRIBUTE = (target: Element | string, attr: string, value: string): void => {
		this.RESOLVE(target)?.setAttribute(attr, value);
	};

	public REMOVE_ATTRIBUTE = (target: Element | string, attr: string): void => {
		this.RESOLVE(target)?.removeAttribute(attr);
	};

	public GET_DATA_ATTRIBUTE = (target: HTMLElement | string, key: string): string | undefined => {
		return this.RESOLVE<HTMLElement>(target)?.dataset[key];
	};

	public SET_DATA_ATTRIBUTE = (target: HTMLElement | string, key: string, value: string): void => {
		const el = this.RESOLVE<HTMLElement>(target);
		if (el) el.dataset[key] = value;
	};

	public ON = <K extends keyof HTMLElementEventMap>(
		target: EventTarget | string,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void,
		options?: boolean | AddEventListenerOptions,
	): (() => void) | null => {
		if (!this.IS_BROWSER()) return null;
		const el = typeof target === "string" ? this.QUERY_SELECTOR(target) : target;
		if (!el) return null;

		const handler = callback as EventListener;
		el.addEventListener(event, handler, options);
		return () => el.removeEventListener(event, handler, options);
	};

	public CREATE_ELEMENT = <T extends keyof HTMLElementTagNameMap>(
		tagName: T,
		options?: ElementCreationOptions,
	): HTMLElementTagNameMap[T] => {
		if (!this.IS_BROWSER()) {
			throw new Error("Cannot create elements in non-browser environment");
		}
		return document.createElement<T>(tagName, options);
	};

	public SET_HTML = (target: Element | string, html: string): void => {
		const el = this.RESOLVE(target);
		if (el) el.innerHTML = html ?? "";
	};

	public SET_TEXT = (target: Element | string, text: string): void => {
		const el = this.RESOLVE(target);
		if (el) el.textContent = text;
	};

	public APPEND = (target: Element | string, child: Element | string): void => {
		const parent = this.RESOLVE(target);
		const childEl = this.RESOLVE(child);
		if (parent && childEl) parent.appendChild(childEl);
	};

	public REMOVE = (target: Element | string): void => {
		this.RESOLVE(target)?.remove();
	};
}

// ============================================================
// 3. INSTANCIA SINGLETON Y EXPORTACIÓN DESESTRUCTURADA
// ============================================================

export const DOM_SERVICE: DomService = DomService.getInstance();

export const {
	IS_BROWSER,
	GET_ROOT,
	GET_BODY,
	GET_ELEMENT_BY_ID,
	GET_ELEMENT_BY_CLASS,
	QUERY_SELECTOR,
	QUERY_SELECTOR_ALL,
	ADD_CLASS,
	REMOVE_CLASS,
	TOGGLE_CLASS,
	HAS_CLASS,
	GET_ATTRIBUTE,
	SET_ATTRIBUTE,
	REMOVE_ATTRIBUTE,
	GET_DATA_ATTRIBUTE,
	SET_DATA_ATTRIBUTE,
	ON,
	CREATE_ELEMENT,
	SET_HTML,
	SET_TEXT,
	APPEND,
	REMOVE,
}: DomService = DOM_SERVICE;
