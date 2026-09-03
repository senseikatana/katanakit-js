import type { IRssService, RssConfig, RssItem, RssResult } from "../../types";

/**
 * Escapes special XML characters in a string.
 */
function escapeXml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * Formats a date as RFC-822 (required by RSS 2.0).
 */
function toRfc822(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toUTCString();
}

/**
 * Builds the RSS 2.0 XML string from a config object.
 * Pure function — no I/O, no dependencies.
 */
function buildRssXml(config: RssConfig): string {
	const {
		title,
		description,
		site,
		items,
		language = "en",
		customData,
		xslUrl,
		lastBuildDate = true,
	} = config;

	const siteUrl = site.endsWith("/") ? site.slice(0, -1) : site;

	const xslProcessing = xslUrl
		? `<?xml-stylesheet type="text/xsl" href="${escapeXml(xslUrl)}" media="screen"?>\n`
		: "";

	const itemsXml = items
		.map((item) => {
			const link = item.link.startsWith("http") ? item.link : `${siteUrl}${item.link}`;
			const categories = (item.categories ?? [])
				.map((cat) => `      <category>${escapeXml(cat)}</category>`)
				.join("\n");

			return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${toRfc822(item.pubDate)}</pubDate>${item.description ? `\n      <description>${escapeXml(item.description)}</description>` : ""}${item.content ? `\n      <content:encoded><![CDATA[${item.content}]]></content:encoded>` : ""}${item.author ? `\n      <author>${escapeXml(item.author)}</author>` : ""}${categories ? `\n${categories}` : ""}${item.customData ? `\n      ${item.customData}` : ""}
    </item>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
${xslProcessing}<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>${escapeXml(language)}</language>
    <atom:link href="${escapeXml(siteUrl)}${config.xmlPath ?? "/rss.xml"}" rel="self" type="application/rss+xml" />${lastBuildDate ? `\n    <lastBuildDate>${toRfc822(new Date())}</lastBuildDate>` : ""}${customData ? `\n    ${customData}` : ""}
${itemsXml}
  </channel>
</rss>`;
}

/**
 * RSS service (Singleton + Facade). Generates RSS 2.0 feeds for Astro projects.
 * Pure implementation — no external dependencies required.
 *
 * For projects using `@astrojs/rss`, use `useCreateRssEndpoint` which returns
 * an Astro-compatible GET handler. For lighter setups, use `useGenerateRss`
 * to get the raw XML string.
 */
export default class RssService implements IRssService {
	private static instance: RssService;

	private constructor() {}

	public static getInstance(): RssService {
		if (!RssService.instance) {
			RssService.instance = new RssService();
		}
		return RssService.instance;
	}

	/**
	 * Generates the RSS XML string from a config.
	 * Returns a Safe Result (no throwing).
	 *
	 * @example
	 * ```ts
	 * const { useGenerateRss } = RssService.getInstance();
	 * const result = useGenerateRss({
	 *   title: "My Blog",
	 *   description: "Posts about TypeScript",
	 *   site: "https://example.com",
	 *   items: [{ title: "Hello", pubDate: new Date(), link: "/blog/hello/" }],
	 * });
	 * if (result.ok) console.log(result.data); // XML string
	 * ```
	 */
	public useGenerateRss = (config: RssConfig): RssResult => {
		try {
			if (!config.title || !config.site) {
				return {
					data: null,
					error: { message: "RSS config requires 'title' and 'site'." },
					ok: false,
				};
			}

			const xml = buildRssXml(config);
			return { data: xml, error: null, ok: true };
		} catch (err: unknown) {
			return {
				data: null,
				error: {
					message: "Failed to generate RSS feed.",
					details: err instanceof Error ? err.message : String(err),
				},
				ok: false,
			};
		}
	};

	/**
	 * Generates an HTML `<link>` tag for the RSS feed.
	 * Paste this into your Astro layout's `<head>`.
	 *
	 * @example
	 * ```ts
	 * const { useRssLinkTag } = RssService.getInstance();
	 * const tag = useRssLinkTag({ title: "My Blog" });
	 * // <link rel="alternate" type="application/rss+xml" title="My Blog" href="/rss.xml" />
	 * ```
	 */
	public useRssLinkTag = (config: Pick<RssConfig, "title" | "xmlPath">): string => {
		const xmlPath = config.xmlPath ?? "/rss.xml";
		return `<link rel="alternate" type="application/rss+xml" title="${escapeXml(config.title)}" href="${escapeXml(xmlPath)}" />`;
	};

	/**
	 * Creates an Astro-compatible GET endpoint handler for the RSS feed.
	 * Use this in `src/pages/rss.xml.ts` to serve the feed.
	 *
	 * `items` can be a static array or a function (sync/async) that returns items.
	 * This allows using `getCollection` or any data source.
	 *
	 * @example
	 * ```ts
	 * // src/pages/rss.xml.ts
	 * import { RssService } from "katanakit";
	 * import { getCollection } from "astro:content";
	 *
	 * const { useCreateRssEndpoint } = RssService.getInstance();
	 *
	 * export const GET = useCreateRssEndpoint({
	 *   title: "My Blog",
	 *   description: "Posts about TypeScript",
	 *   site: "https://example.com",
	 *   items: async () => {
	 *     const posts = await getCollection("blog");
	 *     return posts.map(post => ({
	 *       title: post.data.title,
	 *       pubDate: post.data.date,
	 *       link: `/blog/${post.slug}/`,
	 *       description: post.data.description,
	 *     }));
	 *   },
	 * });
	 * ```
	 */
	public useCreateRssEndpoint = (
		config: Omit<RssConfig, "items"> & {
			items: RssItem[] | (() => RssItem[] | Promise<RssItem[]>);
		},
	): ((context: { site?: URL | string }) => Promise<Response>) => {
		return async (context: { site?: URL | string }): Promise<Response> => {
			try {
				// Resolve items (static array or factory function).
				const resolvedItems = typeof config.items === "function"
					? await config.items()
					: config.items;

				// Use context.site as fallback for the site URL.
				const site = config.site ?? (context.site ? String(context.site) : "");
				if (!site) {
					return new Response(
						JSON.stringify({ error: "RSS feed requires a 'site' URL." }),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					);
				}

				const result = useGenerateRss({ ...config, site, items: resolvedItems });

				if (!result.ok) {
					return new Response(
						JSON.stringify({ error: result.error.message }),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					);
				}

				return new Response(result.data, {
					status: 200,
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
						"Cache-Control": "public, max-age=3600",
					},
				});
			} catch (err: unknown) {
				return new Response(
					JSON.stringify({
						error: err instanceof Error ? err.message : "Unknown error generating RSS.",
					}),
					{ status: 500, headers: { "Content-Type": "application/json" } },
				);
			}
		};
	};
}

// Singleton instance and destructured exports.
export const { useGenerateRss, useRssLinkTag, useCreateRssEndpoint }: RssService =
	RssService.getInstance();
