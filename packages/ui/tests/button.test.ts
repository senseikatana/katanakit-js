// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";

import { useButton, useButtonClass } from "../src/index";

describe("useButtonClass", () => {
	it("defaults to primary/md", () => {
		expect(useButtonClass()).toBe("kk-btn kk-btn--primary kk-btn--md");
	});

	it("composes variant, size and loading", () => {
		expect(useButtonClass({ variant: "danger", size: "sm", loading: true })).toBe(
			"kk-btn kk-btn--danger kk-btn--sm kk-btn--loading",
		);
	});
});

describe("useButton", () => {
	it("creates a button with label and classes", () => {
		const button = useButton({ label: "Save", variant: "secondary" });

		expect(button.tagName).toBe("BUTTON");
		expect(button.textContent).toBe("Save");
		expect(button.type).toBe("button");
		expect(button.classList.contains("kk-btn--secondary")).toBe(true);
	});

	it("disables and marks busy while loading", () => {
		const button = useButton({ label: "Saving", loading: true });

		expect(button.disabled).toBe(true);
		expect(button.getAttribute("aria-busy")).toBe("true");
	});

	it("wires the click handler", () => {
		const onClick = vi.fn();
		const button = useButton({ label: "Go", onClick });

		button.click();

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
