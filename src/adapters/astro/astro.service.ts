import type {
	AstroPath,
	AstroServiceResult,
	CollectionEntryLike,
	IAstroService,
	PaginationProps,
	PathsOptions,
} from "./astro.types";

/**
 * Astro adapter (Facade + Adapter + Singleton). Converts arbitrary collections
 * into the `getStaticPaths` format Astro expects, wrapped in a Safe Result.
 */
export class AstroService implements IAstroService {
	private static instance: AstroService;

	private constructor() {}

	public static getInstance(): AstroService {
		if (!AstroService.instance) {
			AstroService.instance = new AstroService();
		}
		return AstroService.instance;
	}

	public PATHS_FROM = <T, TParam extends string = "slug", TProps = T>(
		items: T[],
		options: PathsOptions<T, TParam, TProps> = {},
	): AstroPath<TParam, TProps>[] => {
		const {
			param = "slug" as TParam,
			valueFrom = (item: T) => {
				const record = item as { slug?: string; id?: string } | null | undefined;
				return record?.slug ?? record?.id ?? "";
			},
			propsFrom = (item: T) => item as unknown as TProps,
			paramsFrom,
		} = options;

		return items.map((item) => ({
			params: (paramsFrom ? paramsFrom(item) : { [param]: String(valueFrom(item)) }) as Record<
				TParam,
				string | undefined
			>,
			props: propsFrom(item),
		}));
	};

	public GET_STATIC_PATHS = async <
		TData = unknown,
		TParam extends string = "slug",
		TProps = CollectionEntryLike<TData>,
	>(
		getCollectionFn: (collection: string) => Promise<CollectionEntryLike<TData>[]>,
		collectionName: string,
		options: PathsOptions<CollectionEntryLike<TData>, TParam, TProps> = {},
	): Promise<AstroServiceResult<AstroPath<TParam, TProps>[]>> => {
		try {
			const entries = await getCollectionFn(collectionName);
			const paths = this.PATHS_FROM(entries, options);
			return {
				data: paths,
				error: null,
				ok: true,
			};
		} catch (error: unknown) {
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

	public FIND_ENTRY = <T>(
		items: T[],
		value: string,
		keyFrom?: (item: T) => string | number,
	): T | null => {
		const getKey =
			keyFrom ??
			((item: T) => {
				const record = item as { slug?: string; id?: string } | null | undefined;
				return record?.slug ?? record?.id ?? "";
			});
		return items.find((item) => String(getKey(item)) === value) ?? null;
	};

	public GENERATE_PAGINATION = <T, TParam extends string = "page">(
		items: T[],
		pageSize = 10,
		param: TParam = "page" as TParam,
	): AstroPath<TParam, PaginationProps<T>>[] => {
		const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

		return Array.from({ length: totalPages }, (_, i) => {
			const currentPage = i + 1;
			return {
				params: {
					[param]: currentPage === 1 ? undefined : String(currentPage),
				} as Record<TParam, string | undefined>,
				props: {
					items: items.slice(i * pageSize, (i + 1) * pageSize),
					currentPage,
					totalPages,
				},
			};
		});
	};

	public PATHS_FROM_VALUES = <TParam extends string = "slug">(
		values: (string | number)[],
		param: TParam = "slug" as TParam,
	): AstroPath<TParam, string | number>[] => {
		return values.map((value) => ({
			params: { [param]: String(value) } as Record<TParam, string | undefined>,
			props: value,
		}));
	};

	public EXTRACT_UNIQUE_VALUES = <T, V>(items: T[], keyFrom: (item: T) => V | V[]): V[] => {
		const values = items.flatMap(keyFrom);
		return [...new Set(values)];
	};
}

// Singleton instance and destructured exports.
export const {
	PATHS_FROM,
	GET_STATIC_PATHS,
	FIND_ENTRY,
	GENERATE_PAGINATION,
	PATHS_FROM_VALUES,
	EXTRACT_UNIQUE_VALUES,
}: AstroService = AstroService.getInstance();
