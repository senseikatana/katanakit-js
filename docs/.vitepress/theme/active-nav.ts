import type { Router } from "vitepress";

/**
 * Sidebar and outline "you are here" tracking, built on the two mechanisms
 * the navigation needs:
 *
 *   1. the router (`onAfterRouteChange`) marks the sidebar link of the page
 *      currently open and the section that contains it, so the active link
 *      survives client-side navigation without a full reload;
 *   2. an `IntersectionObserver` over the content headings follows the scroll
 *      position and marks the outline link of the section "where you are
 *      standing", which keeps the right-hand outline in sync while reading.
 *
 * VitePress already ships `is-active` / `has-active` classes for both; this
 * module keeps them consistent and adds the scroll-driven half, so the sidebar
 * and the outline always point at the same place.
 */

/** `/guides/x.html`, `/guides/x/` and `/guides/x` all mean the same route. */
function normalizePath(path: string): string {
	return path
		.replace(/[?#].*$/, "")
		.replace(/\.html$/, "")
		.replace(/\/index$/, "/")
		.replace(/\/$/, "");
}

/**
 * Applies `is-current-page` to the sidebar link of the current route and
 * `has-current-page` to every ancestor section, so the active section stays
 * visually marked while you read a page inside it.
 */
function markCurrentPage(path: string): void {
	const current = normalizePath(path);
	for (const link of document.querySelectorAll<HTMLAnchorElement>(".VPSidebar a.link")) {
		const href = link.getAttribute("href") ?? "";
		const isCurrent = href.startsWith("/") && normalizePath(href) === current;
		link.classList.toggle("is-current-page", isCurrent);
		const item = link.closest<HTMLElement>(".VPSidebarItem");
		item?.classList.toggle("has-current-page", isCurrent);
		const section = item?.closest<HTMLElement>(".VPSidebarItem.level-0");
		if (isCurrent) section?.classList.add("has-current-page");
	}
}

/** Highlights the outline entry of the section the reader is currently in. */
function markCurrentHeading(id: string): void {
	for (const link of document.querySelectorAll<HTMLAnchorElement>(".VPDocAsideOutline .outline-link")) {
		link.classList.toggle("is-current-heading", link.getAttribute("href") === `#${id}`);
	}
}

/**
 * Scroll-spy: observes the content headings inside a 1/3 band near the top of
 * the viewport and highlights the outline link of the last heading that
 * entered it. Returns a teardown that disconnects and removes the classes.
 */
function watchHeadings(): () => void {
	const headings = [
		...document.querySelectorAll<HTMLElement>(
			".VPDoc .content h2[id], .VPDoc .content h3[id], .vp-doc h2[id], .vp-doc h3[id]",
		),
	];
	if (headings.length === 0) return () => {};

	let current = headings[0].id;
	markCurrentHeading(current);

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) current = (entry.target as HTMLElement).id;
			}
			markCurrentHeading(current);
		},
		// Keep a band between the top of the viewport and a third of the way
		// down: the heading "standing" closest under the navbar wins.
		{ rootMargin: "-80px 0px -66% 0px", threshold: 0 },
	);

	for (const heading of headings) observer.observe(heading);

	return () => {
		observer.disconnect();
		for (const link of document.querySelectorAll(".VPDocAsideOutline .outline-link")) {
			link.classList.remove("is-current-heading");
		}
	};
}

/**
 * Wires router + scroll tracking for the current page and re-syncs after every
 * client-side navigation (the sidebar and the content are swapped by VitePress
 * on route change, so the observer has to be rebuilt).
 */
export function installActiveNav(router: Router): void {
	const sync = (path: string) => {
		markCurrentPage(path);
		watchHeadings();
	};

	sync(router.route.path);

	// The sidebar swaps right after `onAfterRouteChange` resolves; wait a tick
	// so the new items exist before they are marked.
	router.onAfterRouteChange = async (to: string) => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		sync(to);
	};
}