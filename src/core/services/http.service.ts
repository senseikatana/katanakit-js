import type {
	ApiConfigValue,
	ApiEntry,
	ApisConfig,
	ConfigFacade,
	ConfigValues,
	FetchOptions,
	FetchResult,
	UrlOptions,
} from "../../types/index.js";
import { useTryJsonParse } from "./result.service.js";
import { useSplitConfig } from "./utils.service.js";

/** Module-level API registry. */
let apis: ApisConfig = {};

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
 * Internal: retrieves a registered API entry or throws.
 *
 * @param apiName - The key of the API in the registry.
 * @returns The {@link ApiEntry} for the given name.
 * @throws {Error} If the API is not registered.
 */
function getApiEntry(apiName: string): ApiEntry {
	const api = apis[apiName];
	if (!api) {
		throw new Error(`[FetchApiManager] API "${apiName}" is not registered.`);
	}
	return api;
}

/**
 * Internal: reads a Response body, attempting JSON parse for JSON content types.
 *
 * @param response - The fetch Response to read.
 * @returns The parsed body or `null` for empty responses.
 */
/** Error bodies are truncated so a hostile response cannot exhaust memory. */
const MAX_ERROR_BODY_CHARS = 32 * 1024;

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
 * Declares the API registry in a single call — the config-file entry point.
 *
 * Registers every {@link ApiEntry} you list and returns them alongside the
 * props, flags and methods declared on the same literal, so one `export default`
 * is the whole setup: no second `useInitApis(...)` step.
 *
 * Only object entries shaped like `{ baseUri, endpoints }` reach the registry;
 * boolean flags are kept on `config` for your own methods to read.
 *
 * @typeParam T - The literal passed in.
 * @param input - API entries, flags and methods in one object literal.
 * @returns The registered config plus the declared methods (see {@link ConfigFacade}).
 * @throws {Error} If a non-method value is an object that is not an API entry.
 *
 * @example
 * ```ts
 * import { defineApiConfig } from "katanakit-js";
 *
 * export default defineApiConfig({
 *   pokeapi: { baseUri: "https://pokeapi.co/api/v2", endpoints: { byId: "/pokemon/:id/" } },
 *   debug: true,
 *   getPokemon: async function () {
 *     return useFetch("pokeapi", "byId", { params: { id: 25 } });
 *   },
 * });
 * ```
 *
 * @remarks Methods must be written with `function`, not as arrows — `this.config`
 * is undefined inside an arrow function.
 */
export function defineApiConfig<T extends object>(
	input: T & ThisType<ConfigFacade<T>> & ConfigValues<NoInfer<T>, ApiConfigValue>,
): ConfigFacade<T> {
	const { config, methods } = useSplitConfig(input);

	const registered: ApisConfig = {};
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
	useInitApis(registered);

	// `methods` is a generic spread, so TS cannot prove the exact facade shape.
	return { config, ...methods } as ConfigFacade<T>;
}

/**
 * Registers (merges) API definitions into the client registry.
 *
 * @deprecated Use {@link defineApiConfig}, which registers the config and
 * returns it with any methods declared on the same literal.
 *
 * @param apisConfig - The API definitions to merge into the registry.
 *
 * @example
 * ```ts
 * import { useInit } from "katanakit-js";
 *
 * useInit({
 *   pokeapi: {
 *     baseUri: "https://pokeapi.co/api/v2",
 *     endpoints: { pokemonById: "/pokemon/:id/" },
 *   },
 * });
 * ```
 */
export function useInit(apisConfig: ApisConfig): void {
	apis = { ...apis, ...apisConfig };
}

/**
 * Registers (merges) API definitions into the client registry.
 *
 * @deprecated Use {@link defineApiConfig}, which registers the config and
 * returns it with any methods declared on the same literal.
 *
 * @param apisConfig - The API definitions to merge into the registry.
 *
 * @example
 * ```ts
 * import { useInitApis } from "katanakit-js";
 *
 * useInitApis({
 *   pokeapi: {
 *     baseUri: "https://pokeapi.co/api/v2",
 *     endpoints: { pokemonById: "/pokemon/:id/" },
 *   },
 * });
 * ```
 */
export function useInitApis(apisConfig: ApisConfig): void {
	useInit(apisConfig);
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
	return { ...apis };
}

/**
 * Returns a shallow copy of the registered APIs.
 * Alias for {@link useGetApis}.
 *
 * @returns A shallow copy of the current API registry.
 *
 * @example
 * ```ts
 * import { useGetApisConfig } from "katanakit-js";
 *
 * const apis = useGetApisConfig();
 * ```
 */
export function useGetApisConfig(): ApisConfig {
	return useGetApis();
}

/**
 * Returns the URL of a registered endpoint **without making the request**.
 *
 * Think of it as `useFetch` minus the fetch: same registry, same `:param`
 * substitution, same `query` merge with `defaultQueryParams`, same http(s)
 * guard — but it returns a `string` instead of calling `fetch`.
 *
 * Use it when you need the **address**, not the response:
 *
 * - `<a href>` / `<img src>` — links and media built from an endpoint name
 * - libraries that fetch on their own (charts, maps, analytics)
 * - logging the exact URL you are about to request
 * - SSR / prerender, where nothing should be requested
 *
 * @param apiName - Registered API key (from {@link defineApiConfig}).
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
 *
 * useBuildUrl("myApi", "export", { query: { format: "pdf" } });
 * // → "https://api.myapp.com/v1/export?format=pdf"
 *
 * <a href={useBuildUrl("myApi", "download", { params: { id: 42 } })}>Download</a>
 * ```
 *
 * @remarks Synchronous, so it **throws** instead of returning a Safe Result —
 * Safe Result covers fallible async work, and this never leaves the process.
 * To see the URL a request actually used, read `result.url` off a `useFetch`
 * result instead.
 */
export function useBuildUrl(
	apiName: string,
	endpointName: string,
	options: UrlOptions = {},
): string {
	const { params, query, ignoreDefaultQuery = false } = options;
	const api = getApiEntry(apiName);
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
 * Builds a safe http(s) URL from a registered API + endpoint.
 *
 * @deprecated Use {@link useBuildUrl}. This is a byte-for-byte alias of it and
 * exists only for backwards compatibility — scheduled for removal in the next major.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param options - Optional URL building options.
 * @returns The fully constructed URL string.
 *
 * @example
 * ```ts
 * import { useBuildApiUrl } from "katanakit-js";
 *
 * const url = useBuildApiUrl("pokeapi", "pokemonById", { params: { id: 25 } });
 * ```
 */
export function useBuildApiUrl(
	apiName: string,
	endpointName: string,
	options: UrlOptions = {},
): string {
	return useBuildUrl(apiName, endpointName, options);
}

/**
 * Fetches a registered endpoint and returns a Safe Result.
 *
 * URL options sit at the top level, next to `method`/`headers`/`body` — no
 * nesting, same shape as `useGet` and Nuxt's `useFetch`.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param options - Fetch options: `params`, `query`, `transform` and any `RequestInit` field.
 * @returns A {@link FetchResult} with data or error. Never throws — a failing
 *   `transform` comes back as an error result too.
 *
 * @example
 * ```ts
 * import { useFetch } from "katanakit-js";
 *
 * const result = await useFetch<{ results: unknown[] }>("pokeapi", "pokemons", {
 *   method: "GET",
 *   query: { limit: 2 },
 *   transform: (body) => ({ results: (body as { results: unknown[] }).results }),
 * });
 * if (result.ok) console.log(result.data.results);
 * ```
 *
 * @example Legacy nested form (deprecated)
 * ```ts
 * useFetch("pokeapi", "pokemonById", { urlOptions: { params: { id: 25 } } });
 * ```
 */
export async function useFetch<T = unknown>(
	apiName: string,
	endpointName: string,
	{ params, query, ignoreDefaultQuery, urlOptions, transform, ...init }: FetchOptions<T> = {},
): Promise<FetchResult<T>> {
	let url = "";

	// The flat keys and the deprecated `urlOptions` nest describe the same
	// thing; the flat form wins. `undefined` means "not given", so it must not
	// overwrite a value coming from the legacy nest.
	const buildOptions: UrlOptions = { ...urlOptions };
	if (params !== undefined) buildOptions.params = params;
	if (query !== undefined) buildOptions.query = query;
	if (ignoreDefaultQuery !== undefined) buildOptions.ignoreDefaultQuery = ignoreDefaultQuery;

	try {
		url = useBuildUrl(apiName, endpointName, buildOptions);
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

	try {
		// Fail closed on redirects: the scheme allow-list only validates the
		// initial URL, so following a 3xx could steer the request to a private
		// host (SSRF). Callers that need redirects can pass `redirect: "follow"`.
		const response = await fetch(url, { redirect: "error", ...init });

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
				// A failing transform is still a failed request — return it as a
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
 * Fetches a registered endpoint and returns a Safe Result.
 * Alias for {@link useFetch}.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param options - Optional fetch options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { useFetchApi } from "katanakit-js";
 *
 * const result = await useFetchApi("pokeapi", "pokemonById", {
 *   method: "GET",
 *   params: { id: 25 },
 * });
 * if (result.ok) console.log(result.data);
 * ```
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
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { useGet } from "katanakit-js";
 *
 * const result = await useGet<{ name: string }>("pokeapi", "pokemonById", {
 *   params: { id: 25 },
 * });
 * ```
 */
export async function useGet<T = unknown>(
	apiName: string,
	endpointName: string,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return useFetch<T>(apiName, endpointName, { method: "GET", ...urlOptions });
}

/**
 * GET helper over a registered API endpoint.
 * Alias for {@link useGet}.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { useGetApi } from "katanakit-js";
 *
 * const result = await useGetApi<{ name: string }>("pokeapi", "pokemonById", {
 *   params: { id: 25 },
 * });
 * ```
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
 * @returns A {@link FetchResult} with data or error.
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
	return useFetch<T>(apiName, endpointName, {
		method: "POST",
		...serializeBody(body),
		...urlOptions,
	});
}

/**
 * PUT helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param body - Optional request body (auto-serialized to JSON unless raw).
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { usePut } from "katanakit-js";
 *
 * const result = await usePut("pokeapi", "updatePokemon", { name: "Raichu" }, { params: { id: 25 } });
 * ```
 */
export async function usePut<T = unknown>(
	apiName: string,
	endpointName: string,
	body?: unknown,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return useFetch<T>(apiName, endpointName, {
		method: "PUT",
		...serializeBody(body),
		...urlOptions,
	});
}

/**
 * PATCH helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param body - Optional request body (auto-serialized to JSON unless raw).
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { usePatch } from "katanakit-js";
 *
 * const result = await usePatch("pokeapi", "updatePokemon", { name: "Raichu" }, { params: { id: 25 } });
 * ```
 */
export async function usePatch<T = unknown>(
	apiName: string,
	endpointName: string,
	body?: unknown,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return useFetch<T>(apiName, endpointName, {
		method: "PATCH",
		...serializeBody(body),
		...urlOptions,
	});
}

/**
 * DELETE helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { useDelete } from "katanakit-js";
 *
 * const result = await useDelete("pokeapi", "deletePokemon", { params: { id: 25 } });
 * ```
 */
export async function useDelete<T = unknown>(
	apiName: string,
	endpointName: string,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return useFetch<T>(apiName, endpointName, {
		method: "DELETE",
		...urlOptions,
	});
}
