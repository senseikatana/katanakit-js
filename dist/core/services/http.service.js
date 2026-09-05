/**
 * Framework-agnostic HTTP client: builds safe URLs from a JSON-defined registry
 * and wraps `fetch` in a Safe Result. Implemented as a Facade + Singleton.
 */
export class FetchApiManager {
    static instance;
    apis = {};
    constructor() { }
    static getInstance() {
        if (!FetchApiManager.instance) {
            FetchApiManager.instance = new FetchApiManager();
        }
        return FetchApiManager.instance;
    }
    useInit = (apis) => {
        this.apis = { ...this.apis, ...apis };
    };
    useGetApis = () => this.apis;
    GET_API_ENTRY = (apiName) => {
        const api = this.apis[apiName];
        if (!api) {
            throw new Error(`[FetchApiManager] API "${apiName}" is not registered.`);
        }
        return api;
    };
    useBuildUrl = (apiName, endpointName, options = {}) => {
        const { params, query, ignoreDefaultQuery = false } = options;
        const api = this.GET_API_ENTRY(apiName);
        let path = api.endpoints?.[endpointName] ?? "";
        if (!path) {
            throw new Error(`[FetchApiManager] Endpoint "${endpointName}" not found in API "${apiName}".`);
        }
        if (params) {
            const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            path = Object.entries(params).reduce((acc, [key, value]) => acc.replace(new RegExp(`:${escapeRegex(key)}\\b`, "g"), encodeURIComponent(String(value))), path);
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
    useFetch = async (apiName, endpointName, { urlOptions, ...init } = {}) => {
        let url = "";
        try {
            url = this.useBuildUrl(apiName, endpointName, urlOptions);
            const response = await fetch(url, init);
            if (!response.ok) {
                let errorDetails;
                try {
                    errorDetails = await response.json();
                }
                catch {
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
            const data = isJson ? (await response.json()) : (await response.text());
            return {
                data,
                error: null,
                url: response.url || url,
                status: response.status,
                ok: true,
            };
        }
        catch (err) {
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
    useGet = async (apiName, endpointName, urlOptions) => this.useFetch(apiName, endpointName, { method: "GET", urlOptions });
    usePost = async (apiName, endpointName, body, urlOptions) => this.useFetch(apiName, endpointName, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        urlOptions,
    });
    usePut = async (apiName, endpointName, body, urlOptions) => this.useFetch(apiName, endpointName, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        urlOptions,
    });
    useDelete = async (apiName, endpointName, urlOptions) => this.useFetch(apiName, endpointName, {
        method: "DELETE",
        urlOptions,
    });
}
// Singleton instance and destructured exports.
export const { useFetch, useGetApis, useInit, useGet, usePost, useDelete, usePut, useBuildUrl, } = FetchApiManager.getInstance();
//# sourceMappingURL=http.service.js.map