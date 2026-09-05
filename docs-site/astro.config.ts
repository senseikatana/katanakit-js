import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { typeDocSidebarGroup } from "starlight-typedoc";

import {
	changelogLink,
	guidesGroup,
	PluginFactory,
	siteConfig,
	versions,
} from "./src/config/index.js";

export default defineConfig({
	site: siteConfig.site,
	base: siteConfig.base,
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		starlight({
			title: siteConfig.title,
			description: siteConfig.description,
			customCss: ["./src/styles/global.css"],
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: siteConfig.repoUrl,
				},
			],
			editLink: {
				baseUrl: `${siteConfig.repoUrl}/edit/${siteConfig.editBranch}/docs-site/`,
			},
			plugins: [
				...PluginFactory.createVersionsPlugin(versions),
				PluginFactory.createTypeDocPlugin(),
			],
			sidebar: [
				guidesGroup,
				typeDocSidebarGroup,
				changelogLink,
			],
		}),
	],
});
