import type {
	ApiEntry,
	ApisConfig,
	ConfigFacade,
	ConfigMethod,
	FetchOptions,
	FetchRequest,
	FetchResult,
	RequestInterceptor,
	UrlOptions,
} from "@/types/index.js";

import { useTryJsonParse } from "./result.service.js";
import { useSplitConfig } from "./utils.service.js";

/** Error bodies are truncated so a hostile response cannot exhaust memory. */
const MAX_ERROR_BODY_CHARS = 32 * 1024;

/**
 * Internal: narrows an unknown literal entry to an {@link ApiEntry}.
 *
 * @param value - A non-method value from a `defineApiConfig` literal.
 * @returns `true` when the value looks like a registered API entry.
 */
function isApiEntry(value: unknown): value is ApiEntry {
	return typeof value === "object" && value !== null && "baseUri" in value && "endpoints" in value;
}

/**
 * Internal: narrows an unknown value to a plain object (not `null`, not an
 * array). Used to validate the `apis` and `methods` sections before anything
 * reaches the registry.
 *
 * @param value - The value to inspect.
 * @returns `true` for a non-null, non-array object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Internal: reads a Response body, attempting JSON parse for JSON content types.
 *
 * @param response - The fetch Response to read.
 * @returns The parsed body or `null` for empty responses.
 */
async function readBody(response: Response, maxChars?: number): Promise<unknown> {
	const text = await response.text();
	if (!text) return null;

	if (maxChars !== undefined && text.length > maxChars) {
		return `${text.slice(0, maxChars)}… [truncated]`;
	}

	// JSON first; non-JSON bodies fall back to the raw text.
	const parsed = useTryJsonParse(text);
	return parsed.ok ? parsed.data : text;
}

/**
 * Internal: serializes a request body.
 * Leaves FormData / Blob / URLSearchParams / ArrayBuffer / TypedArray /
 * ReadableStream / string untouched (no forced JSON Content-Type so the
 * runtime can set the multipart boundary).
 *
 * @param body - The body to serialize.
 * @returns An object with optional `body` and `headers` for `fetch`.
 */
function serializeBody(body: unknown): { body?: BodyInit; headers?: HeadersInit } {
	if (body === undefined) return {};

	const isRawBody =
		(typeof FormData !== "undefined" && body instanceof FormData) ||
		(typeof Blob !== "undefined" && body instanceof Blob) ||
		(typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) ||
		(typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) ||
		ArrayBuffer.isView(body) ||
		(typeof ReadableStream !== "undefined" && body instanceof ReadableStream) ||
		typeof body === "string";

	if (isRawBody) {
		return { body: body as BodyInit };
	}

	return {
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	};
}

/**
 * Picks the URL-building keys out of an options bag so nothing else leaks into
 * the `RequestInit` handed to `fetch`.
 *
 * @param urlOptions - Legacy URL options, if any.
 * @returns Only `params`, `query` and `ignoreDefaultQuery`, when defined.
 */
function pickUrl(urlOptions?: UrlOptions): UrlOptions {
	if (!urlOptions) return {};
	const { params, query, ignoreDefaultQuery } = urlOptions;
	return {
		...(params !== undefined && { params }),
		...(query !== undefined && { query }),
		...(ignoreDefaultQuery !== undefined && { ignoreDefaultQuery }),
	};
}

/**
 * FetchApiManager - Singleton para el registro de APIs y peticiones HTTP.
 *
 * Aplica el patrón Singleton: una única instancia mantiene el registro de APIs
 * (`ApisConfig`) y centraliza la construcción de URLs y las peticiones fetch,
 * devolviendo siempre Safe Results (nunca lanza en rutas async).
 *
 * @example
 * ```ts
 * const fetchApi = FetchApiManager.getInstance();
 * fetchApi.useInit({ pokeapi: { baseUri: "https://pokeapi.co/api/v2", endpoints: { byId: "/pokemon/:id/" } } });
 * const result = await fetchApi.useFetch("pokeapi", "byId", { params: { id: 25 } });
 * ```
 */
export class FetchApiManager {
	private static instance: FetchApiManager;

	/** Module-level API registry. */
	private apis: ApisConfig = {};

	/** Request interceptors in registration order. */
	private requestInterceptors: { interceptor: RequestInterceptor }[] = [];

	/**
	 * Constructor privado - enforce singleton.
	 */
	private constructor() {}

	/**
	 * Obtiene la instancia única del FetchApiManager (Singleton).
	 *
	 * @returns La instancia única de {@link FetchApiManager}.
	 */
	static getInstance(): FetchApiManager {
		if (!FetchApiManager.instance) {
			FetchApiManager.instance = new FetchApiManager();
		}
		return FetchApiManager.instance;
	}

	/**
	 * Internal: retrieves a registered API entry or throws.
	 *
	 * @param apiName - The key of the API in the registry.
	 * @returns The {@link ApiEntry} for the given name.
	 * @throws {Error} If the API is not registered.
	 */
	private useGetApiEntry(apiName: string): ApiEntry {
		const api = this.apis[apiName];
		if (!api) {
			throw new Error(`[FetchApiManager] API "${apiName}" is not registered.`);
		}
		return api;
	}

	/**
	 * Registers (merges) API definitions into the client registry.
	 *
	 * @param apisConfig - The API definitions to merge into the registry.
	 *
	 * @example
	 * ```ts
	 * FetchApiManager.getInstance().useInit({
	 *   pokeapi: { baseUri: "https://pokeapi.co/api/v2", endpoints: { pokemonById: "/pokemon/:id/" } },
	 * });
	 * ```
	 */
	useInit(apisConfig: ApisConfig): void {
		this.apis = { ...this.apis, ...apisConfig };
	}

	/**
	 * Returns a shallow copy of the registered APIs (safe to mutate locally).
	 *
	 * @returns A shallow copy of the current API registry.
	 */
	useGetApis(): ApisConfig {
		return { ...this.apis };
	}

	/**
	 * Registers a request interceptor, which runs before `fetch` on every request.
	 * Interceptors run sequentially in registration order and can mutate `url` or
	 * `init`. The returned function unregisters this interceptor.
	 *
	 * @param interceptor - The function to run before the request is sent.
	 * @returns A function that unregisters the interceptor.
	 */
	useAddRequestInterceptor(interceptor: RequestInterceptor): () => void {
		const registration = { interceptor };
		this.requestInterceptors.push(registration);

		return () => {
			const index = this.requestInterceptors.indexOf(registration);
			if (index !== -1) this.requestInterceptors.splice(index, 1);
		};
	}

	/**
	 * Returns the URL of a registered endpoint **without calling `fetch`**.
	 *
	 * It builds the same URL {@link useFetch} would request - same registry,
	 * same `:param` substitution, same `query` merge with `defaultQueryParams`,
	 * same http(s) guard - then stops and hands you the string.
	 *
	 * @param apiName - Registered API key (from `defineApiConfig`).
	 * @param endpointName - Endpoint key inside that API.
	 * @param options - `params` fills `:placeholders`, `query` becomes the search string.
	 * @returns The fully built URL.
	 * @throws {Error} Unknown API, unknown endpoint, or a scheme that is not http(s).
	 *
	 * @example
	 * ```ts
	 * FetchApiManager.getInstance().useBuildUrl("pokeapi", "pokemonById", { params: { id: 25 } });
	 * // → "https://pokeapi.co/api/v2/pokemon/25"
	 * ```
	 *
	 * @remarks Synchronous, so it **throws** instead of returning a Safe Result -
	 * Safe Result covers fallible async work, and this never leaves the process.
	 */
	useBuildUrl(apiName: string, endpointName: string, options: UrlOptions = {}): string {
		const { params, query, ignoreDefaultQuery = false } = options;
		const api = this.useGetApiEntry(apiName);
		let path = api.endpoints?.[endpointName] ?? "";

		if (!path) {
			throw new Error(`[FetchApiManager] Endpoint "${endpointName}" not found in API "${apiName}".`);
		}

		if (params) {
			const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			path = Object.entries(params).reduce(
				(acc, [key, value]) =>
					acc.replace(new RegExp(`:${escapeRegex(key)}\\b`, "g"), encodeURIComponent(String(value))),
				path,
			);
		}

		const baseStr = api.baseUri instanceof URL ? api.baseUri.toString() : api.baseUri;
		const baseClean = baseStr.endsWith("/") ? baseStr.slice(0, -1) : baseStr;
		const pathClean = path.startsWith("/") ? path : `/${path}`;
		const url = new URL(`${baseClean}${pathClean}`);

		// Only allow http(s) to prevent SSRF and `javascript:` URLs.
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			throw new Error(`[FetchApiManager] Scheme "${url.protocol}" is not allowed.`);
		}

		const defaultParams = ignoreDefaultQuery ? {} : (api.defaultQueryParams?.[endpointName] ?? {});

		const mergedQuery = { ...defaultParams, ...query };

		for (const [key, value] of Object.entries(mergedQuery)) {
			if (value !== undefined && value !== null) {
				url.searchParams.set(key, String(value));
			}
		}

		return url.toString();
	}

	/**
	 * Fetches a registered endpoint and returns a Safe Result.
	 *
	 * URL options sit at the top level, next to `method`/`headers`/`body` - no
	 * nesting, same shape as `useGet` and Nuxt's `useFetch`.
	 *
	 * @param apiName - The registered API key.
	 * @param endpointName - The endpoint key within the API.
	 * @param options - Fetch options: `params`, `query`, `transform` and any `RequestInit` field.
	 * @returns A `FetchResult` with data or error. Never throws - a failing
	 *   `transform` comes back as an error result too.
	 *
	 * @example
	 * ```ts
	 * const result = await FetchApiManager.getInstance().useFetch<{ results: unknown[] }>(
	 *   "pokeapi",
	 *   "pokemons",
	 *   { method: "GET", query: { limit: 2 } },
	 * );
	 * if (result.ok) console.log(result.data.results);
	 * ```
	 */
	async useFetch<T = unknown>(
		apiName: string,
		endpointName: string,
		{ params, query, ignoreDefaultQuery, transform, ...init }: FetchOptions<T> = {},
	): Promise<FetchResult<T>> {
		let url = "";

		try {
			url = this.useBuildUrl(apiName, endpointName, { params, query, ignoreDefaultQuery });
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			return {
				data: null,
				error: {
					message: `Config Error: ${message}`,
					status: 0,
				},
				url,
				status: 0,
				ok: false,
			};
		}

		const interceptors = [...this.requestInterceptors];
		let request: FetchRequest | undefined;
		if (interceptors.length > 0) {
			request = { url, init: { redirect: "error", ...init } };
			try {
				for (const { interceptor } of interceptors) {
					await interceptor(request);
				}

				const requestUrl = new URL(request.url);
				if (requestUrl.protocol !== "http:" && requestUrl.protocol !== "https:") {
					throw new Error(`Request URL scheme "${requestUrl.protocol}" is not allowed.`);
				}
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				url = request.url;
				return {
					data: null,
					error: {
						message: `Request Interceptor Error: ${message}`,
						status: 0,
					},
					url,
					status: 0,
					ok: false,
				};
			}
			url = request.url;
		}

		try {
			// Fail closed on redirects: the scheme allow-list only validates the
			// initial URL, so following a 3xx could steer the request to a private
			// host (SSRF). Callers that need redirects can pass `redirect: "follow"`.
			const response = request
				? await fetch(request.url, request.init)
				: await fetch(url, { redirect: "error", ...init });

			if (!response.ok) {
				const errorDetails = await readBody(response, MAX_ERROR_BODY_CHARS);

				return {
					data: null,
					error: {
						message: `HTTP Error: ${response.statusText || "Unsuccessful response"}`,
						status: response.status,
						details: errorDetails,
					},
					url: response.url || url,
					status: response.status,
					ok: false,
				};
			}

			// 204 No Content and empty bodies are valid success responses.
			const body = response.status === 204 ? null : await readBody(response);

			let data: unknown = body;
			if (transform) {
				try {
					data = await transform(body);
				} catch (err: unknown) {
					// A failing transform is still a failed request - return it as a
					// Safe Result instead of letting it escape `useFetch`.
					const message = err instanceof Error ? err.message : String(err);
					return {
						data: null,
						error: {
							message: `Transform Error: ${message}`,
							status: response.status,
						},
						url: response.url || url,
						status: response.status,
						ok: false,
					};
				}
			}

			return {
				data: data as T,
				error: null,
				url: response.url || url,
				status: response.status,
				ok: true,
			};
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			return {
				data: null,
				error: {
					message: `Network/Client Error: ${message}`,
					status: 0,
				},
				url,
				status: 0,
				ok: false,
			};
		}
	}

	/**
	 * GET helper over a registered API endpoint.
	 *
	 * @param apiName - The registered API key.
	 * @param endpointName - The endpoint key within the API.
	 * @param urlOptions - Optional URL building options.
	 * @returns A `FetchResult` with data or error.
	 */
	async useGet<T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> {
		return this.useFetch<T>(apiName, endpointName, {
			method: "GET",
			...pickUrl(urlOptions),
		});
	}

	/**
	 * POST helper over a registered API endpoint.
	 *
	 * @param apiName - The registered API key.
	 * @param endpointName - The endpoint key within the API.
	 * @param body - Optional request body (auto-serialized to JSON unless raw).
	 * @param urlOptions - Optional URL building options.
	 * @returns A `FetchResult` with data or error.
	 */
	async usePost<T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> {
		return this.useFetch<T>(apiName, endpointName, {
			method: "POST",
			...serializeBody(body),
			...pickUrl(urlOptions),
		});
	}

	/**
	 * PUT helper over a registered API endpoint.
	 *
	 * @param apiName - The registered API key.
	 * @param endpointName - The endpoint key within the API.
	 * @param body - Optional request body (auto-serialized to JSON unless raw).
	 * @param urlOptions - Optional URL building options.
	 * @returns A `FetchResult` with data or error.
	 */
	async usePut<T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> {
		return this.useFetch<T>(apiName, endpointName, {
			method: "PUT",
			...serializeBody(body),
			...pickUrl(urlOptions),
		});
	}

	/**
	 * PATCH helper over a registered API endpoint.
	 *
	 * @param apiName - The registered API key.
	 * @param endpointName - The endpoint key within the API.
	 * @param body - Optional request body (auto-serialized to JSON unless raw).
	 * @param urlOptions - Optional URL building options.
	 * @returns A `FetchResult` with data or error.
	 */
	async usePatch<T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> {
		return this.useFetch<T>(apiName, endpointName, {
			method: "PATCH",
			...serializeBody(body),
			...pickUrl(urlOptions),
		});
	}

	/**
	 * DELETE helper over a registered API endpoint.
	 *
	 * @param apiName - The registered API key.
	 * @param endpointName - The endpoint key within the API.
	 * @param urlOptions - Optional URL building options.
	 * @returns A `FetchResult` with data or error.
	 */
	async useDelete<T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> {
		return this.useFetch<T>(apiName, endpointName, {
			method: "DELETE",
			...pickUrl(urlOptions),
		});
	}
}

/* -------------------------------------------------------------------------- */
/* define*Config                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Declares the API registry in a single call - the config-file entry point.
 *
 * Flat entries stay supported: every {@link ApiEntry} you list is registered,
 * boolean flags are kept on `config`, and methods are returned on the facade.
 * On top of that it accepts the Options-API-style sections:
 *
 * - `apis` - a registry group, registered exactly like flat entries.
 * - `data()` - returns the mutable facade state, exposed as `this.data`.
 * - `onInit()` - runs once, after registration, with the facade as `this`.
 * - `methods` - callable methods, merged flat onto the facade.
 *
 * One `export default` is the whole setup: no second registration step.
 *
 * @typeParam T - The literal passed in.
 * @param input - API entries, flags, sections and methods in one object literal.
 * @returns The registered config plus the declared methods (see `ConfigFacade`).
 * @throws {Error} If a non-method value is an object that is not an API entry,
 *   if a section has the wrong shape, or if a `methods` entry is not a function.
 *
 * @example
 * ```ts
 * import { defineApiConfig, useFetch } from "katanakit-js";
 *
 * export default defineApiConfig({
 *   apis: {
 *     pokeapi: { baseUri: "https://pokeapi.co/api/v2", endpoints: { byId: "/pokemon/:id/" } },
 *   },
 *   data: () => ({ calls: 0 }),
 *   onInit() {
 *     // Runs once, after registration. Synchronous on purpose.
 *   },
 *   methods: {
 *     async getPokemon(id: number) {
 *       this.data.calls += 1;
 *       return useFetch("pokeapi", "byId", { params: { id } });
 *     },
 *   },
 * });
 * ```
 *
 * @remarks Methods must be written as method shorthand or with `function`, not
 * as arrows - `this` is undefined inside an arrow function.
 *
 * `data` is plain mutable state: it is not reactive and it is shared by every
 * method of that facade. `onInit` is synchronous because it runs while the
 * module is evaluated; do async work in a method.
 *
 * `apis`, `data`, `onInit` and `methods` are reserved: an API or method with
 * one of those names must be declared under `apis` / `methods` instead.
 */
export function defineApiConfig<T extends object>(
	input: T & ThisType<ConfigFacade<T>>,
): ConfigFacade<T> {
	const { apis, data, onInit, methods, ...flat } = input as T & {
		apis?: ApisConfig;
		data?: () => object;
		onInit?: ConfigMethod;
		methods?: Record<string, ConfigMethod>;
	};

	// Every section is validated before the singleton registry is touched.
	if (data !== undefined && typeof data !== "function") {
		throw new Error(
			'[FetchApiManager] defineApiConfig: "data" must be a function returning the state object.',
		);
	}
	if (onInit !== undefined && typeof onInit !== "function") {
		throw new Error('[FetchApiManager] defineApiConfig: "onInit" must be a function.');
	}
	if (methods !== undefined && !isRecord(methods)) {
		throw new Error('[FetchApiManager] defineApiConfig: "methods" must be an object of functions.');
	}
	if (apis !== undefined && !isRecord(apis)) {
		throw new Error('[FetchApiManager] defineApiConfig: "apis" must be an object of API entries.');
	}

	const grouped: ApisConfig = {};
	for (const [name, entry] of Object.entries(apis ?? {})) {
		if (!isApiEntry(entry)) {
			throw new Error(
				`[FetchApiManager] defineApiConfig: "${name}" in "apis" is not an API entry ` +
					`(expected an object with baseUri and endpoints).`,
			);
		}
		grouped[name] = entry;
	}

	const nested = methods ?? {};
	for (const [name, method] of Object.entries(nested)) {
		if (typeof method !== "function") {
			throw new Error(`[FetchApiManager] defineApiConfig: "methods.${name}" must be a function.`);
		}
	}

	const { config, methods: flatMethods } = useSplitConfig(flat);

	const registered: ApisConfig = { ...grouped };
	for (const [name, value] of Object.entries(config)) {
		if (isApiEntry(value)) {
			registered[name] = value;
			continue;
		}
		if (typeof value === "object" && value !== null) {
			throw new Error(
				`[FetchApiManager] defineApiConfig: "${name}" is not an API entry ` +
					`(expected an object with baseUri and endpoints).`,
			);
		}
	}
	FetchApiManager.getInstance().useInit(registered);

	const state = data ? data() : {};
	// The sections widen the literal, so TS cannot prove the exact facade shape.
	const facade = { config, data: state, ...flatMethods, ...nested } as unknown as ConfigFacade<T>;

	// `onInit` sees the finished facade: state, config and every method.
	if (onInit) onInit.call(facade);

	return facade;
}

/* -------------------------------------------------------------------------- */
/* Wrappers (backward compatibility)                                          */
/* -------------------------------------------------------------------------- */

/**
 * Registers a request interceptor on the singleton HTTP client.
 *
 * @param interceptor - The function to run before the request is sent.
 * @returns A function that unregisters the interceptor.
 */
export function useAddRequestInterceptor(interceptor: RequestInterceptor): () => void {
	return FetchApiManager.getInstance().useAddRequestInterceptor(interceptor);
}

/**
 * Returns a shallow copy of the registered APIs (safe to mutate locally).
 *
 * @returns A shallow copy of the current API registry.
 *
 * @example
 * ```ts
 * import { useGetApis } from "katanakit-js";
 *
 * const apis = useGetApis();
 * ```
 */
export function useGetApis(): ApisConfig {
	return FetchApiManager.getInstance().useGetApis();
}

/**
 * Returns a shallow copy of the registered APIs. Alias for {@link useGetApis}.
 *
 * @returns A shallow copy of the current API registry.
 */
export function useGetApisConfig(): ApisConfig {
	return useGetApis();
}

/**
 * Returns the URL of a registered endpoint **without calling `fetch`**.
 *
 * @param apiName - Registered API key (from `defineApiConfig`).
 * @param endpointName - Endpoint key inside that API.
 * @param options - `params` fills `:placeholders`, `query` becomes the search string.
 * @returns The fully built URL.
 * @throws {Error} Unknown API, unknown endpoint, or a scheme that is not http(s).
 *
 * @example
 * ```ts
 * import { useBuildUrl } from "katanakit-js";
 *
 * useBuildUrl("pokeapi", "pokemonById", { params: { id: 25 } });
 * // → "https://pokeapi.co/api/v2/pokemon/25"
 * ```
 */
export function useBuildUrl(
	apiName: string,
	endpointName: string,
	options: UrlOptions = {},
): string {
	return FetchApiManager.getInstance().useBuildUrl(apiName, endpointName, options);
}

/**
 * Fetches a registered endpoint and returns a Safe Result.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param options - Fetch options: `params`, `query`, `transform` and any `RequestInit` field.
 * @returns A `FetchResult` with data or error. Never throws.
 *
 * @example
 * ```ts
 * import { useFetch } from "katanakit-js";
 *
 * const result = await useFetch("pokeapi", "pokemonById", { params: { id: 25 } });
 * if (result.ok) console.log(result.data);
 * ```
 */
export async function useFetch<T = unknown>(
	apiName: string,
	endpointName: string,
	options: FetchOptions<T> = {},
): Promise<FetchResult<T>> {
	return FetchApiManager.getInstance().useFetch<T>(apiName, endpointName, options);
}

/**
 * Fetches a registered endpoint and returns a Safe Result.
 * Alias for {@link useFetch}.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param options - Optional fetch options.
 * @returns A `FetchResult` with data or error.
 */
export async function useFetchApi<T = unknown>(
	apiName: string,
	endpointName: string,
	options?: FetchOptions<T>,
): Promise<FetchResult<T>> {
	return useFetch<T>(apiName, endpointName, options);
}

/**
 * GET helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param urlOptions - Optional URL building options.
 * @returns A `FetchResult` with data or error.
 *
 * @example
 * ```ts
 * import { useGet } from "katanakit-js";
 *
 * const result = await useGet("pokeapi", "pokemonById", { params: { id: 25 } });
 * ```
 */
export async function useGet<T = unknown>(
	apiName: string,
	endpointName: string,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return FetchApiManager.getInstance().useGet<T>(apiName, endpointName, urlOptions);
}

/**
 * GET helper over a registered API endpoint. Alias for {@link useGet}.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param urlOptions - Optional URL building options.
 * @returns A `FetchResult` with data or error.
 */
export async function useGetApi<T = unknown>(
	apiName: string,
	endpointName: string,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return useGet<T>(apiName, endpointName, urlOptions);
}

/**
 * POST helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param body - Optional request body (auto-serialized to JSON unless raw).
 * @param urlOptions - Optional URL building options.
 * @returns A `FetchResult` with data or error.
 *
 * @example
 * ```ts
 * import { usePost } from "katanakit-js";
 *
 * const result = await usePost("pokeapi", "createPokemon", { name: "Pikachu" });
 * ```
 */
export async function usePost<T = unknown>(
	apiName: string,
	endpointName: string,
	body?: unknown,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return FetchApiManager.getInstance().usePost<T>(apiName, endpointName, body, urlOptions);
}

/**
 * PUT helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param body - Optional request body (auto-serialized to JSON unless raw).
 * @param urlOptions - Optional URL building options.
 * @returns A `FetchResult` with data or error.
 */
export async function usePut<T = unknown>(
	apiName: string,
	endpointName: string,
	body?: unknown,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return FetchApiManager.getInstance().usePut<T>(apiName, endpointName, body, urlOptions);
}

/**
 * PATCH helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param body - Optional request body (auto-serialized to JSON unless raw).
 * @param urlOptions - Optional URL building options.
 * @returns A `FetchResult` with data or error.
 */
export async function usePatch<T = unknown>(
	apiName: string,
	endpointName: string,
	body?: unknown,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return FetchApiManager.getInstance().usePatch<T>(apiName, endpointName, body, urlOptions);
}

/**
 * DELETE helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param urlOptions - Optional URL building options.
 * @returns A `FetchResult` with data or error.
 */
export async function useDelete<T = unknown>(
	apiName: string,
	endpointName: string,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return FetchApiManager.getInstance().useDelete<T>(apiName, endpointName, urlOptions);
}
