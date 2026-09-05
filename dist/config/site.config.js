/**
 * Site-wide configuration for KatanaKit-powered Astro projects.
 *
 * Import this in your layouts, RSS endpoint, and SEO components
 * to keep everything consistent.
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import { siteConfig } from "./src/config/site.config.js";
 * export default defineConfig({ site: siteConfig.site });
 * ```
 */
/**
 * Default site configuration. Override in your project.
 *
 * @example
 * ```ts
 * // src/config/site.config.ts
 * import { type SiteConfig } from "katanakit";
 *
 * export const siteConfig: SiteConfig = {
 *   site: "https://myblog.com",
 *   title: "My Blog",
 *   description: "A blog about TypeScript",
 *   lang: "en",
 *   author: "John Doe",
 *   ogImage: "/og-default.png",
 *   twitter: "johndoe",
 *   rss: { enabled: true, path: "/rss.xml", limit: 20 },
 *   seo: { noindex: false, canonical: true, openGraph: true, twitterCard: true, jsonLd: true },
 *   nav: [
 *     { label: "Home", href: "/" },
 *     { label: "Blog", href: "/blog" },
 *     { label: "GitHub", href: "https://github.com/...", external: true },
 *   ],
 * };
 * ```
 */
export const siteConfig = {
    site: "https://example.com",
    title: "My Site",
    description: "A site built with KatanaKit and Astro",
    lang: "en",
    author: "Author",
    rss: {
        enabled: true,
        path: "/rss.xml",
        limit: 20,
    },
    seo: {
        noindex: false,
        canonical: true,
        openGraph: true,
        twitterCard: true,
        jsonLd: true,
    },
};
//# sourceMappingURL=site.config.js.map