import type { z } from "zod";

import {
	WordPressAuthSchema,
	WordPressConfigSchema,
	WpAcfFieldsSchema,
	WpBaseEntitySchema,
	WpBatchOperationSchema,
	WpBatchResultSchema,
	WpCapabilityMapSchema,
	WpCapabilitySchema,
	WpCategoryCreateSchema,
	WpCategorySchema,
	WpCategoryUpdateSchema,
	WpCommentCreateSchema,
	WpCommentSchema,
	WpCommentUpdateSchema,
	WpEmbeddedSchema,
	WpMediaMetaSchema,
	WpMediaSchema,
	WpMediaUpdateSchema,
	WpPageCreateSchema,
	WpPageSchema,
	WpPageUpdateSchema,
	WpPostCreateSchema,
	WpPostSchema,
	WpPostUpdateSchema,
	WpQueryParamsSchema,
	WpRoleAuditSchema,
	WpRoleAuditStatusSchema,
	WpRoleDefinitionSchema,
	WpRoleRegistrySchema,
	WpTagCreateSchema,
	WpTagSchema,
	WpTagUpdateSchema,
	WpUserCreateSchema,
	WpUserSchema,
	WpUserUpdateSchema,
} from "@/schemas/wordpress.schema.js";

import type { AccessRole, AccessSubject } from "../core/access.js";
import type { FetchResult } from "../core/http.js";

/** Configuration for the WordPress REST API integration. */
export type WordPressConfig = z.infer<typeof WordPressConfigSchema>;

/** Authentication methods for WordPress. */
export type WordPressAuth = z.infer<typeof WordPressAuthSchema>;

/** Base fields shared by all WordPress entities. */
export type WpBaseEntity = z.infer<typeof WpBaseEntitySchema>;

/** A WordPress post. */
export type WpPost = z.infer<typeof WpPostSchema>;

/** Payload for creating a WordPress post. */
export type WpPostCreate = z.infer<typeof WpPostCreateSchema>;

/** Payload for updating a WordPress post. */
export type WpPostUpdate = z.infer<typeof WpPostUpdateSchema>;

/** A WordPress page. */
export type WpPage = z.infer<typeof WpPageSchema>;

/** Payload for creating a WordPress page. */
export type WpPageCreate = z.infer<typeof WpPageCreateSchema>;

/** Payload for updating a WordPress page. */
export type WpPageUpdate = z.infer<typeof WpPageUpdateSchema>;

/** A WordPress media item (attachment). */
export type WpMedia = z.infer<typeof WpMediaSchema>;

/** Metadata for a media upload. */
export type WpMediaMeta = z.infer<typeof WpMediaMetaSchema>;

/** Payload for updating a WordPress media item. */
export type WpMediaUpdate = z.infer<typeof WpMediaUpdateSchema>;

/** A WordPress category. */
export type WpCategory = z.infer<typeof WpCategorySchema>;

/** Payload for creating a WordPress category. */
export type WpCategoryCreate = z.infer<typeof WpCategoryCreateSchema>;

/** Payload for updating a WordPress category. */
export type WpCategoryUpdate = z.infer<typeof WpCategoryUpdateSchema>;

/** A WordPress tag. */
export type WpTag = z.infer<typeof WpTagSchema>;

/** Payload for creating a WordPress tag. */
export type WpTagCreate = z.infer<typeof WpTagCreateSchema>;

/** Payload for updating a WordPress tag. */
export type WpTagUpdate = z.infer<typeof WpTagUpdateSchema>;

/** A WordPress comment. */
export type WpComment = z.infer<typeof WpCommentSchema>;

/** Payload for creating a WordPress comment. */
export type WpCommentCreate = z.infer<typeof WpCommentCreateSchema>;

/** Payload for updating a WordPress comment. */
export type WpCommentUpdate = z.infer<typeof WpCommentUpdateSchema>;

/** A WordPress user. */
export type WpUser = z.infer<typeof WpUserSchema>;

/** Capability map as WordPress reports it (`{ manage_options: true }`). */
export type WpCapabilityMap = z.infer<typeof WpCapabilityMapSchema>;

/** A WordPress capability name (`edit_orders`). */
export type WpCapability = z.infer<typeof WpCapabilitySchema>;

/**
 * A role declaration: the PHP-free replacement for `add_role()`.
 *
 * Holds both capability vocabularies — the toolkit's namespaced capabilities
 * (used by `useCan()` and the framework guards) and WordPress' own snake_case
 * names (declared for the site, verified with `useWpAuditRole`).
 */
export type WpRoleDefinition = z.infer<typeof WpRoleDefinitionSchema>;

/** A declared role registry. */
export type WpRoleRegistry = z.infer<typeof WpRoleRegistrySchema>;

/** Verification outcome of a declared role: `verified`, `partial`, `unverifiable`. */
export type WpRoleAuditStatus = z.infer<typeof WpRoleAuditStatusSchema>;

/** A declared role compared against what the live site reports. */
export type WpRoleAudit = z.infer<typeof WpRoleAuditSchema>;

/** Payload for creating a WordPress user. */
export type WpUserCreate = z.infer<typeof WpUserCreateSchema>;

/** Payload for updating a WordPress user. */
export type WpUserUpdate = z.infer<typeof WpUserUpdateSchema>;

/**
 * Common query parameters for WordPress REST API list endpoints.
 *
 * Includes field limiting (`_fields: "id,title,link"`) and resource
 * embedding (`_embed: true | "author,wp:featuredmedia"`).
 */
export type WpQueryParams = z.infer<typeof WpQueryParamsSchema>;

/**
 * Container for ACF (Advanced Custom Fields) fields on a WordPress entity.
 *
 * ACF fields appear on posts, pages, media, taxonomies, users, and options.
 * Field names and types are defined by the site's ACF configuration.
 *
 * @example
 * ```ts
 * const post = await useWpGetPost(42, { _fields: "id,title,acf" });
 * if (post.ok && post.data.acf) {
 *   console.log(post.data.acf.hero_image);     // image field
 *   console.log(post.data.acf.subtitle);        // text field
 *   console.log(post.data.acf.gallery);         // gallery field (array)
 * }
 * ```
 */
export type WpAcfFields = z.infer<typeof WpAcfFieldsSchema>;

/**
 * Embedded resources returned by WordPress when `_embed` is used.
 *
 * Contains related entities: author, featured media, terms, replies.
 * Access with `post._embedded?.["wp:featuredmedia"]?.[0]`.
 *
 * @example
 * ```ts
 * const result = await useWpGetPosts({ _embed: "author,wp:featuredmedia" });
 * if (result.ok) {
 *   for (const post of result.data) {
 *     const author = post._embedded?.author?.[0]?.name;
 *     const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
 *   }
 * }
 * ```
 */
export type WpEmbedded = z.infer<typeof WpEmbeddedSchema>;

/** A batch operation for the WordPress REST API. */
export type WpBatchOperation = z.infer<typeof WpBatchOperationSchema>;

/** Result of a WordPress batch operation. */
export type WpBatchResult = z.infer<typeof WpBatchResultSchema>;

/** Contract of the WordPress adapter facade. */
export interface IWordPressService {
	useWpGetPosts(options?: WpQueryParams): Promise<FetchResult<WpPost[]>>;
	useWpGetPost(id: number, options?: WpQueryParams): Promise<FetchResult<WpPost>>;
	useWpCreatePost(data: WpPostCreate): Promise<FetchResult<WpPost>>;
	useWpUpdatePost(id: number, data: WpPostUpdate): Promise<FetchResult<WpPost>>;
	useWpDeletePost(id: number, force?: boolean): Promise<FetchResult<WpPost>>;
	useWpGetPages(options?: WpQueryParams): Promise<FetchResult<WpPage[]>>;
	useWpGetPage(id: number, options?: WpQueryParams): Promise<FetchResult<WpPage>>;
	useWpCreatePage(data: WpPageCreate): Promise<FetchResult<WpPage>>;
	useWpUpdatePage(id: number, data: WpPageUpdate): Promise<FetchResult<WpPage>>;
	useWpDeletePage(id: number, force?: boolean): Promise<FetchResult<WpPage>>;
	useWpGetMedia(options?: WpQueryParams): Promise<FetchResult<WpMedia[]>>;
	useWpGetMediaItem(id: number): Promise<FetchResult<WpMedia>>;
	useWpUploadMedia(file: File | Blob | Buffer, meta?: WpMediaMeta): Promise<FetchResult<WpMedia>>;
	useWpUpdateMedia(id: number, data: WpMediaUpdate): Promise<FetchResult<WpMedia>>;
	useWpDeleteMedia(id: number, force?: boolean): Promise<FetchResult<WpMedia>>;
	useWpGetCategories(options?: WpQueryParams): Promise<FetchResult<WpCategory[]>>;
	useWpGetCategory(id: number): Promise<FetchResult<WpCategory>>;
	useWpCreateCategory(data: WpCategoryCreate): Promise<FetchResult<WpCategory>>;
	useWpUpdateCategory(id: number, data: WpCategoryUpdate): Promise<FetchResult<WpCategory>>;
	useWpDeleteCategory(id: number, force?: boolean): Promise<FetchResult<WpCategory>>;
	useWpGetTags(options?: WpQueryParams): Promise<FetchResult<WpTag[]>>;
	useWpGetTag(id: number): Promise<FetchResult<WpTag>>;
	useWpCreateTag(data: WpTagCreate): Promise<FetchResult<WpTag>>;
	useWpUpdateTag(id: number, data: WpTagUpdate): Promise<FetchResult<WpTag>>;
	useWpDeleteTag(id: number, force?: boolean): Promise<FetchResult<WpTag>>;
	useWpGetComments(options?: WpQueryParams): Promise<FetchResult<WpComment[]>>;
	useWpGetComment(id: number): Promise<FetchResult<WpComment>>;
	useWpCreateComment(data: WpCommentCreate): Promise<FetchResult<WpComment>>;
	useWpUpdateComment(id: number, data: WpCommentUpdate): Promise<FetchResult<WpComment>>;
	useWpDeleteComment(id: number, force?: boolean): Promise<FetchResult<WpComment>>;
	useWpGetUsers(options?: WpQueryParams): Promise<FetchResult<WpUser[]>>;
	useWpGetUser(id: number): Promise<FetchResult<WpUser>>;
	useWpGetCurrentUser(): Promise<FetchResult<WpUser>>;
	useWpCreateUser(data: WpUserCreate): Promise<FetchResult<WpUser>>;
	useWpUpdateUser(id: number, data: WpUserUpdate): Promise<FetchResult<WpUser>>;
	useWpDeleteUser(id: number, reassign?: number): Promise<FetchResult<WpUser>>;
	useWpDefineRoles(definitions: WpRoleDefinition[]): void;
	useWpRegisterRole(definition: WpRoleDefinition): void;
	useWpRoles(): WpRoleDefinition[];
	useWpGetRole(slug: AccessRole): WpRoleDefinition | undefined;
	useWpResetRoles(): void;
	useWpSyncRoles(): void;
	useWpAsSubject(user: WpUser): AccessSubject;
	useWpAssignRole(userId: number, role: string): Promise<FetchResult<WpUser>>;
	useWpUnassignRole(userId: number, role: string): Promise<FetchResult<WpUser>>;
	useWpGetUsersByRole(role: string, options?: WpQueryParams): Promise<FetchResult<WpUser[]>>;
	useWpAuditRole(slug: string, maxHolders?: number): Promise<FetchResult<WpRoleAudit>>;
	useWpGetCustomPosts(postType: string, options?: WpQueryParams): Promise<FetchResult<unknown[]>>;
	useWpGetCustomPost(
		postType: string,
		id: number,
		options?: WpQueryParams,
	): Promise<FetchResult<unknown>>;
	useWpCreateCustomPost(
		postType: string,
		data: Record<string, unknown>,
	): Promise<FetchResult<unknown>>;
	useWpUpdateCustomPost(
		postType: string,
		id: number,
		data: Record<string, unknown>,
	): Promise<FetchResult<unknown>>;
	useWpDeleteCustomPost(
		postType: string,
		id: number,
		force?: boolean,
	): Promise<FetchResult<unknown>>;
	useWpBatch(operations: WpBatchOperation[]): Promise<FetchResult<WpBatchResult>>;
	useWpListAllPosts(options?: WpQueryParams): Promise<FetchResult<WpPost[]>>;
	useWpSearchAllPosts(query: string, options?: WpQueryParams): Promise<FetchResult<WpPost[]>>;
	useWpFindPostBySlug(slug: string): Promise<FetchResult<WpPost | null>>;
}
