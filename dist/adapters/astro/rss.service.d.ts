import type { SiteConfig } from "../../config/site.config.js";
import type { IRssService, RssConfig, RssItem, RssResult } from "../../types/index.js";
/**
 * RSS service (Singleton + Facade). Generates RSS 2.0 feeds for Astro projects.
 * Pure implementation — no external dependencies required.
 *
 * For projects using `@astrojs/rss`, use `useCreateRssEndpoint` which returns
 * an Astro-compatible GET handler. For lighter setups, use `useGenerateRss`
 * to get the raw XML string.
 */
export default class RssService implements IRssService {
    private static instance;
    private constructor();
    static getInstance(): RssService;
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
    useGenerateRss: (config: RssConfig) => RssResult;
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
    useRssLinkTag: (config: Pick<RssConfig, "title" | "xmlPath">) => string;
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
    useCreateRssEndpoint: (config: Omit<RssConfig, "items"> & {
        items: RssItem[] | (() => RssItem[] | Promise<RssItem[]>);
    }) => ((context: {
        site?: URL | string;
    }) => Promise<Response>);
    /**
     * Convenience method: creates an RSS endpoint from a SiteConfig.
     * Reads title, description, site, and rss settings from the config.
     *
     * @example
     * ```ts
     * // src/pages/rss.xml.ts
     * import { RssService } from "katanakit";
     * import { siteConfig } from "@/config/site.config";
     * import { getCollection } from "astro:content";
     *
     * const { useCreateRssEndpointFromConfig } = RssService.getInstance();
     *
     * export const GET = useCreateRssEndpointFromConfig(siteConfig, async () => {
     *   const posts = await getCollection("blog");
     *   return posts.map(post => ({
     *     title: post.data.title,
     *     pubDate: post.data.date,
     *     link: `/blog/${post.slug}/`,
     *     description: post.data.description,
     *   }));
     * });
     * ```
     */
    useCreateRssEndpointFromConfig: (siteConfig: SiteConfig, items: RssItem[] | (() => RssItem[] | Promise<RssItem[]>)) => ((context: {
        site?: URL | string;
    }) => Promise<Response>);
}
export declare const useGenerateRss: (config: RssConfig) => RssResult, useRssLinkTag: (config: Pick<RssConfig, "title" | "xmlPath">) => string, useCreateRssEndpoint: (config: Omit<RssConfig, "items"> & {
    items: RssItem[] | (() => RssItem[] | Promise<RssItem[]>);
}) => ((context: {
    site?: URL | string;
}) => Promise<Response>), useCreateRssEndpointFromConfig: (siteConfig: SiteConfig, items: RssItem[] | (() => RssItem[] | Promise<RssItem[]>)) => ((context: {
    site?: URL | string;
}) => Promise<Response>);
//# sourceMappingURL=rss.service.d.ts.map