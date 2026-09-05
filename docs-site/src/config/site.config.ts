import type { DocsSiteConfig } from "./types.js";

/** Singleton site configuration. Mirrors the main project's siteConfig pattern. */
class SiteConfigService {
	private static instance: SiteConfigService | null = null;

	private constructor(public readonly config: DocsSiteConfig) {}

	static getInstance(): SiteConfigService {
		if (!SiteConfigService.instance) {
			SiteConfigService.instance = new SiteConfigService({
				site: "https://senseikatana.github.io",
				base: "/katanakit-js",
				title: "KatanaKit",
				description:
					"A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.",
				repoUrl: "https://github.com/senseikatana/katanakit-js",
				editBranch: "dev",
			});
		}
		return SiteConfigService.instance;
	}
}

export const siteConfig = SiteConfigService.getInstance().config;
