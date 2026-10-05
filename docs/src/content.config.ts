import { defineCollection } from "astro:content";
import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";

export const collections = {
	docs: defineCollection({
		loader: docsLoader({
			// Preserve file names exactly (case included): the generated API
			// reference ships one page per symbol, e.g. api/classes/DatesService.md
			// must keep its /api/classes/DatesService route. `index` files map to
			// their folder route (guides/services/index.md → guides/services).
			generateId: ({ entry }) => {
				const base = entry.replace(/\.(mdx?|markdown)$/i, "");
				// Root index.md must stay "index" (Starlight's home entry);
				// nested index files map to their folder route.
				if (base === "index") return "index";
				return base.replace(/(^|\/)index$/, "$1").replace(/\/+$/, "");
			},
		}),
		schema: docsSchema(),
	}),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
