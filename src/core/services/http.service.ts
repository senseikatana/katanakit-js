// services/api-manager.service.ts

// ============================================================
// 1. TIPOS DECLARADOS LOCALMENTE
// ============================================================

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type QueryParams = Record<
	string,
	string | number | boolean | undefined | null
>;

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

// INPUT: Opciones que se le pasan al ejecutar fetch
export interface FetchOptions extends RequestInit {
	urlOptions?: UrlOptions;
}

// Estructura del Error seguro
export interface ApiError {
	message: string;
	status: number;
	details?: unknown;
}

// OUTPUT: Resultado seguro estilo Astro Actions (Data / Error)
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

// ============================================================
// 2. CONTRATO DE LA FACHADA
// ============================================================

export interface IFetchApiManager {
	INIT(apis: ApisConfig): void;
	GET_APIS(): ApisConfig;
	BUILD_URL(
		apiName: string,
		endpointName: string,
		options?: UrlOptions,
	): string;
	FETCH<T = unknown>(
		apiName: string,
		endpointName: string,
		options?: FetchOptions,
	): Promise<FetchResult<T>>;
	GET<T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
	POST<T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
	PUT<T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
	DELETE<T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>>;
}

// ============================================================
// 3. IMPLEMENTACIÓN FACHADA + SINGLETON
// ============================================================

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

	public INIT = (apis: ApisConfig): void => {
		this.apis = { ...this.apis, ...apis };
	};

	public GET_APIS = (): ApisConfig => {
		return this.apis;
	};

	private GET_API_ENTRY = (apiName: string): ApiEntry => {
		const api = this.apis[apiName];
		if (!api) {
			throw new Error(`[FetchApiManager] API "${apiName}" no registrada.`);
		}
		return api;
	};

	public BUILD_URL = (
		apiName: string,
		endpointName: string,
		options: UrlOptions = {},
	): string => {
		const { params, query, ignoreDefaultQuery = false } = options;
		const api = this.GET_API_ENTRY(apiName);
		let path = api.endpoints?.[endpointName] ?? "";

		if (!path) {
			throw new Error(
				`[FetchApiManager] Endpoint "${endpointName}" no encontrado en API "${apiName}".`,
			);
		}

		if (params) {
			path = Object.entries(params).reduce(
				(acc, [key, value]) =>
					acc.replace(
						new RegExp(`:${key}\\b`, "g"),
						encodeURIComponent(String(value)),
					),
				path,
			);
		}

		const baseStr =
			api.baseUri instanceof URL ? api.baseUri.toString() : api.baseUri;
		const baseClean = baseStr.endsWith("/") ? baseStr.slice(0, -1) : baseStr;
		const pathClean = path.startsWith("/") ? path : `/${path}`;
		const url = new URL(`${baseClean}${pathClean}`);

		const defaultParams = ignoreDefaultQuery
			? {}
			: (api.defaultQueryParams?.[endpointName] ?? {});

		const mergedQuery: QueryParams = { ...defaultParams, ...query };

		for (const [key, value] of Object.entries(mergedQuery)) {
			if (value !== undefined && value !== null) {
				url.searchParams.set(key, String(value));
			}
		}

		return url.toString();
	};

	public FETCH = async <T = unknown>(
		apiName: string,
		endpointName: string,
		{ urlOptions, ...init }: FetchOptions = {},
	): Promise<FetchResult<T>> => {
		let url = "";

		try {
			url = this.BUILD_URL(apiName, endpointName, urlOptions);
			const response = await fetch(url, init);

			// Si el servidor responde con 4xx o 5xx
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
						message: `Error HTTP: ${response.statusText || "Respuesta no exitosa"}`,
						status: response.status,
						details: errorDetails,
					},
					url: response.url || url,
					status: response.status,
					ok: false,
				};
			}

			// Si responde 2xx
			const contentType = response.headers.get("content-type");
			const isJson = contentType && contentType.includes("application/json");
			const data = isJson
				? ((await response.json()) as T)
				: ((await response.text()) as unknown as T);

			return {
				data,
				error: null,
				url: response.url || url,
				status: response.status,
				ok: true,
			};
		} catch (err: unknown) {
			// Fallos de red o configuración (CORS, servidor caído, etc.)
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

	public GET = async <T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> => {
		return this.FETCH<T>(apiName, endpointName, { method: "GET", urlOptions });
	};

	public POST = async <T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> => {
		return this.FETCH<T>(apiName, endpointName, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: body !== undefined ? JSON.stringify(body) : undefined,
			urlOptions,
		});
	};

	public PUT = async <T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> => {
		return this.FETCH<T>(apiName, endpointName, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: body !== undefined ? JSON.stringify(body) : undefined,
			urlOptions,
		});
	};

	public DELETE = async <T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> => {
		return this.FETCH<T>(apiName, endpointName, {
			method: "DELETE",
			urlOptions,
		});
	};
}

// ============================================================
// 4. INSTANCIA SINGLETON Y EXPORTACIÓN DESESTRUCTURADA
// ============================================================

export const {
	FETCH,
	GET_APIS,
	INIT,
	GET,
	POST,
	DELETE,
	PUT,
	BUILD_URL,
}: FetchApiManager = FetchApiManager.getInstance();

// ============================================================
// 5. EJEMPLO DE CONSUMO TIPO ASTRO ACTIONS ({ data, error })
// ============================================================

export interface User {
	id: number | string;
	name: string;
	slug: (text: string) => string | string;
}

INIT({
	dummyUsers: {
		baseUri: "https://dummyjson.com",
		endpoints: {
			findOne: "/users/:slug",
			findAll: "/users/",
		},
	},
});

export const {
	data: responseUser,
	error,
	ok,
} = await GET<User>("dummyUsers", "findAll", {
	params: { id: 1 },
});

responseUser?.slug(responseUser.name).toString();
