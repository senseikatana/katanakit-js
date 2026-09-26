// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";

import { useAlert, useAlertClass } from "../src/index";

describe("useAlertClass", () => {
	it("defaults to info and composes dismissal", () => {
		expect(useAlertClass()).toBe("kk-alert kk-alert--info");
		expect(useAlertClass({ variant: "danger", dismissible: true })).toBe(
			"kk-alert kk-alert--danger kk-alert--dismissible",
		);
	});
});

describe("useAlert", () => {
	it("uses assertive roles for warning and danger", () => {
		expect(useAlert({ variant: "warning" }).getAttribute("role")).toBe("alert");
		expect(useAlert({ variant: "danger" }).getAttribute("role")).toBe("alert");
	});

	it("uses polite roles for info and success", () => {
		expect(useAlert({ variant: "info" }).getAttribute("role")).toBe("status");
		expect(useAlert({ variant: "success" }).getAttribute("role")).toBe("status");
	});

	it("renders title and message", () => {
		const alert = useAlert({ title: "Heads up", message: "Quota at 90%" });

		expect(alert.querySelector(".kk-alert__title")?.textContent).toBe("Heads up");
		expect(alert.querySelector(".kk-alert__message")?.textContent).toBe("Quota at 90%");
	});

	it("dismisses accessibly and calls back", () => {
		const onDismiss = vi.fn();
		const alert = useAlert({ message: "Bye", dismissible: true, onDismiss });
		document.body.append(alert);

		const close = alert.querySelector<HTMLButtonElement>(".kk-alert__close");

		expect(close?.getAttribute("aria-label")).toBe("Dismiss");
		close?.click();

		expect(document.body.contains(alert)).toBe(false);
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});
});
