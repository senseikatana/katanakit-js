/**
 * Unwraps a KatanaKit Safe Result, throwing an H3-compatible error on failure.
 * Returns the data directly on success.
 *
 * @param result - The Safe Result from `useFetch`, `useGet`, `usePost`, etc.
 * @param context - Optional context prefix for the error message.
 * @returns The data from the result.
 * @throws H3-compatible error with the appropriate status code.
 *
 * @example
 * ```ts
 * // server/api/pokemon/[id].ts
 * import { useGet } from "katanakit-js";
 * import { useUnwrap } from "katanakit-js/adapters/nuxt";
 *
 * export default defineEventHandler(async (event) => {
 *   const id = getRouterParam(event, "id");
 *   const result = await useGet("pokeapi", "pokemonById", { params: { id } });
 *   return useUnwrap(result, `Pokemon ${id}`);
 * });
 * ```
 */
export function useUnwrap(result, context) {
    if (result.ok) {
        return result.data;
    }
    const message = context ? `${context}: ${result.error.message}` : result.error.message;
    const statusCode = result.error.status || 500;
    // Dynamic import to avoid hard dependency on h3.
    // Consumers must have h3 installed (it comes with Nuxt).
    throw createH3Error(statusCode, message);
}
/**
 * Creates a Safe Result response for Nuxt API routes.
 * Returns the data with proper status code on success,
 * or an error response on failure.
 *
 * @param result - The Safe Result from any KatanaKit fetch method.
 * @returns An H3-compatible response object.
 *
 * @example
 * ```ts
 * // server/api/users.ts
 * import { useGet } from "katanakit-js";
 * import { useSafeResponse } from "katanakit-js/adapters/nuxt";
 *
 * export default defineEventHandler(async () => {
 *   const result = await useGet("api", "users");
 *   return useSafeResponse(result);
 * });
 * ```
 */
export function useSafeResponse(result) {
    if (result.ok) {
        return { data: result.data, error: null, ok: true };
    }
    return {
        data: null,
        error: {
            message: result.error.message,
            status: result.error.status,
        },
        ok: false,
    };
}
/**
 * Maps a KatanaKit Safe Result to an H3 event response.
 * Sets the appropriate status code and returns the data or error.
 *
 * @param event - The H3 event object.
 * @param result - The Safe Result from any KatanaKit fetch method.
 * @returns The data on success.
 *
 * @example
 * ```ts
 * // server/api/products.ts
 * import { useFetch } from "katanakit-js";
 * import { useEventResponse } from "katanakit-js/adapters/nuxt";
 *
 * export default defineEventHandler(async (event) => {
 *   const result = await useFetch("shop", "products");
 *   return useEventResponse(event, result);
 * });
 * ```
 */
export function useEventResponse(event, result) {
    if (result.ok) {
        event.node.res.statusCode = 200;
        return result.data;
    }
    event.node.res.statusCode = result.error.status || 500;
    return {
        error: result.error.message,
        status: result.error.status,
    };
}
// Internal helper: creates an error that looks like an H3 error.
// We don't import h3 directly to avoid a hard peer dependency.
function createH3Error(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
//# sourceMappingURL=nuxt.service.js.map