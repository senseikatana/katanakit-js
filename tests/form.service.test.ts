import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
	FormService,
	useFieldError,
	useFieldErrors,
	useFormData,
	useParseForm,
} from "@/core/services/form.service.js";

/** Builds `FormData` the way a browser does, including repeats. */
function formData(entries: Array<[string, string | File]>): FormData {
	const data = new FormData();
	for (const [key, value] of entries) data.append(key, value);
	return data;
}

describe("FormService.useFormData", () => {
	it("reads plain inputs as strings", () => {
		const data = formData([
			["email", "ada@example.com"],
			["age", "36"],
		]);
		expect(useFormData(data)).toEqual({ email: "ada@example.com", age: "36" });
	});

	it("turns a valueless checked checkbox into true", () => {
		expect(useFormData(formData([["terms", "on"]]))).toEqual({ terms: true });
	});

	it("collects repeated names into arrays", () => {
		const data = formData([
			["tags", "a"],
			["tags", "b"],
		]);
		expect(useFormData(data)).toEqual({ tags: ["a", "b"] });
	});

	it("expands dotted names into nested objects", () => {
		const data = formData([
			["address.city", "Barcelona"],
			["address.zip", "08001"],
			["name", "Ada"],
		]);
		expect(useFormData(data)).toEqual({
			name: "Ada",
			address: { city: "Barcelona", zip: "08001" },
		});
	});

	it("keeps File values as files", () => {
		const file = new File(["x"], "avatar.png", { type: "image/png" });
		const data = formData([["avatar", file]]);
		expect(useFormData(data).avatar).toBe(file);
	});

	it("leaves unchecked boxes out entirely", () => {
		expect(useFormData(formData([["email", "a@b.co"]]))).toEqual({ email: "a@b.co" });
	});
});

describe("FormService.useFieldErrors", () => {
	it("keeps the first message per field", () => {
		const errors = useFieldErrors({
			issues: [
				{ path: ["email"], message: "Too short" },
				{ path: ["email"], message: "Invalid email" },
				{ path: ["address", "city"], message: "Required" },
			],
		});
		expect(errors).toEqual({ email: "Too short", "address.city": "Required" });
	});

	it("maps root-level issues to _form", () => {
		const errors = useFieldErrors({ issues: [{ path: [], message: "Passwords differ" }] });
		expect(errors).toEqual({ _form: "Passwords differ" });
	});

	it("returns an empty map without issues", () => {
		expect(useFieldErrors({})).toEqual({});
	});
});

describe("FormService.useParseForm", () => {
	const Schema = z.object({
		email: z.string().email(),
		age: z.coerce.number().min(18),
	});

	it("returns typed values on success", () => {
		const result = useParseForm(
			Schema,
			formData([
				["email", "ada@example.com"],
				["age", "36"],
			]),
		);
		expect(result.ok).toBe(true);
		expect(result.values).toEqual({ email: "ada@example.com", age: 36 });
		expect(result.errors).toEqual({});
	});

	it("returns per-field messages on failure", () => {
		const result = useParseForm(
			Schema,
			formData([
				["email", "nope"],
				["age", "12"],
			]),
		);
		expect(result.ok).toBe(false);
		expect(result.values).toBeNull();
		expect(Object.keys(result.errors).sort()).toEqual(["age", "email"]);
	});

	it("accepts an already-collected object", () => {
		const result = useParseForm(Schema, { email: "ada@example.com", age: 30 });
		expect(result.ok).toBe(true);
	});

	it("reports a friendly error when the schema cannot parse", () => {
		const result = useParseForm({}, {});
		expect(result.ok).toBe(false);
		expect(result.errors._form).toMatch(/safeParse/);
	});
});

describe("FormService.useFieldError", () => {
	it("reads one field's message", () => {
		expect(useFieldError({ email: "Invalid" }, "email")).toBe("Invalid");
		expect(useFieldError({}, "email")).toBeUndefined();
	});
});

describe("FormService", () => {
	it("is a singleton", () => {
		expect(FormService.getInstance()).toBe(FormService.getInstance());
	});
});
