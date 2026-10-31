import type { z } from "zod";

import type { SiteConfig } from "@/config/site.config.js";
import { RssConfigSchema, RssItemSchema } from "@/schemas/rss.schema.js";

import type { SafeResult } from "../core/http.js";

/** A single item in an RSS feed. */
export type RssItem = z.infer<typeof RssItemSchema>;

/** Configuration for generating an RSS feed. */
export type RssConfig = z.infer<typeof RssConfigSchema>;

/** Result of an RSS generation attempt. */
export type RssResult = SafeResult<string, { message: string; details?: unknown }>;

/** Contract of the RSS facade. */
export interface IRssService {
	/** Generates the RSS XML string from a config. */
	useGenerateRss(config: RssConfig): RssResult;
	/** Generates an HTML `<link>` tag for the RSS feed. */
	useRssLinkTag(config: Pick<RssConfig, "title" | "xmlPath">): string;
	/** Generates an Astro GET endpoint handler for the RSS feed. */
	useCreateRssEndpoint(
		config: Omit<RssConfig, "items"> & { items: RssItem[] | (() => RssItem[] | Promise<RssItem[]>) },
	): (context: { site?: URL | string }) => Promise<Response>;
	/** Convenience: creates an RSS endpoint from a SiteConfig. */
	useCreateRssEndpointFromConfig(
		siteConfig: SiteConfig,
		items: RssItem[] | (() => RssItem[] | Promise<RssItem[]>),
	): (context: { site?: URL | string }) => Promise<Response>;
}
