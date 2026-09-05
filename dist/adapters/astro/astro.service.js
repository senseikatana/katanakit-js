/**
 * Astro adapter (Facade + Adapter + Singleton). Converts arbitrary collections
 * into the `getStaticPaths` format Astro expects, wrapped in a Safe Result.
 */
export class AstroService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!AstroService.instance) {
            AstroService.instance = new AstroService();
        }
        return AstroService.instance;
    }
    usePathsFrom = (items, options = {}) => {
        const { param = "slug", valueFrom = (item) => {
            const record = item;
            return record?.slug ?? record?.id ?? "";
        }, propsFrom = (item) => item, paramsFrom, } = options;
        return items.map((item) => ({
            params: (paramsFrom ? paramsFrom(item) : { [param]: String(valueFrom(item)) }),
            props: propsFrom(item),
        }));
    };
    useGetStaticPaths = async (getCollectionFn, collectionName, options = {}) => {
        try {
            const entries = await getCollectionFn(collectionName);
            const paths = this.usePathsFrom(entries, options);
            return {
                data: paths,
                error: null,
                ok: true,
            };
        }
        catch (error) {
            return {
                data: null,
                error: {
                    message: `Error generating routes for collection "${collectionName}"`,
                    collectionName,
                    details: error instanceof Error ? error.message : String(error),
                },
                ok: false,
            };
        }
    };
    useFindEntry = (items, value, keyFrom) => {
        const getKey = keyFrom ??
            ((item) => {
                const record = item;
                return record?.slug ?? record?.id ?? "";
            });
        return items.find((item) => String(getKey(item)) === value) ?? null;
    };
    useGeneratePagination = (items, pageSize = 10, param = "page") => {
        const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
        return Array.from({ length: totalPages }, (_, i) => {
            const currentPage = i + 1;
            return {
                params: {
                    [param]: currentPage === 1 ? undefined : String(currentPage),
                },
                props: {
                    items: items.slice(i * pageSize, (i + 1) * pageSize),
                    currentPage,
                    totalPages,
                },
            };
        });
    };
    usePathsFromValues = (values, param = "slug") => {
        return values.map((value) => ({
            params: { [param]: String(value) },
            props: value,
        }));
    };
    useExtractUniqueValues = (items, keyFrom) => {
        const values = items.flatMap(keyFrom);
        return [...new Set(values)];
    };
}
// Singleton instance and destructured exports.
export const { usePathsFrom, useGetStaticPaths, useFindEntry, useGeneratePagination, usePathsFromValues, useExtractUniqueValues, } = AstroService.getInstance();
//# sourceMappingURL=astro.service.js.map