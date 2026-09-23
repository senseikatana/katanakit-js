import { z } from "zod";

/** Authentication methods for WordPress. */
export const WordPressAuthSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("application-passwords"),
		username: z.string(),
		password: z.string(),
	}),
	z.object({
		type: z.literal("jwt"),
		token: z.string(),
	}),
	z.object({
		type: z.literal("basic"),
		username: z.string(),
		password: z.string(),
	}),
	z.object({
		type: z.literal("nonce"),
		nonce: z.string(),
		cookie: z.string(),
	}),
]);

/** Configuration for the WordPress REST API integration. */
export const WordPressConfigSchema = z.object({
	baseUrl: z.string(),
	auth: WordPressAuthSchema.optional(),
	apiNamespace: z.string().optional(),
});

/** Base fields shared by all WordPress entities. */
export const WpBaseEntitySchema = z.looseObject({
	id: z.number(),
	date: z.string(),
	date_gmt: z.string(),
	modified: z.string(),
	modified_gmt: z.string(),
	slug: z.string(),
	status: z.string(),
	link: z.string(),
});

/** Container for ACF (Advanced Custom Fields) fields. */
export const WpAcfFieldsSchema = z.record(z.string(), z.unknown());

/** Metadata for a media upload. */
export const WpMediaMetaSchema = z.object({
	title: z.string().optional(),
	alt_text: z.string().optional(),
	caption: z.string().optional(),
	description: z.string().optional(),
	post: z.number().optional(),
	slug: z.string().optional(),
});

/** Image metadata from EXIF data (all optional, preserves extra keys). */
const WpMediaImageMetaSchema = z
	.looseObject({
		aperture: z.string().optional(),
		credit: z.string().optional(),
		camera: z.string().optional(),
		caption: z.string().optional(),
		created_timestamp: z.string().optional(),
		copyright: z.string().optional(),
		focal_length: z.string().optional(),
		iso: z.string().optional(),
		orientation: z.string().optional(),
		shutter_speed: z.string().optional(),
		title: z.string().optional(),
	})
	.catchall(z.unknown());

/** Single registered image size. */
const WpMediaSizeSchema = z.looseObject({
	source_url: z.string(),
	file: z.string(),
	width: z.number(),
	height: z.number(),
	mime_type: z.string(),
	filesize: z.number().optional(),
});

/** File and image details of a media item (all optional). */
const WpMediaDetailsSchema = z.looseObject({
	width: z.number().optional(),
	height: z.number().optional(),
	file: z.string().optional(),
	filesize: z.number().optional(),
	image_meta: WpMediaImageMetaSchema.optional(),
	sizes: z.record(z.string(), WpMediaSizeSchema).optional(),
});

/** A WordPress media item (attachment). */
export const WpMediaSchema = WpBaseEntitySchema.extend({
	title: z.looseObject({ rendered: z.string() }),
	author: z.number(),
	media_type: z.string(),
	mime_type: z.string(),
	media_details: WpMediaDetailsSchema,
	source_url: z.string(),
	alt_text: z.string(),
	caption: z.looseObject({ rendered: z.string() }),
	description: z.looseObject({ rendered: z.string() }),
	post: z.number().nullable(),
	meta: z.record(z.string(), z.unknown()),
	acf: WpAcfFieldsSchema.optional(),
	_embedded: z.lazy(() => WpEmbeddedSchema).optional(),
});

/** Payload for updating a WordPress media item. */
export const WpMediaUpdateSchema = WpMediaMetaSchema.partial().extend({
	status: z.string().optional(),
});

/** Media response variant (partials via `_fields` stay well-typed). */
export const WpMediaResponseSchema = WpMediaSchema.partial();

/** List of media items. */
export const WpMediaListSchema = z.array(WpMediaResponseSchema);

/** Embedded resources returned when `_embed` is used. */
export const WpEmbeddedSchema = z
	.object({
		author: z
			.array(
				z
					.looseObject({
						id: z.number(),
						name: z.string(),
						url: z.string(),
						description: z.string(),
						link: z.string(),
						slug: z.string(),
						avatar_urls: z.record(z.string(), z.string()),
						acf: WpAcfFieldsSchema.optional(),
					})
					.catchall(z.unknown()),
			)
			.optional(),
		// Kept self-contained (no `WpMediaSchema` reference) to break the
		// runtime schema cycle: embedded media never nests `_embedded`.
		"wp:featuredmedia": z
			.array(
				WpBaseEntitySchema.extend({
					title: z.looseObject({ rendered: z.string() }),
					source_url: z.string(),
					alt_text: z.string(),
				})
					.partial()
					.catchall(z.unknown()),
			)
			.optional(),
		"wp:term": z
			.array(
				z.array(
					z
						.looseObject({
							id: z.number(),
							name: z.string(),
							slug: z.string(),
							_taxonomy: z.string(),
							link: z.string(),
							count: z.number().optional(),
						})
						.catchall(z.unknown()),
				),
			)
			.optional(),
		replies: z
			.array(
				z.array(
					z
						.looseObject({
							id: z.number(),
							parent: z.number(),
							author: z.number(),
							author_name: z.string(),
							content: z.looseObject({ rendered: z.string() }),
							date: z.string(),
						})
						.catchall(z.unknown()),
				),
			)
			.optional(),
	})
	.catchall(z.unknown());

/** A WordPress post. */
export const WpPostSchema = WpBaseEntitySchema.extend({
	title: z.looseObject({ rendered: z.string() }),
	content: z.looseObject({ rendered: z.string(), protected: z.boolean() }),
	excerpt: z.looseObject({ rendered: z.string(), protected: z.boolean() }),
	author: z.number(),
	featured_media: z.number(),
	comment_status: z.string(),
	ping_status: z.string(),
	sticky: z.boolean(),
	template: z.string(),
	format: z.string(),
	categories: z.array(z.number()),
	tags: z.array(z.number()),
	meta: z.record(z.string(), z.unknown()),
	acf: WpAcfFieldsSchema.optional(),
	_embedded: WpEmbeddedSchema.optional(),
});

/** Payload for creating a WordPress post. */
export const WpPostCreateSchema = z.object({
	title: z.string(),
	content: z.string().optional(),
	excerpt: z.string().optional(),
	author: z.number().optional(),
	featured_media: z.number().optional(),
	comment_status: z.enum(["open", "closed"]).optional(),
	ping_status: z.enum(["open", "closed"]).optional(),
	sticky: z.boolean().optional(),
	format: z.string().optional(),
	categories: z.array(z.number()).optional(),
	tags: z.array(z.number()).optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	status: z.enum(["publish", "future", "draft", "pending", "private"]).optional(),
	slug: z.string().optional(),
	date: z.string().optional(),
	template: z.string().optional(),
});

/** Payload for updating a WordPress post. */
export const WpPostUpdateSchema = WpPostCreateSchema.partial();

/** Post response variant (partials via `_fields` stay well-typed). */
export const WpPostResponseSchema = WpPostSchema.partial();

/** List of posts. */
export const WpPostListSchema = z.array(WpPostResponseSchema);

/** A WordPress page. */
export const WpPageSchema = WpBaseEntitySchema.extend({
	title: z.looseObject({ rendered: z.string() }),
	content: z.looseObject({ rendered: z.string(), protected: z.boolean() }),
	excerpt: z.looseObject({ rendered: z.string(), protected: z.boolean() }),
	author: z.number(),
	featured_media: z.number(),
	parent: z.number(),
	menu_order: z.number(),
	comment_status: z.string(),
	ping_status: z.string(),
	template: z.string(),
	meta: z.record(z.string(), z.unknown()),
	acf: WpAcfFieldsSchema.optional(),
	_embedded: WpEmbeddedSchema.optional(),
});

/** Payload for creating a WordPress page. */
export const WpPageCreateSchema = z.object({
	title: z.string(),
	content: z.string().optional(),
	excerpt: z.string().optional(),
	author: z.number().optional(),
	featured_media: z.number().optional(),
	parent: z.number().optional(),
	menu_order: z.number().optional(),
	comment_status: z.enum(["open", "closed"]).optional(),
	ping_status: z.enum(["open", "closed"]).optional(),
	status: z.enum(["publish", "future", "draft", "pending", "private"]).optional(),
	slug: z.string().optional(),
	date: z.string().optional(),
	template: z.string().optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

/** Payload for updating a WordPress page. */
export const WpPageUpdateSchema = WpPageCreateSchema.partial();

/** Page response variant (partials via `_fields` stay well-typed). */
export const WpPageResponseSchema = WpPageSchema.partial();

/** List of pages. */
export const WpPageListSchema = z.array(WpPageResponseSchema);

/** A WordPress category. */
export const WpCategorySchema = z.looseObject({
	id: z.number(),
	count: z.number(),
	description: z.string(),
	link: z.string(),
	name: z.string(),
	slug: z.string(),
	parent: z.number(),
	meta: z.record(z.string(), z.unknown()),
});

/** Payload for creating a WordPress category. */
export const WpCategoryCreateSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	slug: z.string().optional(),
	parent: z.number().optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

/** Payload for updating a WordPress category. */
export const WpCategoryUpdateSchema = WpCategoryCreateSchema.partial();

/** Category response variant (partials via `_fields` stay well-typed). */
export const WpCategoryResponseSchema = WpCategorySchema.partial();

/** List of categories. */
export const WpCategoryListSchema = z.array(WpCategoryResponseSchema);

/** A WordPress tag. */
export const WpTagSchema = z.looseObject({
	id: z.number(),
	count: z.number(),
	description: z.string(),
	link: z.string(),
	name: z.string(),
	slug: z.string(),
	meta: z.record(z.string(), z.unknown()),
});

/** Payload for creating a WordPress tag. */
export const WpTagCreateSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	slug: z.string().optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

/** Payload for updating a WordPress tag. */
export const WpTagUpdateSchema = WpTagCreateSchema.partial();

/** Tag response variant (partials via `_fields` stay well-typed). */
export const WpTagResponseSchema = WpTagSchema.partial();

/** List of tags. */
export const WpTagListSchema = z.array(WpTagResponseSchema);

/** A WordPress comment. */
export const WpCommentSchema = z.looseObject({
	id: z.number(),
	post: z.number(),
	parent: z.number(),
	author: z.number(),
	author_name: z.string(),
	author_email: z.string(),
	author_url: z.string(),
	date: z.string(),
	date_gmt: z.string(),
	content: z.looseObject({ rendered: z.string() }),
	link: z.string(),
	status: z.string(),
	type: z.string(),
	author_avatar_urls: z.record(z.string(), z.string()),
	meta: z.record(z.string(), z.unknown()),
});

/** Payload for creating a WordPress comment. */
export const WpCommentCreateSchema = z.object({
	post: z.number(),
	parent: z.number().optional(),
	content: z.string(),
	author: z.number().optional(),
	author_name: z.string().optional(),
	author_email: z.string().optional(),
	author_url: z.string().optional(),
	status: z.string().optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

/** Payload for updating a WordPress comment. */
export const WpCommentUpdateSchema = WpCommentCreateSchema.partial();

/** Comment response variant (partials via `_fields` stay well-typed). */
export const WpCommentResponseSchema = WpCommentSchema.partial();

/** List of comments. */
export const WpCommentListSchema = z.array(WpCommentResponseSchema);

/** A WordPress user. */
export const WpUserSchema = z.looseObject({
	id: z.number(),
	username: z.string(),
	name: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	email: z.string(),
	url: z.string(),
	description: z.string(),
	link: z.string(),
	locale: z.string(),
	nickname: z.string(),
	slug: z.string(),
	roles: z.array(z.string()),
	avatar_urls: z.record(z.string(), z.string()),
	meta: z.record(z.string(), z.unknown()),
});

/** Payload for creating a WordPress user. */
export const WpUserCreateSchema = z.object({
	username: z.string(),
	name: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string(),
	url: z.string().optional(),
	description: z.string().optional(),
	locale: z.string().optional(),
	nickname: z.string().optional(),
	slug: z.string().optional(),
	roles: z.array(z.string()).optional(),
	password: z.string().optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

/** Payload for updating a WordPress user. */
export const WpUserUpdateSchema = WpUserCreateSchema.partial();

/** User response variant (partials via `_fields` stay well-typed). */
export const WpUserResponseSchema = WpUserSchema.partial();

/** List of users. */
export const WpUserListSchema = z.array(WpUserResponseSchema);

/** Common query parameters for WordPress REST API list endpoints. */
export const WpQueryParamsSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
		search: z.string().optional(),
		order: z.enum(["asc", "desc"]).optional(),
		orderby: z.string().optional(),
		offset: z.number().optional(),
		include: z.array(z.number()).optional(),
		exclude: z.array(z.number()).optional(),
		slug: z.string().optional(),
		status: z.union([z.string(), z.array(z.string())]).optional(),
		author: z.union([z.number(), z.array(z.number())]).optional(),
		categories: z.union([z.number(), z.array(z.number())]).optional(),
		tags: z.union([z.number(), z.array(z.number())]).optional(),
		_fields: z.string().optional(),
		_embed: z.union([z.boolean(), z.string()]).optional(),
	})
	.catchall(z.unknown());

/** A batch operation for the WordPress REST API. */
export const WpBatchOperationSchema = z.object({
	method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
	path: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

/** Result of a WordPress batch operation. */
export const WpBatchResultSchema = z.looseObject({
	responses: z.array(
		z.looseObject({
			status: z.number(),
			body: z.unknown(),
			headers: z.record(z.string(), z.string()),
		}),
	),
});
