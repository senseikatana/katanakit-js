import { docsSchema } from "@astrojs/starlight/schema";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsVersionsLoader } from "starlight-versions/loader";
import { defineCollection } from "astro:content";

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	versions: defineCollection({ loader: docsVersionsLoader() }),
};
