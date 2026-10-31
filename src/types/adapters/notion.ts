import type { z } from "zod";

import {
	NotionBlockListSchema,
	NotionBlockSchema,
	NotionConfigSchema,
	NotionCoverSchema,
	NotionDatabaseQuerySchema,
	NotionDatabaseSchema,
	NotionIconSchema,
	NotionPageListSchema,
	NotionPageSchema,
	NotionParentSchema,
	NotionPropertySchemaSchema,
	NotionPropertyValueSchema,
	NotionRichTextSchema,
	NotionSearchQuerySchema,
	NotionSearchResultSchema,
	NotionSortSchema,
	NotionUserListSchema,
	NotionUserSchema,
} from "@/schemas/notion.schema.js";

import type { FetchResult } from "../core/http.js";

/** Configuration for the Notion API integration. */
export type NotionConfig = z.infer<typeof NotionConfigSchema>;

/** Rich text object used in Notion blocks and properties. */
export type NotionRichText = z.infer<typeof NotionRichTextSchema>;

/** A Notion page object. */
export type NotionPage = z.infer<typeof NotionPageSchema>;

/** Parent reference for pages and databases. */
export type NotionParent = z.infer<typeof NotionParentSchema>;

/** Property value on a Notion page. */
export type NotionProperty = z.infer<typeof NotionPropertyValueSchema>;

/** Icon on a page or database (emoji or file). */
export type NotionIcon = z.infer<typeof NotionIconSchema>;

/** Cover image on a page. */
export type NotionCover = z.infer<typeof NotionCoverSchema>;

/** A Notion block object. */
export type NotionBlock = z.infer<typeof NotionBlockSchema>;

/** Result of listing block children (paginated). */
export type NotionBlockList = z.infer<typeof NotionBlockListSchema>;

/** A Notion database object. */
export type NotionDatabase = z.infer<typeof NotionDatabaseSchema>;

/** Schema definition for a database property. */
export type NotionPropertySchema = z.infer<typeof NotionPropertySchemaSchema>;

/** Filter for querying a Notion database. */
export interface NotionFilter {
	and?: NotionFilter[];
	or?: NotionFilter[];
	property?: string;
	[key: string]: unknown;
}

/** Sort option for querying a Notion database. */
export type NotionSort = z.infer<typeof NotionSortSchema>;

/** Query options for a Notion database. */
export type NotionDatabaseQuery = z.infer<typeof NotionDatabaseQuerySchema>;

/** Result of querying a Notion database (paginated). */
export type NotionPageList = z.infer<typeof NotionPageListSchema>;

/** A Notion user object. */
export type NotionUser = z.infer<typeof NotionUserSchema>;

/** Paginated list of Notion users. */
export type NotionUserList = z.infer<typeof NotionUserListSchema>;

/** Search query options for the Notion API. */
export type NotionSearchQuery = z.infer<typeof NotionSearchQuerySchema>;

/** Result of a Notion search (paginated). */
export type NotionSearchResult = z.infer<typeof NotionSearchResultSchema>;

/** Contract of the Notion adapter facade. */
export interface INotionService {
	useNotionGetPage(pageId: string): Promise<FetchResult<NotionPage>>;
	useNotionCreatePage(
		parent: NotionParent,
		properties: Record<string, unknown>,
		children?: unknown[],
	): Promise<FetchResult<NotionPage>>;
	useNotionUpdatePage(
		pageId: string,
		properties: Record<string, unknown>,
	): Promise<FetchResult<NotionPage>>;
	useNotionArchivePage(pageId: string): Promise<FetchResult<NotionPage>>;
	useNotionGetBlock(blockId: string): Promise<FetchResult<NotionBlock>>;
	useNotionGetBlockChildren(
		blockId: string,
		options?: { start_cursor?: string; page_size?: number },
	): Promise<FetchResult<NotionBlockList>>;
	useNotionAppendBlocks(blockId: string, children: unknown[]): Promise<FetchResult<NotionBlock>>;
	useNotionUpdateBlock(
		blockId: string,
		content: Record<string, unknown>,
	): Promise<FetchResult<NotionBlock>>;
	useNotionDeleteBlock(blockId: string): Promise<FetchResult<NotionBlock>>;
	useNotionGetDatabase(databaseId: string): Promise<FetchResult<NotionDatabase>>;
	useNotionQueryDatabase(
		databaseId: string,
		query?: NotionDatabaseQuery,
	): Promise<FetchResult<NotionPageList>>;
	useNotionCreateDatabase(
		parent: NotionParent,
		title: NotionRichText[],
		properties: Record<string, NotionPropertySchema>,
	): Promise<FetchResult<NotionDatabase>>;
	useNotionUpdateDatabase(
		databaseId: string,
		title: NotionRichText[],
		properties?: Record<string, NotionPropertySchema>,
	): Promise<FetchResult<NotionDatabase>>;
	useNotionGetUser(userId: string): Promise<FetchResult<NotionUser>>;
	useNotionListUsers(options?: {
		start_cursor?: string;
		page_size?: number;
	}): Promise<FetchResult<NotionUserList>>;
	useNotionSearchContent(query: NotionSearchQuery): Promise<FetchResult<NotionSearchResult>>;
	useNotionListAllBlockChildren(blockId: string): Promise<FetchResult<NotionBlock[]>>;
	useNotionListAllDatabasePages(
		databaseId: string,
		filter?: NotionFilter,
		sorts?: NotionSort[],
	): Promise<FetchResult<NotionPage[]>>;
}
