// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";

import { useInput, useInputClass } from "../src/index";

describe("useInputClass", () => {
	it("marks invalid fields", () => {
		expect(useInputClass()).toBe("kk-input");
		expect(useInputClass({ error: "Required" })).toBe("kk-input kk-input--invalid");
	});
});

describe("useInput", () => {
	it("wires the label to the input", () => {
		const { root, input } = useInput({ label: "Email", name: "email" });

		const label = root.querySelector("label");

		expect(root.className).toBe("kk-field");
		expect(label?.htmlFor).toBe(input.id);
		expect(input.id).toBe("kk-email");
		expect(input.type).toBe("text");
	});

	it("exposes error state through aria attributes", () => {
		const { root, input } = useInput({ label: "Email", error: "Required" });

		const error = root.querySelector(".kk-field__error");

		expect(input.getAttribute("aria-invalid")).toBe("true");
		expect(input.getAttribute("aria-describedby")).toBe(error?.id);
		expect(input.classList.contains("kk-input--invalid")).toBe(true);
	});

	it("links help text without marking the field invalid", () => {
		const { root, input } = useInput({ label: "Email", help: "Work address" });

		const help = root.querySelector(".kk-field__help");

		expect(input.hasAttribute("aria-invalid")).toBe(false);
		expect(input.getAttribute("aria-describedby")).toBe(help?.id);
	});

	it("forwards input events and native state", () => {
		const onInput = vi.fn();
		const { input } = useInput({ label: "Name", required: true, disabled: true, onInput });

		input.value = "Ada";
		input.dispatchEvent(new Event("input"));

		expect(onInput).toHaveBeenCalledWith("Ada");
		expect(input.required).toBe(true);
		expect(input.disabled).toBe(true);
	});
});
