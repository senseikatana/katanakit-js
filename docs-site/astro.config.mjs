import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightTypeDoc, {
	typeDocSidebarGroup,
} from "starlight-typedoc";
import starlightVersions from "starlight-versions";

async function loadVersions() {
	try {
		const mod = await import("./versions.config.mjs");
		const versions = mod.default ?? [];
		if (versions.length === 0) return [];
		return [
			starlightVersions({
				versions,
				current: { label: "Latest" },
			}),
		];
	} catch {
		return [];
	}
}

const versionPlugins = await loadVersions();

export default defineConfig({
	site: "https://senseikatana.github.io",
	base: "/katanakit-js",
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
				baseUrl:
					"https://github.com/senseikatana/katanakit-js/edit/dev/docs-site/",
			},
			plugins: [
				...versionPlugins,
				starlightTypeDoc({
					entryPoints: ["../src/index.ts"],
					tsconfig: "../tsconfig.json",
					output: "api",
					sidebar: { label: "API Reference", collapsed: false },
					watch: false,
				}),
			],
			sidebar: [
				{
					label: "Guides",
					items: [
						{
							label: "Getting Started",
							link: "/guides/getting-started/",
						},
						{
							label: "Architecture",
							link: "/guides/architecture/",
						},
						{ label: "Roadmap", link: "/guides/roadmap/" },
					],
				},
				typeDocSidebarGroup,
				{ label: "Changelog", link: "/changelog/" },
			],
		}),
	],
});
