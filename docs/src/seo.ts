/**
 * Docs-site SEO registration (dogfooding): the same `defineSeoMetaConfig`
 * call the VitePress `config.ts` made at load time. Importing this module
 * once registers the site defaults every `useSeoMeta` call resolves against
 * (canonical origin, OG image, keywords, JSON-LD, RSS off) — without it the
 * helper falls back to the bundled demo config (`example.com`).
 */
import { defineSeoMetaConfig } from "../../src/config/seo.service";
import type { SiteConfig } from "../../src/config/site.config";

export const DOCS_ORIGIN = "https://docs.senseikatana.com";

export const DOCS_OG_IMAGE = `${DOCS_ORIGIN}/images/social-card.jpg`;
export const DOCS_KEYWORDS =
	"katanakit, typescript, hexagonal architecture, api, rest, graphql, safe results, zod, query client";

export const docsSiteConfig: SiteConfig = defineSeoMetaConfig({
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
