import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SIGNALS_FILE = join(HERE, "src", "data", "signals.json");

/** Build-time signals written by `scripts/docs-prepare.mjs` (may be absent). */
function readSignals() {
	try {
		return JSON.parse(readFileSync(SIGNALS_FILE, "utf8"));
	} catch {
		return {};
	}
}

const signals = readSignals();
const newPages = new Set((signals.newPages ?? []).map((route) => route.replace(/\/$/, "") || "/"));

/** VitePress-style item -> Starlight sidebar entry (labels, slugs, badges). */
function toItem({ text, link, items }) {
	const node = { label: text };

	if (items) {
		node.collapsed = true;
		node.items = items.map(toItem);
		return node;
	}

	// Anchor or external links keep the raw href.
	if (link?.startsWith("http") || link?.includes("#")) {
		node.link = link;
		return node;
	}

	const slug = link.replace(/^\//, "").replace(/\/$/, "");
	node.slug = slug || "index";

	const route = `/${slug}`.replace(/\/$/, "") || "/";
	if (newPages.has(route) || newPages.has(`${route}/`)) {
		node.badge = { text: "new", variant: "tip" };
	}

	return node;
}

/** Releases section: changelog + one explicit anchor per major (from signals). */
function releaseItems() {
	const versions = signals.versions;
	if (!versions) return [{ text: "Changelog", link: "/changelog" }];

	return [
		{ text: "Changelog", link: "/changelog" },
		{ text: `v${versions.latest.version} (latest)`, link: `/changelog${versions.latest.anchor}` },
		...versions.previous.map((release) => ({
			text: `v${release.major}.x`,
			link: `/changelog${release.anchor}`,
		})),
	];
}

const sections = [
	{
		text: "Introduction",
		items: [
			{ text: "Getting Started", link: "/guides/getting-started" },
			{ text: "Error Handling", link: "/guides/errors" },
			{ text: "Architecture", link: "/guides/architecture" },
			{ text: "Roadmap", link: "/guides/roadmap" },
		],
	},
	{
		text: "Core Services",
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
		items: [
			{ text: "Theme", link: "/guides/services/theme" },
			{ text: "Astro Adapter", link: "/guides/services/astro-adapter" },
			{ text: "RSS", link: "/guides/services/rss" },
			{ text: "SEO", link: "/guides/services/seo" },
		],
	},
	{
		text: "Integrations",
		items: [
			{ text: "Nuxt Adapter", link: "/guides/services/nuxt-adapter" },
			{ text: "Vue Adapter", link: "/guides/services/vue-adapter" },
			{ text: "Express Server", link: "/guides/services/express-server" },
			{ text: "NestJS Adapter", link: "/guides/nestjs" },
			{ text: "Hono Adapter", link: "/guides/hono" },
		],
	},
	{
		text: "HTTP & REST",
		items: [
			{ text: "Query Client", link: "/guides/query-client" },
			{ text: "Framework Adapters", link: "/guides/framework-adapters" },
			{ text: "Better Auth", link: "/guides/better-auth" },
		],
	},
	{
		text: "Runtime & Filesystem",
		items: [
			{ text: "Filesystem", link: "/guides/filesystem" },
			{ text: "Bun Adapter", link: "/guides/bun-adapter" },
			{ text: "Faker", link: "/guides/faker" },
		],
	},
	{
		text: "Browser & DOM",
		items: [
			{ text: "Watch", link: "/guides/watch" },
			{ text: "PhotoSwipe", link: "/guides/photoswipe" },
		],
	},
	{
		text: "Upgrades",
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
		items: [
			{ text: "Overview", link: "/ui-kit/" },
			{
				text: "Components",
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
		items: [
			{ text: "Overview", link: "/ui-kit/css/" },
			{ text: "Getting Started", link: "/ui-kit/css/getting-started" },
			{
				text: "Foundations",
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
				items: [
					{ text: "Grid", link: "/ui-kit/css/mixins/grid" },
					{ text: "Flexbox", link: "/ui-kit/css/mixins/flex" },
				],
			},
			{
				text: "Utilities",
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
		items: releaseItems(),
	},
	{
		text: "API Reference",
		items: [
			{ text: "Overview", link: "/api/" },
			{ text: "Classes", link: "/api/#classes" },
			{ text: "Interfaces", link: "/api/#interfaces" },
			{ text: "Type Aliases", link: "/api/#type-aliases" },
			{ text: "Variables", link: "/api/#variables" },
			{ text: "Functions", link: "/api/#functions" },
		],
	},
];

/**
 * Sidebar for the Starlight integration: every top-level section is a
 * collapsed group, so navigation always shows the section holding the current
 * page (Starlight opens groups containing the active page) and the rest folded.
 */
export function buildSidebar() {
	return sections.map(({ text, items }) => ({
		label: text,
		collapsed: true,
		items: items.map(toItem),
	}));
}
