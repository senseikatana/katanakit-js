// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { useCard, useCardClass } from "../src/index";

describe("useCardClass", () => {
	it("toggles the elevated modifier", () => {
		expect(useCardClass()).toBe("kk-card");
		expect(useCardClass({ elevated: true })).toBe("kk-card kk-card--elevated");
	});
});

describe("useCard", () => {
	it("renders header, body children and footer", () => {
		const card = useCard({ title: "Revenue", children: ["$12,400"], footer: "Updated now" });

		expect(card.tagName).toBe("ARTICLE");
		expect(card.querySelector(".kk-card__title")?.textContent).toBe("Revenue");
		expect(card.querySelector(".kk-card__body")?.textContent).toBe("$12,400");
		expect(card.querySelector(".kk-card__footer")?.textContent).toBe("Updated now");
	});

	it("accepts nodes as children", () => {
		const child = document.createElement("span");
		child.textContent = "Node child";

		const card = useCard({ children: [child] });

		expect(card.querySelector(".kk-card__body span")?.textContent).toBe("Node child");
	});
});
