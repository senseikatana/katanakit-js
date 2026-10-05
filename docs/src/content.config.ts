import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
	docs: defineCollection({
		loader: docsLoader({
			// Preserve file names exactly (case included): the generated API
			// reference ships one page per symbol, e.g. api/classes/DatesService.md
			// must keep its /api/classes/DatesService route.
			generateId: ({ entry }) => entry.replace(/\.(mdx?|markdown)$/i, ""),
		}),
		schema: docsSchema(),
	}),
};
