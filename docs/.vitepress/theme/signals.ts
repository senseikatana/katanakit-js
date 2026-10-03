/**
 * Build-time signals written by `scripts/docs-prepare.mjs`:
 * `version` (package.json), `stars` (GitHub repo) and `newPages`
 * (docs touched in the last release window).
 *
 * The glob keeps the site buildable when the file is absent (fresh clone
 * before `docs:prepare`): everything degrades to "no data".
 */
export type ChangelogSection = { title: string; items: string[] };
export type ChangelogEntry = { version: string; date: string; sections: ChangelogSection[] };

export type SiteSignals = {
	version?: string;
	stars?: number | null;
	newPages?: string[];
	changelog?: ChangelogEntry | null;
};

const modules = import.meta.glob<SiteSignals>("./signals.json", {
	eager: true,
	import: "default",
});

export function siteSignals(): SiteSignals {
	for (const value of Object.values(modules)) return value ?? {};
	return {};
}
