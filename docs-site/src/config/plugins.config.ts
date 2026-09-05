import type { StarlightPlugin } from "@astrojs/starlight/types";
import starlightTypeDoc, {
	typeDocSidebarGroup,
} from "starlight-typedoc";
import starlightVersions from "starlight-versions";

import type { PluginConfig, VersionEntry } from "./types.js";

/** Default TypeDoc plugin configuration. */
const DEFAULT_TYPEDOC_CONFIG: PluginConfig = {
	entryPoints: ["../src/index.ts"],
	tsconfig: "../tsconfig.json",
	output: "api",
	sidebarLabel: "API Reference",
};

/** Factory for creating Starlight plugins. */
class PluginFactory {
	/**
	 * Creates the TypeDoc plugin that auto-generates API Reference
	 * from the main project's TypeScript source.
	 */
	static createTypeDocPlugin(config: PluginConfig = DEFAULT_TYPEDOC_CONFIG): StarlightPlugin {
		return starlightTypeDoc({
			entryPoints: [...config.entryPoints],
			tsconfig: config.tsconfig,
			output: config.output,
			sidebar: { label: config.sidebarLabel, collapsed: false },
			watch: false,
		});
	}

	/**
	 * Creates the version selector plugin from archived version entries.
	 * Returns an empty array when no versions exist (starlight-versions
	 * errors on empty arrays).
	 */
	static createVersionsPlugin(versions: readonly VersionEntry[]): StarlightPlugin[] {
		if (versions.length === 0) return [];

		return [
			starlightVersions({
				versions: versions.map((v) => ({ slug: v.slug, label: v.label })),
				current: { label: "Latest" },
			}),
		];
	}
}

export { PluginFactory };
