import type { SiteConfig } from "./site.config.js";
/**
 * SEO meta tag configuration for a single page.
 */
export interface SeoMeta {
    /** Page title (will be suffixed with site title). */
    title: string;
    /** Page description (falls back to site description). */
    description?: string;
    /** Canonical URL (absolute). If omitted, derived from `url`. */
    canonical?: string;
    /** Page URL (absolute, e.g. "https://example.com/blog/post/"). */
    url?: string;
    /** OG image URL (absolute). Falls back to site config. */
    ogImage?: string;
    /** Content type: "website" | "article" | "profile" (default: "website"). */
    ogType?: "website" | "article" | "profile";
    /** Article published date (ISO string, for og:type=article). */
    publishedTime?: string;
    /** Article modified date (ISO string, for og:type=article). */
    modifiedTime?: string;
    /** Article author (for og:type=article). */
    author?: string;
    /** Article tags (for og:type=article). */
    tags?: string[];
    /** Whether to add noindex (default: false). */
    noindex?: boolean;
}
/**
 * Generates all `<head>` meta tags for SEO, Open Graph, Twitter Card,
 * canonical URL, and JSON-LD structured data.
 *
 * @param config - Site-wide configuration.
 * @param meta - Page-specific meta.
 * @returns HTML string of meta tags to inject in `<head>`.
 *
 * @example
 * ```astro
 * ---
 * import { siteConfig } from "@/config/site.config";
 * import { useGenerateMetaTags } from "@/config/seo.service";
 *
 * const metaTags = useGenerateMetaTags(siteConfig, {
 *   title: "My Blog Post",
 *   description: "A great post about TypeScript",
 *   url: "https://example.com/blog/my-post/",
 *   ogType: "article",
 *   publishedTime: "2024-01-15T00:00:00Z",
 * });
 * ---
 * <head>
 *   <Fragment set:html={metaTags} />
 * </head>
 * ```
 */
export declare function useGenerateMetaTags(config: SiteConfig, meta: SeoMeta): string;
/**
 * Generates a `<title>` tag string.
 */
export declare function useTitle(config: SiteConfig, pageTitle?: string): string;
/**
 * Generates the RSS `<link>` tag for the `<head>`.
 */
export declare function useRssHeadLink(config: SiteConfig): string;
/**
 * Generates all default `<head>` meta tags for a page (title, description,
 * canonical, OG, Twitter, JSON-LD, RSS link).
 *
 * Convenience wrapper around `useGenerateMetaTags` + `useRssHeadLink`.
 */
export declare function useHeadTags(config: SiteConfig, meta: SeoMeta): string;
//# sourceMappingURL=seo.service.d.ts.map