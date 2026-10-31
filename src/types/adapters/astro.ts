import type { z } from "zod";

import { AstroServiceErrorSchema } from "@/schemas/core.schema.js";

import type { SafeResult } from "../core/http.js";

/** Minimal shape of an Astro content collection entry. */
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

export type AstroServiceError = z.infer<typeof AstroServiceErrorSchema>;

/** Safe Result (discriminated union without throwing). */
export type AstroServiceResult<T> = SafeResult<T, AstroServiceError>;

/** Contract of the Astro facade. */
export interface IAstroService {
	usePathsFrom<T, TParam extends string = "slug", TProps = T>(
		items: T[],
		options?: PathsOptions<T, TParam, TProps>,
	): AstroPath<TParam, TProps>[];
	useGetStaticPaths<
		TData = unknown,
		TParam extends string = "slug",
		TProps = CollectionEntryLike<TData>,
	>(
		getCollectionFn: (collection: string) => Promise<CollectionEntryLike<TData>[]>,
		collectionName: string,
		options?: PathsOptions<CollectionEntryLike<TData>, TParam, TProps>,
	): Promise<AstroServiceResult<AstroPath<TParam, TProps>[]>>;
	useFindEntry<T>(items: T[], value: string, keyFrom?: (item: T) => string | number): T | null;
	useGeneratePagination<T, TParam extends string = "page">(
		items: T[],
		pageSize?: number,
		param?: TParam,
	): AstroPath<TParam, PaginationProps<T>>[];
	usePathsFromValues<TParam extends string = "slug">(
		values: (string | number)[],
		param?: TParam,
	): AstroPath<TParam, string | number>[];
	useExtractUniqueValues<T, V>(items: T[], keyFrom: (item: T) => V | V[]): V[];
}
