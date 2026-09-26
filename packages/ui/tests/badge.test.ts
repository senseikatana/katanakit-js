// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { useBadge, useBadgeClass } from "../src/index";

describe("useBadgeClass", () => {
	it("defaults to neutral", () => {
		expect(useBadgeClass()).toBe("kk-badge kk-badge--neutral");
	});

	it("accepts semantic variants", () => {
		expect(useBadgeClass({ variant: "success" })).toBe("kk-badge kk-badge--success");
	});
});

describe("useBadge", () => {
	it("creates a label pill", () => {
		const badge = useBadge({ label: "Paid", variant: "success" });

		expect(badge.tagName).toBe("SPAN");
		expect(badge.textContent).toBe("Paid");
		expect(badge.classList.contains("kk-badge--success")).toBe(true);
	});
});
