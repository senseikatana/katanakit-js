import type { AstroPath, AstroServiceResult, CollectionEntryLike, IAstroService, PaginationProps, PathsOptions } from "../../types/index.js";
/**
 * Astro adapter (Facade + Adapter + Singleton). Converts arbitrary collections
 * into the `getStaticPaths` format Astro expects, wrapped in a Safe Result.
 */
export declare class AstroService implements IAstroService {
    private static instance;
    private constructor();
    static getInstance(): AstroService;
    usePathsFrom: <T, TParam extends string = "slug", TProps = T>(items: T[], options?: PathsOptions<T, TParam, TProps>) => AstroPath<TParam, TProps>[];
    useGetStaticPaths: <TData = unknown, TParam extends string = "slug", TProps = CollectionEntryLike<TData>>(getCollectionFn: (collection: string) => Promise<CollectionEntryLike<TData>[]>, collectionName: string, options?: PathsOptions<CollectionEntryLike<TData>, TParam, TProps>) => Promise<AstroServiceResult<AstroPath<TParam, TProps>[]>>;
    useFindEntry: <T>(items: T[], value: string, keyFrom?: (item: T) => string | number) => T | null;
    useGeneratePagination: <T, TParam extends string = "page">(items: T[], pageSize?: number, param?: TParam) => AstroPath<TParam, PaginationProps<T>>[];
    usePathsFromValues: <TParam extends string = "slug">(values: (string | number)[], param?: TParam) => AstroPath<TParam, string | number>[];
    useExtractUniqueValues: <T, V>(items: T[], keyFrom: (item: T) => V | V[]) => V[];
}
export declare const usePathsFrom: <T, TParam extends string = "slug", TProps = T>(items: T[], options?: PathsOptions<T, TParam, TProps>) => AstroPath<TParam, TProps>[], useGetStaticPaths: <TData = unknown, TParam extends string = "slug", TProps = CollectionEntryLike<TData>>(getCollectionFn: (collection: string) => Promise<CollectionEntryLike<TData>[]>, collectionName: string, options?: PathsOptions<CollectionEntryLike<TData>, TParam, TProps>) => Promise<AstroServiceResult<AstroPath<TParam, TProps>[]>>, useFindEntry: <T>(items: T[], value: string, keyFrom?: ((item: T) => string | number) | undefined) => T | null, useGeneratePagination: <T, TParam extends string = "page">(items: T[], pageSize?: number, param?: TParam) => AstroPath<TParam, PaginationProps<T>>[], usePathsFromValues: <TParam extends string = "slug">(values: (string | number)[], param?: TParam) => AstroPath<TParam, string | number>[], useExtractUniqueValues: <T, V>(items: T[], keyFrom: (item: T) => V | V[]) => V[];
//# sourceMappingURL=astro.service.d.ts.map