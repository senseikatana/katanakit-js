import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type HeadConfig } from "vitepress";

import { defineSeoMetaConfig, useSeoMeta } from "../../src/config/seo.service.js";
import type { SiteConfig } from "../../src/config/site.config.js";

const DOCS_ORIGIN = "https://docs.senseikatana.com";
const DOCS_OG_IMAGE = `${DOCS_ORIGIN}/images/social-card.jpg`;
const DOCS_KEYWORDS =
	"katanakit, typescript, hexagonal architecture, api, rest, graphql, safe results, zod, query client";

/** Docs site config consumed by the library's own SEO helpers (dogfooding). */
const docsSiteConfig: SiteConfig = defineSeoMetaConfig({
	site: DOCS_ORIGIN,
	title: "KatanaKit",
	description:
		"A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.",
	lang: "en-US",
	author: "Sergio Jurado",
	ogImage: DOCS_OG_IMAGE,
	rss: { enabled: false, path: "/rss.xml", limit: 20 },
	seo: { noindex: false, canonical: true, openGraph: true, twitterCard: true, jsonLd: true },
});

/** Canonical URL for a page (`index.md` maps to the section root). */
function pageUrl(relativePath: string): string {
	const clean = relativePath
		.replace(/(^|\/)index\.md$/, "$1")
		.replace(/\.md$/, "")
		.replace(/\/$/, "");
	return clean ? `${DOCS_ORIGIN}/${clean}` : `${DOCS_ORIGIN}/`;
}

/**
 * Releases section: the changelog plus one anchor per previous major (each one
 * pointing at that major's newest release). Reads the signals that
 * `scripts/docs-prepare.mjs` writes; a fresh clone degrades to a single link.
 */
function releaseSidebarItems(): { text: string; link: string }[] {
	type VersionSignal = { version: string; anchor: string; major?: string };
	try {
		const file = fileURLToPath(new URL("./theme/signals.json", import.meta.url));
		const signals = JSON.parse(readFileSync(file, "utf8")) as {
			versions?: { latest: VersionSignal; previous: VersionSignal[] } | null;
		};
		if (!signals.versions) throw new Error("signals without versions");
		const { latest, previous } = signals.versions;
		return [
			{ text: "Changelog", link: "/changelog" },
			{ text: `v${latest.version} (latest)`, link: `/changelog${latest.anchor}` },
			...previous.map((release) => ({
				text: `v${release.major}.x`,
				link: `/changelog${release.anchor}`,
			})),
		];
	} catch {
		return [{ text: "Changelog", link: "/changelog" }];
	}
}

/**
 * Post-processes the built HTML so every `<meta>` (plus canonical links and the
 * anti-FOUC inline scripts) sits right after `<title>`, before stylesheet links
 * and the app script. VitePress renders its `head` entries after the assets and
 * only offers `transformHtml` to reorder the final document.
 */
function reorderHead(html: string): string {
	const head = /<head>([\s\S]*?)<\/head>/.exec(html);
	if (!head) return html;

	const moved: string[] = [];
	let inner = head[1];

	inner = inner.replace(/<meta\b[^>]*>/g, (tag) => {
		if (/\bcharset\s*=/i.test(tag)) return tag;
		moved.push(tag);
		return "";
	});
	inner = inner.replace(/<link\b[^>]*rel="canonical"[^>]*>/g, (tag) => {
		moved.push(tag);
		return "";
	});
	inner = inner.replace(
		/<script (?:id="check-(?:dark-mode|mac-os)"|type="application\/ld\+json")[\s\S]*?<\/script>/g,
		(tag) => {
			moved.push(tag);
			return "";
		},
	);
	// Drop the whitespace-only lines the extracted tags leave behind.
	inner = inner.replace(/\n[ \t]+(?=\n)/g, "");

	if (moved.length === 0) return html;

	const titleEnd = inner.indexOf("</title>");
	const at = titleEnd === -1 ? inner.indexOf(">") + 1 : titleEnd + "</title>".length;
	const ordered = `${inner.slice(0, at)}\n    ${moved.join("\n    ")}\n${inner
		.slice(at)
		.replace(/^\s*\n/, "")}`;

	return html.replace(head[0], () => `<head>${ordered}</head>`);
}

export default defineConfig({
	title: "KatanaKit",
	description:
		"A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.",
	base: "/",
	cleanUrls: true,
	// Move the per-page hash map/site data (~100 KB inlined on every page) to a
	// shared chunk: smaller pages to deploy, one extra cached request.
	metaChunk: true,
	lastUpdated: true,
	sitemap: { hostname: "https://docs.senseikatana.com" },
	// Only tags the SEO helper cannot generate live here; the rest is per-page
	// (transformHead) and reordered to the top of <head> (transformHtml).
	head: [["meta", { name: "theme-color", content: "#0a0a0a" }]],
	transformHead({ pageData, title }) {
		const { tags } = useSeoMeta({
			title,
			description: pageData.description || docsSiteConfig.description,
			keywords: DOCS_KEYWORDS,
			viewport: "width=device-width, initial-scale=1.0",
			canonical: pageUrl(pageData.relativePath),
			ogUrl: pageUrl(pageData.relativePath),
			ogType: "website",
		});

		const head: HeadConfig[] = [];
		for (const node of tags) {
			// VitePress already owns <title>; everything else is injected here.
			if (node.tag === "title") continue;
			head.push([node.tag, node.attrs ?? {}, node.text ?? ""]);
		}
		// useSeoMeta covers HTML + Open Graph only; Twitter cards layer on top.
		head.push(["meta", { name: "twitter:card", content: "summary_large_image" }]);
		head.push(["meta", { name: "twitter:image", content: DOCS_OG_IMAGE }]);

		return head;
	},
	transformHtml(code, id) {
		if (!id.endsWith(".html")) return code;
		return reorderHead(code);
	},
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@katanakit/ui/styles.css": fileURLToPath(
					new URL("../../packages/ui/dist/styles.css", import.meta.url),
				),
				"@katanakit/ui": fileURLToPath(new URL("../../packages/ui/dist/index.js", import.meta.url)),
			},
		},
		build: {
			// The largest chunk is the lazily-loaded local search index (full-text of
			// ~780 pages, API reference included); the limit only keeps the build
			// output warning-free.
			chunkSizeWarningLimit: 2048,
		},
	},
	themeConfig: {
		nav: [
			{ text: "Guides", link: "/guides/getting-started", activeMatch: "^/guides/" },
			{ text: "UI Kit", link: "/ui-kit/", activeMatch: "^/ui-kit/" },
			{ text: "Releases", link: "/changelog" },
			{ text: "API Reference", link: "/api/" },
		],
		// Every top-level entry is a collapsed group, so navigation always shows
		// one section open (the one holding the current page) and the rest
		// folded — the segmented sidebar pattern borrowed from bluuweb.dev.
		sidebar: [
			{
				text: "Introduction",
				collapsed: true,
				items: [
					{ text: "Getting Started", link: "/guides/getting-started" },
					{ text: "Error Handling", link: "/guides/errors" },
					{ text: "Architecture", link: "/guides/architecture" },
					{ text: "Roadmap", link: "/guides/roadmap" },
				],
			},
			{
				text: "Core Services",
				collapsed: true,
				items: [
					{ text: "Overview", link: "/guides/services/" },
					{ text: "HTTP Client", link: "/guides/services/http-client" },
					{ text: "Logger", link: "/guides/services/logger" },
					{ text: "Storage", link: "/guides/services/storage" },
					{ text: "DOM", link: "/guides/services/dom" },
					{ text: "Reactive", link: "/guides/services/reactive" },
					{ text: "Formatter", link: "/guides/services/formatter" },
					{ text: "Converter", link: "/guides/services/converter" },
					{ text: "Error Helpers", link: "/guides/services/error-helpers" },
					{ text: "Generator", link: "/guides/services/generator" },
					{ text: "Dates", link: "/guides/services/dates" },
					{ text: "Geometry", link: "/guides/services/geometry" },
					{ text: "Timing", link: "/guides/services/timing" },
					{ text: "Viewport", link: "/guides/services/viewport" },
					{ text: "Observer", link: "/guides/services/observer" },
					{ text: "Worker", link: "/guides/services/worker" },
				],
			},
			{
				text: "Platform Services",
				collapsed: true,
				items: [
					{ text: "Theme", link: "/guides/services/theme" },
					{ text: "Astro Adapter", link: "/guides/services/astro-adapter" },
					{ text: "RSS", link: "/guides/services/rss" },
					{ text: "SEO", link: "/guides/services/seo" },
				],
			},
			{
				text: "Integrations",
				collapsed: true,
				items: [
					{ text: "Nuxt Adapter", link: "/guides/services/nuxt-adapter" },
					{ text: "Vue Adapter", link: "/guides/services/vue-adapter" },
					{ text: "Express Server", link: "/guides/services/express-server" },
					{ text: "NestJS Adapter", link: "/guides/nestjs" },
				],
			},
			{
				text: "HTTP & REST",
				collapsed: true,
				items: [
					{ text: "Query Client", link: "/guides/query-client" },
					{ text: "Framework Adapters", link: "/guides/framework-adapters" },
					{ text: "Better Auth", link: "/guides/better-auth" },
				],
			},
			{
				text: "Runtime & Filesystem",
				collapsed: true,
				items: [
					{ text: "Filesystem", link: "/guides/filesystem" },
					{ text: "Bun Adapter", link: "/guides/bun-adapter" },
					{ text: "Faker", link: "/guides/faker" },
				],
			},
			{
				text: "Browser & DOM",
				collapsed: true,
				items: [
					{ text: "Watch", link: "/guides/watch" },
					{ text: "PhotoSwipe", link: "/guides/photoswipe" },
				],
			},
			{
				text: "Upgrades",
				collapsed: true,
				items: [
					{ text: "Overview", link: "/guides/upgrade-to/" },
					{ text: "Upgrade to v6", link: "/guides/upgrade-to/v6" },
					{ text: "Upgrade to v5", link: "/guides/upgrade-to/v5" },
					{ text: "Upgrade to v4", link: "/guides/upgrade-to/v4" },
					{ text: "Upgrade to v3", link: "/guides/upgrade-to/v3" },
					{ text: "Upgrade to v2", link: "/guides/upgrade-to/v2" },
				],
			},
			{
				text: "UI Kit",
				collapsed: true,
				items: [
					{ text: "Overview", link: "/ui-kit/" },
					{
						text: "Components",
						collapsed: true,
						items: [
							{ text: "Button", link: "/ui-kit/components/button" },
							{ text: "Input", link: "/ui-kit/components/input" },
							{ text: "Card", link: "/ui-kit/components/card" },
							{ text: "Badge", link: "/ui-kit/components/badge" },
							{ text: "Alert", link: "/ui-kit/components/alert" },
						],
					},
					{ text: "Architecture", link: "/ui-kit/architecture" },
					{ text: "Inventory", link: "/ui-kit/inventory" },
					{ text: "LLM Files", link: "/ui-kit/llm-files" },
					{ text: "HyperUI", link: "/ui-kit/hyperui" },
					{ text: "Roadmap", link: "/ui-kit/roadmap" },
				],
			},
			{
				text: "SCSS Framework",
				collapsed: true,
				items: [
					{ text: "Overview", link: "/ui-kit/css/" },
					{ text: "Getting Started", link: "/ui-kit/css/getting-started" },
					{
						text: "Foundations",
						collapsed: true,
						items: [
							{ text: "Design Tokens", link: "/ui-kit/css/core/tokens" },
							{ text: "Colors", link: "/ui-kit/css/core/colors" },
							{ text: "Breakpoints", link: "/ui-kit/css/core/breakpoints" },
							{ text: "Dark Mode", link: "/ui-kit/css/core/dark-mode" },
							{ text: "@apply", link: "/ui-kit/css/core/apply" },
						],
					},
					{
						text: "Mixins",
						collapsed: true,
						items: [
							{ text: "Grid", link: "/ui-kit/css/mixins/grid" },
							{ text: "Flexbox", link: "/ui-kit/css/mixins/flex" },
						],
					},
					{
						text: "Utilities",
						collapsed: true,
						items: [
							{ text: "Padding", link: "/ui-kit/css/utilities/padding" },
							{ text: "Margin", link: "/ui-kit/css/utilities/margin" },
							{ text: "Gap", link: "/ui-kit/css/utilities/gap" },
							{ text: "Display", link: "/ui-kit/css/utilities/display" },
							{ text: "Typography", link: "/ui-kit/css/utilities/typography" },
							{ text: "Effects", link: "/ui-kit/css/utilities/effects" },
							{ text: "Aspect Ratio", link: "/ui-kit/css/utilities/aspect-ratio" },
							{ text: "Object Fit & Position", link: "/ui-kit/css/utilities/object" },
							{ text: "Cursor", link: "/ui-kit/css/utilities/cursor" },
							{ text: "Visibility", link: "/ui-kit/css/utilities/visibility" },
							{ text: "Text Transform", link: "/ui-kit/css/utilities/text-transform" },
							{ text: "Text Decoration & Overflow", link: "/ui-kit/css/utilities/text-decoration" },
							{ text: "Line Height & Letter Spacing", link: "/ui-kit/css/utilities/line-height" },
							{ text: "Font Family", link: "/ui-kit/css/utilities/font-family" },
							{ text: "List Style", link: "/ui-kit/css/utilities/list-style" },
							{ text: "Interactivity", link: "/ui-kit/css/utilities/interactivity" },
							{ text: "Border Style", link: "/ui-kit/css/utilities/border-style" },
							{ text: "Float, Clear, Isolation & Box Sizing", link: "/ui-kit/css/utilities/float" },
							{ text: "Tables", link: "/ui-kit/css/utilities/tables" },
							{ text: "Grid Classes", link: "/ui-kit/css/utilities/grid-classes" },
							{ text: "Flex Classes", link: "/ui-kit/css/utilities/flex-classes" },
							{ text: "Container", link: "/ui-kit/css/utilities/container" },
							{ text: "Position Values", link: "/ui-kit/css/utilities/position-values" },
							{ text: "Overflow Direction", link: "/ui-kit/css/utilities/overflow-direction" },
							{ text: "Extended Colors", link: "/ui-kit/css/utilities/colors-extended" },
						],
					},
					{
						text: "Reference",
						collapsed: true,
						items: [
							{ text: "Functions", link: "/ui-kit/css/reference/functions" },
							{ text: "API Reference", link: "/ui-kit/css/reference/api-reference" },
							{ text: "Architecture", link: "/ui-kit/css/reference/architecture" },
						],
					},
				],
			},
			{
				text: "Releases",
				collapsed: true,
				items: releaseSidebarItems(),
			},
			{
				// VitePress server-renders the sidebar into **every** page, so the
				// API section stays compact (index anchors) instead of the full
				// TypeDoc tree (783 links ≈ 270 KB per page, 223 MB of the build).
				// The API index still lists every symbol with its description,
				// cross-links are intact and local search indexes all API pages.
				text: "API Reference",
				collapsed: true,
				items: [
					{ text: "Overview", link: "/api/" },
					{ text: "Classes", link: "/api/#classes" },
					{ text: "Interfaces", link: "/api/#interfaces" },
					{ text: "Type Aliases", link: "/api/#type-aliases" },
					{ text: "Variables", link: "/api/#variables" },
					{ text: "Functions", link: "/api/#functions" },
				],
			},
		],
		search: { provider: "local" },
		socialLinks: [{ icon: "github", link: "https://github.com/senseikatana/katanakit-js" }],
		editLink: {
			pattern: "https://github.com/senseikatana/katanakit-js/edit/dev/docs/:path",
			text: "Edit this page on GitHub",
		},
		footer: {
			message: "Released under the MIT License.",
			copyright: "Copyright © Sergio Jurado",
		},
	},
});
