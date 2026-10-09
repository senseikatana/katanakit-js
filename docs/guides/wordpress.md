---
title: WordPress
description: Drive a WordPress site's REST API — posts, pages, media, taxonomies, comments, users and custom post types.
---

# WordPress

The WordPress adapter wraps the [WordPress REST API](https://developer.wordpress.org/rest-api/)
with full CRUD for posts, pages, media, categories, tags, comments, users,
custom post types, and batch operations. Every function returns
`FetchResult<T>` — the same Safe Result contract as the rest of the toolkit —
and responses are validated with Zod at the boundary.

## 1. Pick an auth method and connect

Application Passwords is the recommended method for servers and scripts
(WP Admin → Users → Your Profile → Application Passwords):

```ts
import { defineWordPressConfig } from "katanakit-js/adapters/wordpress";

defineWordPressConfig({
	baseUrl: "https://mysite.com",
	auth: { type: "application-passwords", username: "admin", password: "xxxx xxxx xxxx" },
});
```

JWT tokens and theme-side nonces are also supported:

```ts
// JWT
defineWordPressConfig({
	baseUrl: "https://mysite.com",
	auth: { type: "jwt", token: "eyJhbGci..." },
});

// Nonce-based (inside a WP theme, for logged-in users)
defineWordPressConfig({
	baseUrl: "https://mysite.com",
	auth: { type: "nonce", nonce: "abc123" },
});
```

## 2. Posts

```ts
import {
	useWpGetPosts,
	useWpGetPost,
	useWpCreatePost,
	useWpUpdatePost,
	useWpDeletePost,
	useWpListAllPosts,
	useWpSearchAllPosts,
	useWpFindPostBySlug,
} from "katanakit-js/adapters/wordpress";

// Paginated list
const posts = await useWpGetPosts({ per_page: 5, status: "publish", orderby: "date", order: "desc" });

// Single post with embedded resources
const post = await useWpGetPost(42, { _embed: true });
if (post.ok) console.log(post.data.title.rendered);

// Create
await useWpCreatePost({
	title: "My New Post",
	content: "<p>Hello World!</p>",
	status: "publish", // "draft" | "pending" | "publish"
	categories: [1, 3],
	tags: [5, 8],
});

// Update and delete (trash by default, permanent with `true`)
await useWpUpdatePost(42, { title: "Updated Title", status: "publish" });
await useWpDeletePost(42);
await useWpDeletePost(42, true);

// ALL posts — the helper loops through pagination for you
const all = await useWpListAllPosts({ status: "publish" });
if (all.ok) console.log(`Total: ${all.data.length}`);

// Keyword search across all pages of results
const found = await useWpSearchAllPosts("tutorial");
if (found.ok) found.data.forEach((p) => console.log(p.title.rendered));

// Dynamic routes like /blog/:slug
const bySlug = await useWpFindPostBySlug("hello-world");
if (bySlug.ok && bySlug.data) console.log(bySlug.data.title.rendered);
```

## 3. Pages

```ts
import {
	useWpGetPages,
	useWpGetPage,
	useWpCreatePage,
	useWpUpdatePage,
	useWpDeletePage,
} from "katanakit-js/adapters/wordpress";

const pages = await useWpGetPages({ per_page: 20 });

const page = await useWpGetPage(10);
if (page.ok) console.log(page.data.title.rendered);

await useWpCreatePage({
	title: "About Us",
	content: "<p>Welcome to our site!</p>",
	status: "publish",
	parent: 0, // top-level page; set a page ID for child pages
});

await useWpUpdatePage(10, { title: "Updated About" });
await useWpDeletePage(10); // trash
```

## 4. Media

```ts
import {
	useWpGetMedia,
	useWpGetMediaItem,
	useWpUploadMedia,
	useWpUpdateMedia,
	useWpDeleteMedia,
} from "katanakit-js/adapters/wordpress";

const media = await useWpGetMedia({ per_page: 20, media_type: "image" });

const item = await useWpGetMediaItem(42);
if (item.ok) console.log(item.data.source_url);

// Upload from the browser (File from <input type="file">)
const file = document.querySelector("input[type=file]").files[0];
const uploaded = await useWpUploadMedia(file, {
	title: "My Image",
	alt_text: "Description for accessibility",
	caption: "Image caption",
});
if (uploaded.ok) console.log(uploaded.data.source_url); // use in content

// Upload from Node.js (Buffer)
import fs from "node:fs";
const buffer = fs.readFileSync("photo.jpg");
await useWpUploadMedia(buffer, { title: "Photo" });

await useWpUpdateMedia(42, { alt_text: "New alt text", caption: "Updated caption" });
await useWpDeleteMedia(42, true); // permanent
```

## 5. Categories, tags, comments and users

```ts
import {
	useWpGetCategories,
	useWpCreateCategory,
	useWpUpdateCategory,
	useWpDeleteCategory,
	useWpGetTags,
	useWpCreateTag,
	useWpDeleteTag,
	useWpGetComments,
	useWpCreateComment,
	useWpUpdateComment,
	useWpDeleteComment,
	useWpGetUsers,
	useWpGetCurrentUser,
	useWpCreateUser,
	useWpUpdateUser,
	useWpDeleteUser,
} from "katanakit-js/adapters/wordpress";

// Categories and tags
const cats = await useWpGetCategories({ per_page: 50 });
await useWpCreateCategory({ name: "Technology", slug: "tech", description: "Tech posts" });
await useWpUpdateCategory(5, { name: "Tech News" });
await useWpDeleteCategory(5);

const tags = await useWpGetTags({ search: "javascript" });
await useWpCreateTag({ name: "TypeScript", slug: "typescript" });
await useWpDeleteTag(12);

// Comments (creation works for authenticated and public flows)
const comments = await useWpGetComments({ post: 42, per_page: 10 });
await useWpCreateComment({
	post: 42,
	content: "Great article!",
	author_name: "John",
	author_email: "john@example.com",
});
await useWpUpdateComment(7, { content: "Updated comment" });
await useWpDeleteComment(7);

// Users
const users = await useWpGetUsers({ roles: "editor" });
const me = await useWpGetCurrentUser();
await useWpCreateUser({
	username: "johndoe",
	email: "john@example.com",
	password: "secure-password",
	roles: ["editor"],
});
await useWpUpdateUser(2, { name: "John Smith" });
await useWpDeleteUser(2, 1); // reassign content to user 1
```

## 6. Custom post types

Any registered CPT works — `product`, `portfolio`, `event`, …:

```ts
import {
	useWpGetCustomPosts,
	useWpGetCustomPost,
	useWpCreateCustomPost,
	useWpUpdateCustomPost,
	useWpDeleteCustomPost,
} from "katanakit-js/adapters/wordpress";

const products = await useWpGetCustomPosts("product", { per_page: 10 });
const product = await useWpGetCustomPost("product", 15);

await useWpCreateCustomPost("product", {
	title: "Widget",
	content: "<p>A great widget</p>",
	status: "publish",
});

await useWpUpdateCustomPost("product", 15, { title: "Updated Widget" });
await useWpDeleteCustomPost("product", 15, true);
```

## 7. Batch requests

```ts
import { useWpBatch } from "katanakit-js/adapters/wordpress";

const result = await useWpBatch([
	{ method: "GET", path: "/wp/v2/posts?per_page=2" },
	{ method: "GET", path: "/wp/v2/pages?per_page=2" },
	{ method: "GET", path: "/wp/v2/categories?per_page=5" },
]);

if (result.ok) {
	result.data.responses.forEach((resp) => console.log(resp.status));
}
```

## 8. Trim payloads: `_fields`, `_embed` and ACF

`_fields` requests only what a list view needs — a large payload reduction:

```ts
const posts = await useWpGetPosts({ per_page: 20, _fields: "id,title,link,slug,date" });
```

`_embed` inlines related resources (author, featured media, terms) instead of
extra round trips:

```ts
const posts = await useWpGetPosts({ _embed: "author,wp:featuredmedia" });

if (posts.ok) {
	for (const post of posts.data) {
		const author = post._embedded?.author?.[0]?.name;
		const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
		const thumbnail =
			post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.thumbnail?.source_url;
	}
}
```

[ACF](https://www.advancedcustomfields.com/) fields come through transparently
on the `acf` property of posts, pages, media and CPT entries:

```ts
const posts = await useWpGetPosts({ per_page: 5, _fields: "id,title,acf" });

if (posts.ok) {
	for (const post of posts.data) {
		if (post.acf) console.log(post.acf.my_field_name); // dynamic field names
	}
}

// Everything at once for a full-featured list view
const full = await useWpGetPosts({
	per_page: 5,
	_fields: "id,title,link,slug,date,acf",
	_embed: "author,wp:featuredmedia",
});
```

## 9. Framework examples

| Framework | Example | Description |
| --- | --- | --- |
| **Vue 3** | [`examples/wordpress/vue-blog.vue`](https://github.com/senseikatana/katanakit-js/tree/main/examples/wordpress/vue-blog.vue) | Blog listing with categories and featured images |
| **Nuxt 3** | [`examples/wordpress/nuxt-blog.vue`](https://github.com/senseikatana/katanakit-js/tree/main/examples/wordpress/nuxt-blog.vue) | SSR blog listing with `useAsyncData` |
| **Astro** | [`examples/wordpress/astro-blog.astro`](https://github.com/senseikatana/katanakit-js/tree/main/examples/wordpress/astro-blog.astro) | Static blog listing |
| **Next.js** | [`examples/wordpress/next-blog.tsx`](https://github.com/senseikatana/katanakit-js/tree/main/examples/wordpress/next-blog.tsx) | Server component listing |
| **Node.js** | [`examples/wordpress/demo.ts`](https://github.com/senseikatana/katanakit-js/tree/main/examples/wordpress/demo.ts) | Runnable demo covering all operations |

## Related

- [Astro Adapter](/guides/services/astro-adapter) — turning these calls into static routes.
- [Query Client](/guides/query-client) — caching and invalidating CMS reads.
- [HTTP Client](/guides/services/http-client) — the underlying Safe Result and options.
