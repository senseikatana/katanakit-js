/**
 * Example: generate Astro `getStaticPaths` routes with AstroService.
 *
 * Run with: `bun run examples/astro/demo.ts`
 */
import { AstroService } from "@/adapters/astro";
import type { CollectionEntryLike } from "@/adapters/astro";

interface BlogPostData {
	title: string;
	tags: string[];
}

type BlogPostEntry = CollectionEntryLike<BlogPostData>;

const mockGetCollection = async (_name: string): Promise<BlogPostEntry[]> => [
	{ id: "1", slug: "hello-world", data: { title: "Hello World", tags: ["javascript", "astro"] } },
	{ id: "2", slug: "typescript-guide", data: { title: "TypeScript Guide", tags: ["typescript", "astro"] } },
	{ id: "3", slug: "singleton-pattern", data: { title: "Singleton Pattern", tags: ["architecture", "typescript"] } },
];

const {
	GET_STATIC_PATHS,
	FIND_ENTRY,
	GENERATE_PAGINATION,
	PATHS_FROM_VALUES,
	EXTRACT_UNIQUE_VALUES,
}: AstroService = AstroService.getInstance();

async function main(): Promise<void> {
	// 1. GET_STATIC_PATHS with Safe Result ({ data, error, ok }).
	const result = await GET_STATIC_PATHS(mockGetCollection, "blog", {
		param: "slug",
		valueFrom: (entry) => entry.slug ?? entry.id,
		propsFrom: (entry) => entry.data,
	});

	if (!result.ok) {
		console.error("Error generating routes:", result.error.message);
		return;
	}

	console.log("Generated Astro routes:", result.data);

	// 2. Load the collection for the synchronous utilities.
	const posts = await mockGetCollection("blog");

	// 3. FIND_ENTRY
	const singlePost = FIND_ENTRY(posts, "hello-world");
	console.log("Found post:", singlePost?.data?.title);

	// 4. GENERATE_PAGINATION
	const paginated = GENERATE_PAGINATION(posts, 2, "page");
	console.log("Generated pages:", paginated.length);

	// 5. EXTRACT_UNIQUE_VALUES
	const uniqueTags = EXTRACT_UNIQUE_VALUES(posts, (post) => post.data?.tags ?? []);
	console.log("Unique tags:", uniqueTags);

	// 6. PATHS_FROM_VALUES
	const tagRoutes = PATHS_FROM_VALUES(uniqueTags, "tag");
	console.log("Tag routes:", tagRoutes);
}

main();
