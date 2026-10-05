// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { fileURLToPath } from "node:url";

import { buildSidebar } from "./sidebar.mjs";

const DOCS_ORIGIN = "https://docs.senseikatana.com";

export default defineConfig({
	site: DOCS_ORIGIN,
	vite: {
		// Tailwind compiles the HyperUI example stylesheet injected into the
		// demo iframes (`src/styles/hyperui.css?inline`).
		plugins: [tailwindcss()],
		build: {
			rollupOptions: {
				// Astro's own `?astroPropagatedAssets` modules carry a
				// `use astro:head-inject` directive that Rollup warns about
				// after Astro already consumed it — pure upstream noise on
				// every MDX page with assets. Filter only that exact case.
				onwarn(warning, warn) {
					if (
						warning.code === "MODULE_LEVEL_DIRECTIVE" &&
						typeof warning.message === "string" &&
						warning.message.includes("astro:head-inject")
					) {
						return;
					}
					warn(warning);
				},
			},
		},
		resolve: {
			// Same aliases the VitePress setup used: docs import the built
			// private workspace directly (`@katanakit/ui` → packages/ui/dist).
			alias: {
				"@katanakit/ui/styles.css": fileURLToPath(
					new URL("../packages/ui/dist/styles.css", import.meta.url),
				),
				"@katanakit/ui": fileURLToPath(new URL("../packages/ui/dist/index.js", import.meta.url)),
			},
		},
	},
	integrations: [
		starlight({
			title: "KatanaKit",
			description:
				"A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.",
			favicon: "/img/favicon.ico",
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
			// Our own `src/content/docs/404.md` is the single 404 source; Starlight's
			// injected `/404` route would collide with it via `[...slug]`.
			disable404Route: true,
			lastUpdated: true,
			sidebar: buildSidebar(),
			head: [{ tag: "meta", attrs: { name: "theme-color", content: "#0a0a0a" } }],
			// Slot overrides composing the defaults (Starlight `components` map):
			// SEO dogfooding, navbar extras, splash hero extras, What's-new panel.
			components: {
				Head: "./src/components/starlight/Head.astro",
				SocialIcons: "./src/components/starlight/SocialIcons.astro",
				Hero: "./src/components/starlight/Hero.astro",
				PageFrame: "./src/components/starlight/PageFrame.astro",
			},
		}),
	],
});
