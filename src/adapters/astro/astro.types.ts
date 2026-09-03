// ============================================================
// 1. TIPOS DECLARADOS LOCALMENTE (AUTOCONTENIDO)
// ============================================================

export interface CollectionEntryLike<TData = unknown> {
	id: string;
	slug?: string;
	data?: TData;
	[key: string]: unknown;
}

export interface PathsOptions<T, TParam extends string = string, TProps = T> {
	param?: TParam;
	valueFrom?: (item: T) => string | number;
	propsFrom?: (item: T) => TProps;
	paramsFrom?: (item: T) => Record<string, string>;
}

export interface AstroPath<TParam extends string = string, TProps = unknown> {
	params: Record<TParam, string | undefined>;
	props: TProps;
}

export interface PaginationProps<T> {
	items: T[];
	currentPage: number;
	totalPages: number;
}

export interface AstroServiceError {
	message: string;
	collectionName?: string;
	details?: unknown;
}

// Patrón Safe Result (Unión discriminada sin throw)
export type AstroServiceResult<T> =
	| {
			data: T;
			error: null;
			ok: true;
	  }
	| {
			data: null;
			error: AstroServiceError;
			ok: false;
	  };

// ============================================================
// 2. CONTRATO DE LA FACHADA (INTERFAZ)
// ============================================================

export interface IAstroService {
	PATHS_FROM<T, TParam extends string = "slug", TProps = T>(
		items: T[],
		options?: PathsOptions<T, TParam, TProps>,
	): AstroPath<TParam, TProps>[];

	GET_STATIC_PATHS<
		TData = unknown,
		TParam extends string = "slug",
		TProps = CollectionEntryLike<TData>,
	>(
		getCollectionFn: (
			collection: string,
		) => Promise<CollectionEntryLike<TData>[]>,
		collectionName: string,
		options?: PathsOptions<CollectionEntryLike<TData>, TParam, TProps>,
	): Promise<AstroServiceResult<AstroPath<TParam, TProps>[]>>;

	FIND_ENTRY<T>(
		items: T[],
		value: string,
		keyFrom?: (item: T) => string | number,
	): T | null;

	GENERATE_PAGINATION<T, TParam extends string = "page">(
		items: T[],
		pageSize?: number,
		param?: TParam,
	): AstroPath<TParam, PaginationProps<T>>[];

	PATHS_FROM_VALUES<TParam extends string = "slug">(
		values: (string | number)[],
		param?: TParam,
	): AstroPath<TParam, string | number>[];

	EXTRACT_UNIQUE_VALUES<T, V>(items: T[], keyFrom: (item: T) => V | V[]): V[];
}

export interface BlogPostData {
	title: string;
	tags: string[];
}
