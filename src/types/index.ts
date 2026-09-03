import type { Temporal } from "@js-temporal/polyfill";

/* -------------------------------------------------------------------------- */
/* Logging                                                                    */
/* -------------------------------------------------------------------------- */

export type LogLevel = "log" | "info" | "warn" | "error" | "debug";

/* -------------------------------------------------------------------------- */
/* DOM / Observers                                                            */
/* -------------------------------------------------------------------------- */

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
export interface LazyLoaderEntry {
	selector: string;
	observerKey: string;
}

/* -------------------------------------------------------------------------- */
/* Sensors                                                                    */
/* -------------------------------------------------------------------------- */

/** Represents a geographic position with latitude, longitude and accuracy. */
export interface GeoPosition {
	lat: number;
	lng: number;
	accuracy: number;
}

/** Type for the experimental Battery API. */
export interface BatteryManager extends EventTarget {
	charging: boolean;
	chargingTime: number;
	dischargingTime: number;
	level: number;
}

/* -------------------------------------------------------------------------- */
/* Workers                                                                    */
/* -------------------------------------------------------------------------- */

export type WorkerFunc<TInput = unknown, TOutput = unknown> = (
	data: TInput,
) => TOutput | Promise<TOutput>;

export interface WorkerPoolEntry<TInput = unknown, TOutput = unknown> {
	worker: Worker;
	workerUrl: string;
	func: WorkerFunc<TInput, TOutput>;
}

/* -------------------------------------------------------------------------- */
/* Storage                                                                    */
/* -------------------------------------------------------------------------- */

export type StorageTarget = "localStorage" | "sessionStorage";

/* -------------------------------------------------------------------------- */
/* Locale / Currency                                                          */
/* -------------------------------------------------------------------------- */

export type Locale = "en" | "es" | "fr" | "de" | "it" | "pt" | "ja" | "zh";

export type Currency =
	| "EUR"
	| "USD"
	| "GBP"
	| "JPY"
	| "CAD"
	| "MXN"
	| "CHF"
	| "AUD"
	| "BRL"
	| "CNY"
	| "ARS"
	| "COP"
	| "CLP";

export interface CurrencyFormatOptions {
	amount: number;
	currency?: Currency;
	taxes?: number;
	locale?: Locale;
}

export interface NumberFormatOptions {
	locale?: Locale;
	digits?: number;
}

/* -------------------------------------------------------------------------- */
/* Dates                                                                      */
/* -------------------------------------------------------------------------- */

export type TemporalInput =
	| string
	| number
	| Date
	| Temporal.PlainDate
	| Temporal.PlainDateTime
	| Temporal.ZonedDateTime
	| Temporal.Instant;

export interface AppDateFormatOptions {
	year?: "numeric" | "2-digit";
	month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
	day?: "numeric" | "2-digit";
}

/** Backwards-compatible alias for {@link AppDateFormatOptions}. */
export type DateFormatOptions = AppDateFormatOptions;

/* -------------------------------------------------------------------------- */
/* HTTP / Fetch                                                               */
/* -------------------------------------------------------------------------- */

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export type PathParams = Record<string, string | number>;

export interface UrlOptions {
	params?: PathParams;
	query?: QueryParams;
	ignoreDefaultQuery?: boolean;
}

export interface ApiEntry {
	baseUri: string | URL;
	endpoints: Record<string, string>;
	defaultQueryParams?: Record<string, QueryParams>;
}

export type ApisConfig = Record<string, ApiEntry>;

/** Options passed when executing a fetch request. */
export interface FetchOptions extends RequestInit {
	urlOptions?: UrlOptions;
}

/** Structure of the safe error returned on non-2xx or network failures. */
export interface ApiError {
	message: string;
	status: number;
	details?: unknown;
}

/**
 * Safe result, discriminated union (Astro Actions style) without throwing.
 * The `ok` flag narrows the union between the success and error branches.
 */
export type FetchResult<T = unknown> =
	| {
			data: T;
			error: null;
			url: string;
			status: number;
			ok: true;
	  }
	| {
			data: null;
			error: ApiError;
			url: string;
			status: number;
			ok: false;
	  };
