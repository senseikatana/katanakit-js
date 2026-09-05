import type { ApisConfig, FetchOptions, FetchResult, IFetchApiManager, UrlOptions } from "../../types/index.js";
/**
 * Framework-agnostic HTTP client: builds safe URLs from a JSON-defined registry
 * and wraps `fetch` in a Safe Result. Implemented as a Facade + Singleton.
 */
export declare class FetchApiManager implements IFetchApiManager {
    private static instance;
    private apis;
    private constructor();
    static getInstance(): FetchApiManager;
    useInit: (apis: ApisConfig) => void;
    useGetApis: () => ApisConfig;
    private GET_API_ENTRY;
    useBuildUrl: (apiName: string, endpointName: string, options?: UrlOptions) => string;
    useFetch: <T = unknown>(apiName: string, endpointName: string, { urlOptions, ...init }?: FetchOptions) => Promise<FetchResult<T>>;
    useGet: <T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
    usePost: <T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
    usePut: <T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
    useDelete: <T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
}
export declare const useFetch: <T = unknown>(apiName: string, endpointName: string, { urlOptions, ...init }?: FetchOptions) => Promise<FetchResult<T>>, useGetApis: () => ApisConfig, useInit: (apis: ApisConfig) => void, useGet: <T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions) => Promise<FetchResult<T>>, usePost: <T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions) => Promise<FetchResult<T>>, useDelete: <T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions) => Promise<FetchResult<T>>, usePut: <T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions) => Promise<FetchResult<T>>, useBuildUrl: (apiName: string, endpointName: string, options?: UrlOptions) => string;
//# sourceMappingURL=http.service.d.ts.map