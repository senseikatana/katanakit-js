import type { SidebarGroup } from "./types.js";

/** Guides sidebar group. */
const guidesGroup: SidebarGroup = {
	label: "Guides",
	items: [
		{ label: "Getting Started", link: "/guides/getting-started/" },
		{ label: "Architecture", link: "/guides/architecture/" },
		{ label: "Roadmap", link: "/guides/roadmap/" },
	],
};

/** Changelog sidebar link. */
const changelogLink: SidebarGroup = {
	label: "Changelog",
	items: [{ label: "Changelog", link: "/changelog/" }],
};

export { guidesGroup, changelogLink };
