import type { z } from "zod";

import { LazyLoaderEntrySchema } from "@/schemas/core.schema.js";

/** Target can be either an HTMLElement reference or a CSS selector string. */
export type ObserverTarget = HTMLElement | string;

/** Callback invoked when an observed element enters the viewport. */
export type ObserverCallback = (entry: IntersectionObserverEntry) => void;

/** Configuration for a registered IntersectionObserver. */
export interface ObserverConfig {
	callback: ObserverCallback;
	options: IntersectionObserverInit;
	autoUnobserve: boolean;
}

/** Internal registry entry storing an observer instance and its tracked targets. */
export interface ObserverEntry {
	config: ObserverConfig;
	observer: IntersectionObserver | null;
	targets: Set<HTMLElement>;
}

/** Internal registry entry for lazy loading configurations. */
export type LazyLoaderEntry = z.infer<typeof LazyLoaderEntrySchema>;

/** Contract of the DOM facade. */
export interface IDomService {
	useIsBrowser(): boolean;
	useGetRoot(): HTMLElement | null;
	useGetBody(): HTMLBodyElement | null;
	useGetElementById<T extends HTMLElement = HTMLElement>(id: string): T | null;
	useGetElementByClass<T extends HTMLElement = HTMLElement>(className: string): T | null;
	useQuerySelector<K extends keyof HTMLElementTagNameMap>(
		selector: K,
	): HTMLElementTagNameMap[K] | null;
	useQuerySelector<E extends Element = HTMLElement>(selector: string): E | null;
	useQuerySelectorAll<K extends keyof HTMLElementTagNameMap>(
		selector: K,
	): HTMLElementTagNameMap[K][];
	useQuerySelectorAll<E extends Element = HTMLElement>(selector: string): E[];
	useAddClass(target: Element | string, className: string): void;
	useRemoveClass(target: Element | string, className: string | string[]): void;
	useToggleClass(target: Element | string, className: string, force?: boolean): boolean | undefined;
	useHasClass(target: Element | string, className: string): boolean;
	useGetAttribute(target: Element | string, attr: string): string | null;
	useSetAttribute(target: Element | string, attr: string, value: string): void;
	useRemoveAttribute(target: Element | string, attr: string): void;
	useGetDataAttribute(target: HTMLElement | string, key: string): string | undefined;
	useSetDataAttribute(target: HTMLElement | string, key: string, value: string): void;
	useOn<K extends keyof HTMLElementEventMap>(
		target: EventTarget | string,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void,
		options?: boolean | AddEventListenerOptions,
	): (() => void) | null;
	useCreateElement<T extends keyof HTMLElementTagNameMap>(
		tagName: T,
		options?: ElementCreationOptions,
	): HTMLElementTagNameMap[T];
	useSetHtml(target: Element | string, html: string): void;
	useSetText(target: Element | string, text: string): void;
	useAppend(target: Element | string, child: Element | string): void;
	useRemove(target: Element | string): void;
}
