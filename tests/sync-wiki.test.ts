import { describe, expect, it } from "vitest";

import { rewriteMarkdownLinks, wikiPageName } from "../scripts/sync-wiki.mjs";

describe("sync-wiki", () => {
	it("maps Markdown source paths to stable Wiki page names", () => {
		expect(wikiPageName("docs/guides/getting-started.md")).toBe("Docs-Guides-Getting-started");
		expect(wikiPageName("docs/guides/services/index.md")).toBe("Docs-Guides-Services-index");
		expect(wikiPageName("docs/index.md")).toBe("Docs-index");
		expect(wikiPageName("README.md")).toBe("Home");
	});

	it("rewrites internal docs links while preserving external links and code", () => {
		const pages = new Map([
			["docs/guides/errors.md", "Docs-Guides-Errors"],
			["docs/tutorials/first-api-client.md", "Docs-Tutorials-First-api-client"],
		]);
		const markdown = [
			"[Errors](../guides/errors.md#safe-results)",
			"[Tutorial](https://docs.senseikatana.com/tutorials/first-api-client)",
			"[Reference](https://docs.senseikatana.com/api/)",
			"`[not a link](../guides/errors.md)`",
			"```md",
			"[also not a link](../guides/errors.md)",
			"```",
		].join("\n");

		expect(rewriteMarkdownLinks(markdown, "docs/tutorials/first-api-client.md", pages)).toBe(
			[
				"[Errors](Docs-Guides-Errors#safe-results)",
				"[Tutorial](Docs-Tutorials-First-api-client)",
				"[Reference](https://docs.senseikatana.com/api/)",
				"`[not a link](../guides/errors.md)`",
				"```md",
				"[also not a link](../guides/errors.md)",
				"```",
			].join("\n"),
		);
	});
});
