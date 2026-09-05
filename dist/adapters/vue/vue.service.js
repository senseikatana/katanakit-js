import { isRef, ref, shallowRef, unref, watch } from "vue";
import { useGet } from "../../core/services/http.service.js";
/**
 * Vue 3 composable that wraps KatanaKit's `useGet` with the reactivity system.
 * It bridges the Safe Result pattern to idiomatic Vue state (`data`, `error`,
 * `loading`) and never throws on HTTP errors.
 *
 * When `options` is a Vue `Ref`, the request re-runs automatically whenever the
 * ref changes (deep watch), so URL params or query params can drive refetching.
 *
 * @param apiName - Name of the registered API (see `useInit`).
 * @param endpointName - Name of the endpoint inside that API.
 * @param options - Optional `UrlOptions` (path/query params), plain or reactive.
 * @returns Reactive `{ data, error, loading, refetch }`.
 *
 * @example
 * ```ts
 * import { useKatanaFetch } from "katanakit-js/adapters/vue";
 *
 * const { data, error, loading } = useKatanaFetch<{ name: string }>(
 *   "pokeapi",
 *   "pokemonById",
 *   { params: { id: 25 } },
 * );
 * ```
 */
export function useKatanaFetch(apiName, endpointName, options) {
    const data = shallowRef(null);
    const error = ref(null);
    const loading = ref(true);
    const refetch = async () => {
        loading.value = true;
        error.value = null;
        const result = await useGet(apiName, endpointName, unref(options));
        if (result.ok) {
            data.value = result.data;
        }
        else {
            error.value = result.error;
        }
        loading.value = false;
    };
    // Refetch automatically when a reactive options ref changes.
    if (isRef(options)) {
        watch(options, refetch, { deep: true });
    }
    // Initial fetch on setup.
    void refetch();
    return { data, error, loading, refetch };
}
//# sourceMappingURL=vue.service.js.map