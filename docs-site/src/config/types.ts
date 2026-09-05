/** Shared contracts for the docs-site configuration. */

/** A versioned documentation snapshot. */
export interface VersionEntry {
	/** URL slug for this version (e.g. "2.3.0"). */
	readonly slug: string;
	/** Display label in the version selector (e.g. "v2.3.0"). */
	readonly label: string;
}

/** Configuration for the documentation site. */
export interface DocsSiteConfig {
	/** Canonical site URL (no trailing slash). */
	readonly site: string;
	/** Base path for GitHub Pages (e.g. "/katanakit-js"). */
	readonly base: string;
	/** Site title shown in the header. */
	readonly title: string;
	/** Site description for meta tags. */
	readonly description: string;
	/** GitHub repository URL. */
	readonly repoUrl: string;
	/** Branch used for edit links. */
	readonly editBranch: string;
}

/** Configuration for a single Starlight plugin. */
export interface PluginConfig {
	/** TypeDoc entry points relative to the docs-site root. */
	readonly entryPoints: readonly string[];
	/** Path to tsconfig.json relative to the docs-site root. */
	readonly tsconfig: string;
	/** Output directory for generated API docs (relative to content/docs). */
	readonly output: string;
	/** Sidebar label for the API Reference section. */
	readonly sidebarLabel: string;
}

/** Sidebar link item. */
export interface SidebarLink {
	readonly label: string;
	readonly link: string;
}

/** Sidebar group with nested items. */
export interface SidebarGroup {
	readonly label: string;
	readonly items: readonly SidebarLink[];
}

/** Social link for the header. */
export interface SocialLink {
	readonly icon: string;
	readonly label: string;
	readonly href: string;
}

/** Tailwind theme color scale (50–950). */
export interface ColorScale {
	readonly 50: string;
	readonly 100: string;
	readonly 200: string;
	readonly 300: string;
	readonly 400: string;
	readonly 500: string;
	readonly 600: string;
	readonly 700: string;
	readonly 800: string;
	readonly 900: string;
	readonly 950: string;
}

/** Tailwind theme configuration. */
export interface TailwindTheme {
	readonly accent: ColorScale;
	readonly gray: ColorScale;
	readonly sans: string;
	readonly mono: string;
}
