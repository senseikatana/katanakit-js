import type { z } from "zod";

import { ApiErrorSchema, HttpMethodSchema } from "@/schemas/common.schema.js";

export type HttpMethod = z.infer<typeof HttpMethodSchema>;

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

/**
 * Options passed when executing a fetch request.
 *
 * URL building lives **at the top level** — the same shape as `useGet`,
 * `useRequest` and Nuxt's `useFetch` — so nothing has to be nested:
 *
 * ```ts
 * useFetch("api", "byId", { method: "GET", params: { id: 25 }, query: { limit: 2 } });
 * ```
 *
 * @typeParam T - The type {@link FetchOptions.transform} resolves to. Defaults
 *   to `any` on purpose: with `unknown` a bare `FetchOptions` (or one stored in
 *   a variable / passed through a wrapper) would no longer be assignable to
 *   `FetchOptions<T>`, which is a type-level break for existing callers.
 */
export interface FetchOptions<T = any> extends RequestInit {
	/** Path params substituted into `:name` placeholders of the endpoint. */
	params?: PathParams;
	/** Query-string params appended to the URL. */
	query?: QueryParams;
	/** Skip the endpoint's `defaultQueryParams` instead of merging them. */
	ignoreDefaultQuery?: boolean;
	/** Maps the parsed response body to `T` before it is returned. */
	transform?: (input: unknown) => T | Promise<T>;
}

/** Structure of the safe error returned on non-2xx or network failures. */
export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * Generic Safe Result discriminated union (Astro Actions style): the `ok` flag
 * narrows between the success and error branches and nothing is thrown.
 *
 * Domain results below are aliases of this shape with a specific error type.
 */
export type SafeResult<T, E = ApiError> =
	{ data: T; error: null; ok: true } | { data: null; error: E; ok: false };

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

/** Mutable request inputs passed through registered HTTP request interceptors. */
export interface FetchRequest {
	url: string;
	init: RequestInit;
}

/** Inspects or modifies a request before fetch; interceptors run in registration order. */
export type RequestInterceptor = (request: FetchRequest) => void | Promise<void>;

/** Contract of the fetch facade. */
export interface IFetchApiManager {
	useGetApis(): ApisConfig;
	useGetApisConfig(): ApisConfig;
	useBuildUrl(apiName: string, endpointName: string, options?: UrlOptions): string;
	useAddRequestInterceptor(interceptor: RequestInterceptor): () => void;
	useFetch<T = unknown>(
		apiName: string,
		endpointName: string,
		options?: FetchOptions<T>,
	): Promise<FetchResult<T>>;
	useFetchApi<T = unknown>(
		apiName: string,
		endpointName: string,
		options?: FetchOptions<T>,
	): Promise<FetchResult<T>>;
	useGet<T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
	useGetApi<T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
	usePost<T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
	usePut<T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
	usePatch<T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
	useDelete<T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
}
