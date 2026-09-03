import type {
	ApiEntry,
	ApisConfig,
	FetchOptions,
	FetchResult,
	IFetchApiManager,
	UrlOptions,
} from "../../types";

/**
 * Framework-agnostic HTTP client: builds safe URLs from a JSON-defined registry
 * and wraps `fetch` in a Safe Result. Implemented as a Facade + Singleton.
 */
export class FetchApiManager implements IFetchApiManager {
	private static instance: FetchApiManager;
	private apis: ApisConfig = {};

	private constructor() {}

	public static getInstance(): FetchApiManager {
		if (!FetchApiManager.instance) {
			FetchApiManager.instance = new FetchApiManager();
		}
		return FetchApiManager.instance;
	}

	public useInit = (apis: ApisConfig): void => {
		this.apis = { ...this.apis, ...apis };
	};

	public useGetApis = (): ApisConfig => this.apis;

	private GET_API_ENTRY = (apiName: string): ApiEntry => {
		const api = this.apis[apiName];
		if (!api) {
			throw new Error(`[FetchApiManager] API "${apiName}" is not registered.`);
		}
		return api;
	};

	public useBuildUrl = (apiName: string, endpointName: string, options: UrlOptions = {}): string => {
		const { params, query, ignoreDefaultQuery = false } = options;
		const api = this.GET_API_ENTRY(apiName);
		let path = api.endpoints?.[endpointName] ?? "";

		if (!path) {
			throw new Error(`[FetchApiManager] Endpoint "${endpointName}" not found in API "${apiName}".`);
		}

		if (params) {
			const escapeRegex = (s: string): string =>
				s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			path = Object.entries(params).reduce(
				(acc, [key, value]) =>
					acc.replace(
						new RegExp(`:${escapeRegex(key)}\\b`, "g"),
						encodeURIComponent(String(value)),
					),
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
	};

	public useFetch = async <T = unknown>(
		apiName: string,
		endpointName: string,
		{ urlOptions, ...init }: FetchOptions = {},
	): Promise<FetchResult<T>> => {
		let url = "";

		try {
			url = this.useBuildUrl(apiName, endpointName, urlOptions);
			const response = await fetch(url, init);

			if (!response.ok) {
				let errorDetails: unknown;
				try {
					errorDetails = await response.json();
				} catch {
					errorDetails = await response.text();
				}

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

			const contentType = response.headers.get("content-type");
			const isJson = contentType?.includes("application/json");
			const data = isJson ? ((await response.json()) as T) : ((await response.text()) as unknown as T);

			return {
				data,
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
	};

	public useGet = async <T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> =>
		this.useFetch<T>(apiName, endpointName, { method: "GET", urlOptions });

	public usePost = async <T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> =>
		this.useFetch<T>(apiName, endpointName, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: body !== undefined ? JSON.stringify(body) : undefined,
			urlOptions,
		});

	public usePut = async <T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> =>
		this.useFetch<T>(apiName, endpointName, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: body !== undefined ? JSON.stringify(body) : undefined,
			urlOptions,
		});

	public useDelete = async <T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> =>
		this.useFetch<T>(apiName, endpointName, {
			method: "DELETE",
			urlOptions,
		});
}

// Singleton instance and destructured exports.
export const {
	useFetch,
	useGetApis,
	useInit,
	useGet,
	usePost,
	useDelete,
	usePut,
	useBuildUrl,
}: FetchApiManager = FetchApiManager.getInstance();
