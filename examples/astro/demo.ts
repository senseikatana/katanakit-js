import { AstroService } from "@/api";

export const {
	GET_STATIC_PATHS,
	FIND_ENTRY,
	GENERATE_PAGINATION,
	PATHS_FROM_VALUES,
	EXTRACT_UNIQUE_VALUES,
}: AstroService = AstroService.getInstance();

// ============================================================
// TIPADOS DE LA DEMO
// ============================================================

export interface BlogPostData {
	title: string;
	tags: string[];
}

export type BlogPostEntry = CollectionEntryLike<BlogPostData>;

export interface CollectionEntryLike<TData = unknown> {
	id: string;
	slug?: string;
	data?: TData;
	[key: string]: unknown;
}

// Simulación de astro:content getCollection
export const mockGetCollection = async (
	_name: string,
): Promise<BlogPostEntry[]> => [
	{
		id: "1",
		slug: "hello-world",
		data: { title: "Hola Mundo", tags: ["javascript", "astro"] },
	},
	{
		id: "2",
		slug: "typescript-guide",
		data: { title: "Guía TS", tags: ["typescript", "astro"] },
	},
	{
		id: "3",
		slug: "singleton-pattern",
		data: { title: "Patrón Singleton", tags: ["architecture", "typescript"] },
	},
];

export const { GET_STATIC_PATHS }: AstroService = AstroService.getInstance();

const response = await GET_STATIC_PATHS(mockGetCollection, "blog", {
	param: "slug",
	valueFrom: (entry) => entry.slug ?? entry.id,
	propsFrom: (entry) => entry.data,
});

if (!response.ok) {
}

export async function runAstroDemo(): Promise<void> {
	// 1. GET_STATIC_PATHS con manejo de Safe Result ({ data, error, ok })
	const result = await GET_STATIC_PATHS(mockGetCollection, "blog", {
		param: "slug",
		valueFrom: (entry) => entry.slug ?? entry.id,
		propsFrom: (entry) => entry.data,
	});

	if (!result.ok) {
		console.error("Error al generar rutas:", result.error.message);
		return;
	}

	// Astro requiere retornar directamente este array en getStaticPaths()
	const staticPaths = result.data;
	console.log("Rutas generadas para Astro:", staticPaths);

	// 2. Colección cargada para utilidades síncronas
	const posts = await mockGetCollection("blog");

	// 3. FIND_ENTRY
	const singlePost = FIND_ENTRY(posts, "hello-world");
	console.log("Post encontrado:", singlePost?.data?.title);

	// 4. GENERATE_PAGINATION
	const paginatedPages = GENERATE_PAGINATION(posts, 2, "page");
	console.log("Páginas generadas:", paginatedPages.length);

	// 5. EXTRACT_UNIQUE_VALUES
	const uniqueTags = EXTRACT_UNIQUE_VALUES(
		posts,
		(post) => post.data?.tags ?? [],
	);
	console.log("Tags únicos extraídos:", uniqueTags);

	// 6. PATHS_FROM_VALUES
	const tagStaticPaths = PATHS_FROM_VALUES(uniqueTags, "tag");
	console.log("Rutas para páginas de tags:", tagStaticPaths);
}

runAstroDemo();
