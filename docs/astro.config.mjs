// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import { buildSidebar } from "./sidebar.mjs";

const DOCS_ORIGIN = "https://docs.senseikatana.com";

export default defineConfig({
	site: DOCS_ORIGIN,
	vite: {
		// Tailwind compiles the HyperUI example stylesheet injected into the
		// demo iframes (`src/styles/hyperui.css?inline`).
		plugins: [tailwindcss()],
	},
	integrations: [
		starlight({
			title: "KatanaKit",
			description:
				"A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/senseikatana/katanakit-js",
				},
			],
			editLink: {
				baseUrl: "https://github.com/senseikatana/katanakit-js/edit/dev/docs/",
			},
			customCss: ["../packages/ui/dist/styles.css", "./src/styles/custom.css"],
			lastUpdated: true,
			sidebar: buildSidebar(),
			head: [{ tag: "meta", attrs: { name: "theme-color", content: "#0a0a0a" } }],
		}),
	],
});
