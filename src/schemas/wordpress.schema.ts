import { z } from "zod";

import { AccessCapabilitySchema, AccessRoleSchema } from "@/schemas/access.schema.js";

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
export const WpBaseEntitySchema = z
	.object({
		id: z.number(),
		date: z.string(),
		date_gmt: z.string(),
		guid: z
			.object({
				rendered: z.string(),
			})
			.catchall(z.unknown())
			.optional(),
		modified: z.string(),
		modified_gmt: z.string(),
		slug: z.string(),
		status: z.string(),
		type: z.string().optional(),
		link: z.string(),
	})
	.catchall(z.unknown());

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
	.object({
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
const WpMediaSizeSchema = z
	.object({
		source_url: z.string(),
		file: z.string(),
		width: z.number(),
		height: z.number(),
		mime_type: z.string(),
		filesize: z.number().optional(),
	})
	.catchall(z.unknown());

/** File and image details of a media item (all optional). */
const WpMediaDetailsSchema = z
	.object({
		width: z.number().optional(),
		height: z.number().optional(),
		file: z.string().optional(),
		filesize: z.number().optional(),
		image_meta: WpMediaImageMetaSchema.optional(),
		sizes: z.record(z.string(), WpMediaSizeSchema).optional(),
	})
	.catchall(z.unknown());

/** A WordPress media item (attachment). */
export const WpMediaSchema = WpBaseEntitySchema.extend({
	title: z.object({ rendered: z.string() }).catchall(z.unknown()),
	author: z.number(),
	media_type: z.string(),
	mime_type: z.string(),
	media_details: WpMediaDetailsSchema,
	source_url: z.string(),
	alt_text: z.string(),
	caption: z.object({ rendered: z.string() }).catchall(z.unknown()),
	description: z.object({ rendered: z.string() }).catchall(z.unknown()),
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
					.object({
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
		"wp:featuredmedia": z
			.array(
				WpBaseEntitySchema.extend({
					title: z.object({ rendered: z.string() }).catchall(z.unknown()),
					source_url: z.string(),
					alt_text: z.string(),
				}),
			)
			.optional(),
		"wp:term": z
			.array(
				z.array(
					z
						.object({
							id: z.number(),
							name: z.string(),
							slug: z.string(),
							taxonomy: z.string(),
							acf: WpAcfFieldsSchema.optional(),
						})
						.catchall(z.unknown()),
				),
			)
			.optional(),
		"wp:comment": z
			.array(
				z.array(
					z
						.object({
							id: z.number(),
							parent: z.number(),
							author: z.number(),
							author_name: z.string(),
							content: z.object({ rendered: z.string() }).catchall(z.unknown()),
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
	title: z.object({ rendered: z.string() }).catchall(z.unknown()),
	content: z.object({ rendered: z.string(), protected: z.boolean() }).catchall(z.unknown()),
	excerpt: z.object({ rendered: z.string(), protected: z.boolean() }).catchall(z.unknown()),
	author: z.number(),
	featured_media: z.number(),
	comment_status: z.string(),
	ping_status: z.string(),
	format: z.string(),
	meta: z.record(z.string(), z.unknown()),
	sticky: z.boolean(),
	template: z.string(),
	categories: z.array(z.number()),
	tags: z.array(z.number()),
	acf: WpAcfFieldsSchema.optional(),
	_embedded: z.lazy(() => WpEmbeddedSchema).optional(),
});

/** Payload for creating a WordPress post. */
export const WpPostCreateSchema = WpPostSchema.omit({
	id: true,
	date: true,
	date_gmt: true,
	modified: true,
	modified_gmt: true,
	link: true,
	_embedded: true,
}).partial({
	slug: true,
	status: true,
	format: true,
	template: true,
	meta: true,
	categories: true,
	tags: true,
	acf: true,
});

/** Payload for updating a WordPress post. */
export const WpPostUpdateSchema = WpPostSchema.omit({
	id: true,
	date: true,
	date_gmt: true,
	modified: true,
	modified_gmt: true,
	link: true,
	_embedded: true,
}).partial();

/** Post response variant (partials via `_fields` stay well-typed). */
export const WpPostResponseSchema = WpPostSchema.partial();

/** List of posts. */
export const WpPostListSchema = z.array(WpPostResponseSchema);

/** A WordPress page. */
export const WpPageSchema = WpBaseEntitySchema.extend({
	title: z.object({ rendered: z.string() }).catchall(z.unknown()),
	content: z.object({ rendered: z.string(), protected: z.boolean() }).catchall(z.unknown()),
	excerpt: z.object({ rendered: z.string(), protected: z.boolean() }).catchall(z.unknown()),
	author: z.number(),
	featured_media: z.number(),
	parent: z.number(),
	menu_order: z.number(),
	comment_status: z.string(),
	ping_status: z.string(),
	template: z.string(),
	meta: z.record(z.string(), z.unknown()),
	acf: WpAcfFieldsSchema.optional(),
	_embedded: z.lazy(() => WpEmbeddedSchema).optional(),
});

/** Payload for creating a WordPress page. */
export const WpPageCreateSchema = WpPageSchema.omit({
	id: true,
	date: true,
	date_gmt: true,
	modified: true,
	modified_gmt: true,
	link: true,
	_embedded: true,
}).partial({
	slug: true,
	status: true,
	template: true,
	parent: true,
	menu_order: true,
	meta: true,
	acf: true,
});

/** Payload for updating a WordPress page. */
export const WpPageUpdateSchema = WpPageSchema.omit({
	id: true,
	date: true,
	date_gmt: true,
	modified: true,
	modified_gmt: true,
	link: true,
	_embedded: true,
}).partial();

/** Page response variant (partials via `_fields` stay well-typed). */
export const WpPageResponseSchema = WpPageSchema.partial();

/** List of pages. */
export const WpPageListSchema = z.array(WpPageResponseSchema);

/** A WordPress category. */
export const WpCategorySchema = z
	.object({
		id: z.number(),
		count: z.number(),
		description: z.string(),
		link: z.string(),
		name: z.string(),
		slug: z.string(),
		taxonomy: z.string(),
		parent: z.number(),
		meta: z.record(z.string(), z.unknown()),
		acf: WpAcfFieldsSchema.optional(),
	})
	.catchall(z.unknown());

/** Payload for creating a WordPress category. */
export const WpCategoryCreateSchema = WpCategorySchema.omit({
	id: true,
	link: true,
	count: true,
	meta: true,
}).partial({
	description: true,
	parent: true,
	acf: true,
});

/** Payload for updating a WordPress category. */
export const WpCategoryUpdateSchema = WpCategorySchema.omit({
	id: true,
	link: true,
	count: true,
	meta: true,
}).partial();

/** Category response variant (partials via `_fields` stay well-typed). */
export const WpCategoryResponseSchema = WpCategorySchema.partial();

/** List of categories. */
export const WpCategoryListSchema = z.array(WpCategoryResponseSchema);

/** A WordPress tag. */
export const WpTagSchema = z
	.object({
		id: z.number(),
		count: z.number(),
		description: z.string(),
		link: z.string(),
		name: z.string(),
		slug: z.string(),
		taxonomy: z.string(),
		meta: z.record(z.string(), z.unknown()),
		acf: WpAcfFieldsSchema.optional(),
	})
	.catchall(z.unknown());

/** Payload for creating a WordPress tag. */
export const WpTagCreateSchema = WpTagSchema.omit({
	id: true,
	link: true,
	count: true,
	meta: true,
}).partial({
	description: true,
	acf: true,
});

/** Payload for updating a WordPress tag. */
export const WpTagUpdateSchema = WpTagSchema.omit({
	id: true,
	link: true,
	count: true,
	meta: true,
}).partial();

/** Tag response variant (partials via `_fields` stay well-typed). */
export const WpTagResponseSchema = WpTagSchema.partial();

/** List of tags. */
export const WpTagListSchema = z.array(WpTagResponseSchema);

/** A WordPress comment. */
export const WpCommentSchema = z
	.object({
		id: z.number(),
		post: z.number(),
		parent: z.number(),
		author: z.number(),
		author_name: z.string(),
		author_email: z.string(),
		author_url: z.string(),
		date: z.string(),
		date_gmt: z.string(),
		content: z.object({ rendered: z.string() }).catchall(z.unknown()),
		link: z.string(),
		status: z.string(),
		type: z.string(),
		author_avatar_urls: z.record(z.string(), z.string()),
		meta: z.record(z.string(), z.unknown()),
	})
	.catchall(z.unknown());

/** Payload for creating a WordPress comment. */
export const WpCommentCreateSchema = WpCommentSchema.omit({
	id: true,
	link: true,
	date: true,
	date_gmt: true,
	status: true,
	type: true,
	author_avatar_urls: true,
	meta: true,
}).partial({
	parent: true,
	author_name: true,
	author_email: true,
	author_url: true,
});

/** Payload for updating a WordPress comment. */
export const WpCommentUpdateSchema = WpCommentSchema.omit({
	id: true,
	post: true,
	link: true,
	date: true,
	date_gmt: true,
	type: true,
	author_avatar_urls: true,
	meta: true,
}).partial({
	parent: true,
	author: true,
	author_name: true,
	author_email: true,
	author_url: true,
	content: true,
	status: true,
});

/** Comment response variant (partials via `_fields` stay well-typed). */
export const WpCommentResponseSchema = WpCommentSchema.partial();

/** List of comments. */
export const WpCommentListSchema = z.array(WpCommentResponseSchema);

/** WordPress capability map. */
export const WpCapabilityMapSchema = z.record(z.string(), z.boolean());

/** A WordPress user. */
export const WpUserSchema = z
	.object({
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
		registered_date: z.string(),
		capabilities: WpCapabilityMapSchema,
		extra_capabilities: WpCapabilityMapSchema,
		avatar_urls: z.record(z.string(), z.string()),
		meta: z.record(z.string(), z.unknown()),
		acf: WpAcfFieldsSchema.optional(),
	})
	.catchall(z.unknown());

/** Payload for creating a WordPress user. */
export const WpUserCreateSchema = WpUserSchema.omit({
	id: true,
	link: true,
	registered_date: true,
	capabilities: true,
	extra_capabilities: true,
	avatar_urls: true,
	meta: true,
}).partial({
	first_name: true,
	last_name: true,
	description: true,
	locale: true,
	nickname: true,
	roles: true,
	acf: true,
});

/** Payload for updating a WordPress user. */
export const WpUserUpdateSchema = WpUserSchema.omit({
	id: true,
	link: true,
	registered_date: true,
	capabilities: true,
	extra_capabilities: true,
	avatar_urls: true,
	meta: true,
})
	.partial({
		username: true,
		name: true,
		first_name: true,
		last_name: true,
		email: true,
		url: true,
		description: true,
		locale: true,
		nickname: true,
		slug: true,
		roles: true,
		acf: true,
	})
	.extend({
		password: z.string().optional(),
	});

/** User response variant (partials via `_fields` stay well-typed). */
export const WpUserResponseSchema = WpUserSchema.partial();

/** List of users. */
export const WpUserListSchema = z.array(WpUserResponseSchema);

/** A WordPress menu location. */
export const WpMenuLocationSchema = z.object({
	name: z.string(),
	description: z.string(),
});

/** A WordPress menu item. */
export const WpMenuItemSchema = z
	.object({
		id: z.number(),
		title: z.string(),
		url: z.string(),
		target: z.string(),
		attr_title: z.string(),
		description: z.string(),
		classes: z.array(z.string()),
		xfn: z.string(),
		menu_order: z.number(),
		object_id: z.number(),
		object: z.string(),
		type: z.string(),
		type_label: z.string(),
		parent: z.number(),
		status: z.string(),
	})
	.catchall(z.unknown());

/** A WordPress menu. */
export const WpMenuSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		slug: z.string(),
		description: z.string(),
		count: z.number(),
		items: z.array(WpMenuItemSchema).optional(),
	})
	.catchall(z.unknown());

/** A WordPress settings object. */
export const WpSettingsSchema = z
	.object({
		title: z.string(),
		description: z.string(),
		url: z.string(),
		email: z.string(),
		timezone: z.string(),
		date_format: z.string(),
		time_format: z.string(),
		start_of_week: z.number(),
		language: z.string(),
		use_smilies: z.boolean(),
		default_category: z.number(),
		default_post_format: z.string(),
		posts_per_page: z.number(),
		default_ping_status: z.string(),
		default_comment_status: z.string(),
	})
	.catchall(z.unknown());

/** WordPress REST API error response. */
export const WpErrorSchema = z
	.object({
		code: z.string(),
		message: z.string(),
		data: z
			.object({
				status: z.number(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.catchall(z.unknown());

/** WordPress search result item. */
export const WpSearchResultSchema = z
	.object({
		id: z.number(),
		title: z.string(),
		url: z.string(),
		type: z.string(),
		subtype: z.string(),
	})
	.catchall(z.unknown());

/** List of search results. */
export const WpSearchListSchema = z.array(WpSearchResultSchema);

/** A single operation in a WordPress batch request. */
export const WpBatchOperationSchema = z.object({
	method: z.string(),
	path: z.string(),
	body: z.unknown().optional(),
	headers: z.record(z.string(), z.string()).optional(),
});

/** Result of a WordPress batch operation. */
export const WpBatchResultSchema = z
	.object({
		responses: z.array(
			z
				.object({
					status: z.number(),
					body: z.unknown(),
					headers: z.record(z.string(), z.string()),
				})
				.catchall(z.unknown()),
		),
	})
	.catchall(z.unknown());

/**
 * A WordPress capability name: `edit_orders`, `read_private_orders`,
 * `manage_options`. Snake_case, the vocabulary WordPress itself uses.
 */
export const WpCapabilitySchema = z
	.string()
	.min(1)
	.max(64)
	.regex(
		/^[a-z][a-z0-9_]*$/,
		"WordPress capability must be lowercase snake_case (e.g. edit_orders)",
	);

/**
 * A role declaration, the PHP-free replacement for `add_role()`.
 */
export const WpRoleDefinitionSchema = z.object({
	slug: AccessRoleSchema,
	label: z.string().min(1),
	rank: z.number().int().nonnegative(),
	capabilities: z.array(AccessCapabilitySchema),
	wpCapabilities: z.array(WpCapabilitySchema).default([]),
});

/** A declared role registry. */
export const WpRoleRegistrySchema = z.array(WpRoleDefinitionSchema);

/**
 * How a declaration compares to the live site.
 */
export const WpRoleAuditStatusSchema = z.enum(["verified", "partial", "unverifiable"]);

/**
 * The result of auditing a declared role against what WordPress reports.
 */
export const WpRoleAuditSchema = z.object({
	slug: AccessRoleSchema,
	status: WpRoleAuditStatusSchema,
	holders: z.number().int().nonnegative(),
	declared: z.array(WpCapabilitySchema),
	granted: z.array(WpCapabilitySchema),
	missing: z.array(WpCapabilitySchema),
	undeclared: z.array(WpCapabilitySchema),
});

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
