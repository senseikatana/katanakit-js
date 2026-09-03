// ============================================================
// 1. CONTRATO DE LA FACHADA DOM (INTERFAZ)
// ============================================================

export interface IDomService {
	IS_BROWSER(): boolean;
	GET_ELEMENT_BY_ID<T extends HTMLElement = HTMLElement>(id: string): T | null;
	GET_ELEMENT_BY_CLASS<T extends HTMLElement = HTMLElement>(
		className: string,
	): T | null;

	// Sobrecarga de QUERY_SELECTOR para autocompletado de tags HTML y selectores libres
	QUERY_SELECTOR<K extends keyof HTMLElementTagNameMap>(
		selector: K,
	): HTMLElementTagNameMap[K] | null;
	QUERY_SELECTOR<E extends Element = HTMLElement>(selector: string): E | null;

	// Sobrecarga de QUERY_SELECTOR_ALL para autocompletado de tags HTML y selectores libres
	QUERY_SELECTOR_ALL<K extends keyof HTMLElementTagNameMap>(
		selector: K,
	): HTMLElementTagNameMap[K][];
	QUERY_SELECTOR_ALL<E extends Element = HTMLElement>(selector: string): E[];

	ADD_CLASS(target: Element | string, className: string): void;
	REMOVE_CLASS(target: Element | string, className: string): void;
	TOGGLE_CLASS(
		target: Element | string,
		className: string,
		force?: boolean,
	): boolean | undefined;
	HAS_CLASS(target: Element | string, className: string): boolean;
	GET_ATTRIBUTE(target: Element | string, attr: string): string | null;
	SET_ATTRIBUTE(target: Element | string, attr: string, value: string): void;
	GET_DATA_ATTRIBUTE(
		target: HTMLElement | string,
		key: string,
	): string | undefined;
	SET_DATA_ATTRIBUTE(
		target: HTMLElement | string,
		key: string,
		value: string,
	): void;
	ON<K extends keyof HTMLElementEventMap>(
		target: EventTarget | string,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void,
		options?: boolean | AddEventListenerOptions,
	): (() => void) | null;
	CREATE_ELEMENT<T extends keyof HTMLElementTagNameMap>(
		tagName: T,
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
	// Regla Singleton: Instancia estática privada[cite: 1, 2]
	private static instance: DomService;

	// Regla Singleton: Constructor privado que previene new DomService()[cite: 1, 2]
	private constructor() {}
	ON<K extends keyof HTMLElementEventMap>(
		___target: EventTarget | string,
		_event: K,
		_callback: (event: HTMLElementEventMap[K]) => void,
		_options?: boolean | AddEventListenerOptions,
	): (() => void) | null {
		throw new Error("Method not implemented.");
	}

	// Regla Singleton: Punto de acceso global único[cite: 1, 2]
	public static getInstance(): DomService {
		if (!DomService.instance) {
			DomService.instance = new DomService();
		}
		return DomService.instance;
	}

	public IS_BROWSER = (): boolean => {
		return typeof window !== "undefined" && typeof document !== "undefined";
	};

	private RESOLVE = <T extends Element = HTMLElement>(
		target: T | string,
	): T | null => {
		return typeof target === "string" ? this.QUERY_SELECTOR<T>(target) : target;
	};

	public GET_ELEMENT_BY_ID = <T extends HTMLElement = HTMLElement>(
		id: string,
	): T | null => {
		if (!this.IS_BROWSER()) return null;
		return document.getElementById(id) as T | null;
	};

	public GET_ELEMENT_BY_CLASS = <T extends HTMLElement = HTMLElement>(
		className: string,
	): T | null => {
		if (!this.IS_BROWSER()) return null;
		const formattedSelector = className.startsWith(".")
			? className
			: `.${className}`;
		return document.querySelector<T>(formattedSelector);
	};

	// QUERY_SELECTOR con inferencia de etiquetas HTML nativas
	public QUERY_SELECTOR: {
		<K extends keyof HTMLElementTagNameMap>(
			selector: K,
		): HTMLElementTagNameMap[K] | null;
		<E extends Element = HTMLElement>(selector: string): E | null;
	} = <E extends Element = HTMLElement>(selector: string): E | null => {
		if (!this.IS_BROWSER()) return null;
		return document.querySelector<E>(selector);
	};

	// QUERY_SELECTOR_ALL devuelve un array de elementos (no un elemento suelto ni null)[cite: 1]
	public QUERY_SELECTOR_ALL: {
		<K extends keyof HTMLElementTagNameMap>(
			selector: K,
		): HTMLElementTagNameMap[K][];
		<E extends Element = HTMLElement>(selector: string): E[];
	} = <E extends Element = HTMLElement>(selector: string): E[] => {
		if (!this.IS_BROWSER()) return [];
		return Array.from(document.querySelectorAll<E>(selector));
	};

	public ADD_CLASS = (
		target: Element | string,
		className: string,
	): boolean | undefined => {
		return this.RESOLVE(target)?.classList.add(className) ?? false;
	};

	public REMOVE_CLASS = (
		target: Element | string,
		className: string | string[],
	): boolean | undefined => {
		return this.RESOLVE(target)?.classList.remove(...className) ?? false;
	};

	public TOGGLE_CLASS = (
		target: Element | string,
		className: string,
		force?: boolean,
	): boolean | undefined => {
		return this.RESOLVE(target)?.classList.toggle(className, force) ?? false;
	};

	public HAS_CLASS = (target: Element | string, className: string): boolean => {
		return this.RESOLVE(target)?.classList.contains(className) ?? false;
	};

	public GET_ATTRIBUTE = (
		target: Element | string,
		attr: string,
	): string | null => {
		const el = this.RESOLVE(target);
		return el?.getAttribute(attr) ?? null;
	};

	public SET_ATTRIBUTE = (
		target: Element | string,
		attr: string,
		value: string,
	): void => {
		this.RESOLVE(target)?.setAttribute(attr, value);
	};

	public REMOVE_ATTRIBUTE = (target: Element | string, attr: string): void =>
		this.RESOLVE(target)?.removeAttribute(attr);

	public GET_DATA_ATTRIBUTE = (
		target: HTMLElement | string,
		key: DOMStringMap | string | null,
	): string | undefined => {
		return this.RESOLVE<HTMLElement>(target)?.dataset[`${key}`];
	};

	public SET_DATA_ATTRIBUTE = (
		target: HTMLElement | string,
		key: string,
		value: string,
	): void => {
		const el = this.RESOLVE<HTMLElement>(target);
		if (el) el.dataset[key] = value;
	};

	public ON_EVENT = <K extends keyof HTMLElementEventMap>(
		target: EventTarget | string,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void,
		options?: boolean | AddEventListenerOptions,
	): (() => void) | null => {
		if (!this.IS_BROWSER()) return null;
		const el =
			typeof target === "string" ? this.QUERY_SELECTOR(target) : target;
		if (!el) return null;

		const handler = callback as EventListener;
		el.addEventListener(event, handler, options);
		return () => el.removeEventListener(event, handler, options);
	};

	public CREATE_ELEMENT = <T extends keyof HTMLElementTagNameMap>(
		tagName: T,
		options?: ElementCreationOptions | undefined,
	): HTMLElementTagNameMap[T] => {
		if (!this.IS_BROWSER()) {
			throw new Error("Cannot create elements in non-browser environment");
		}
		return document.createElement<T>(tagName, options);
	};

	public SET_HTML = (target: Element | string, html: string): void => {
		const el = this.RESOLVE(target);
		if (el) {
			el.innerHTML = html ?? "";
		}
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

	public REMOVE = (target: Element | string): void =>
		this.RESOLVE(target)?.remove();
}

// ============================================================
// 3. EXPORTACIÓN SEGURA
// ============================================================

export const DOM_SERVICE: DomService = DomService.getInstance();

export const {
	IS_BROWSER,
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
	GET_DATA_ATTRIBUTE,
	SET_DATA_ATTRIBUTE,
	ON_EVENT,
	CREATE_ELEMENT,
	SET_HTML,
	SET_TEXT,
	APPEND,
	REMOVE,
	ON,
}: DomService = DOM_SERVICE;

// ============================================================
// TODO: Usage Examples
// ============================================================

QUERY_SELECTOR_ALL("button").forEach((current) => {
	ON_EVENT(current, "click", (e: Event) => {
		e.preventDefault();
	});
});
