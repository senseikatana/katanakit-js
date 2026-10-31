// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { Checkbox, Field, Form, Input, Select, Submit, Textarea } from "@/adapters/react/forms.js";

afterEach(cleanup);

const SignUpSchema = z.object({
	name: z.string().min(2, "Too short"),
	email: z.string().email("Invalid email"),
	terms: z.literal(true, { message: "Required" }),
});

/** The exact component tree from the docs quickstart. */
function SignUpForm({
	onSubmit,
}: {
	onSubmit: (values: unknown) => void | Promise<void>;
}): ReactNode {
	return createElement(
		Form<z.infer<typeof SignUpSchema>>,
		{ schema: SignUpSchema, onSubmit },
		createElement(
			Field,
			{ name: "name", label: "Name" },
			createElement(Input, { placeholder: "Ada Lovelace" }),
		),
		createElement(
			Field,
			{ name: "email", label: "Email", hint: "Only for receipts" },
			createElement(Input, { type: "email", autoComplete: "email" }),
		),
		createElement(Field, { name: "terms", label: "Accept terms" }, createElement(Checkbox)),
		createElement(Submit, { pendingLabel: "Signing up…" }, "Create account"),
	);
}

describe("react forms", () => {
	it("reports field errors and focuses the first invalid field on submit", async () => {
		const onSubmit = vi.fn();
		render(createElement(SignUpForm, { onSubmit }));

		screen.getByRole("button", { name: "Create account" }).click();

		await waitFor(() => expect(screen.getByText("Too short")).toBeTruthy());
		expect(screen.getByText("Invalid email")).toBeTruthy();
		expect(screen.getByText("Required")).toBeTruthy();
		expect(onSubmit).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(screen.getByPlaceholderText("Ada Lovelace"));
	});

	it("marks invalid controls with aria-invalid and links the message", async () => {
		render(createElement(SignUpForm, { onSubmit: vi.fn() }));

		screen.getByRole("button", { name: "Create account" }).click();
		await waitFor(() => expect(screen.getByText("Invalid email")).toBeTruthy());

		const email = screen.getByLabelText("Email") as HTMLInputElement;
		const message = screen.getByText("Invalid email");
		expect(email.getAttribute("aria-invalid")).toBe("true");
		expect(email.getAttribute("aria-describedby")).toContain(message.id);
		// The hint stays part of the description too.
		expect(email.getAttribute("aria-describedby")).toContain("hint");
	});

	it("passes parsed values to onSubmit once the form is valid", async () => {
		const onSubmit = vi.fn();
		render(createElement(SignUpForm, { onSubmit }));

		const input = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
		input("Name").value = "Ada Lovelace";
		input("Email").value = "ada@example.com";
		input("Accept terms").click();

		screen.getByRole("button", { name: "Create account" }).click();

		await waitFor(() =>
			expect(onSubmit).toHaveBeenCalledWith({
				name: "Ada Lovelace",
				email: "ada@example.com",
				terms: true,
			}),
		);
	});

	it("clears a field's message once it passes on blur", async () => {
		render(createElement(SignUpForm, { onSubmit: vi.fn() }));

		screen.getByRole("button", { name: "Create account" }).click();
		await waitFor(() => expect(screen.getByText("Too short")).toBeTruthy());

		const name = screen.getByLabelText("Name") as HTMLInputElement;
		name.value = "Ada";
		name.dispatchEvent(new Event("input", { bubbles: true }));
		name.dispatchEvent(new FocusEvent("blur", { bubbles: true }));

		await waitFor(() => expect(screen.queryByText("Too short")).toBeNull());
	});

	it("keeps the submit button busy while an async submit settles", async () => {
		let release: () => void = () => {};
		const onSubmit = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					release = resolve;
				}),
		);
		render(createElement(SignUpForm, { onSubmit }));

		const input = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
		input("Name").value = "Ada Lovelace";
		input("Email").value = "ada@example.com";
		input("Accept terms").click();

		screen.getByRole("button", { name: "Create account" }).click();

		await waitFor(() => expect(screen.getByRole("button", { name: "Signing up…" })).toBeTruthy());
		const busy = screen.getByRole("button", { name: "Signing up…" }) as HTMLButtonElement;
		expect(busy.disabled).toBe(true);
		expect(busy.getAttribute("aria-busy")).toBe("true");

		release();
		await waitFor(() => expect(screen.getByRole("button", { name: "Create account" })).toBeTruthy());
	});

	it("supports native select and textarea controls", async () => {
		const Schema = z.object({ plan: z.string().min(1), notes: z.string().optional() });
		const onSubmit = vi.fn();
		render(
			createElement(
				Form<z.infer<typeof Schema>>,
				{ schema: Schema, onSubmit },
				createElement(
					Field,
					{ name: "plan", label: "Plan" },
					createElement(
						Select,
						null,
						createElement("option", { value: "pro" }, "Pro"),
						createElement("option", { value: "team" }, "Team"),
					),
				),
				createElement(Field, { name: "notes", label: "Notes" }, createElement(Textarea, null)),
				createElement(Submit, null, "Save"),
			),
		);

		const plan = screen.getByLabelText("Plan") as HTMLSelectElement;
		plan.value = "team";
		screen.getByRole("button", { name: "Save" }).click();

		await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ plan: "team", notes: "" }));
	});
});
