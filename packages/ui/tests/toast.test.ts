// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	TOAST_EXIT_FALLBACK_MS,
	useToast,
	useToastClass,
	useToastContainer,
	useToastContainerClass,
	useToastStore,
} from "../src/index";

describe("useToastClass", () => {
	it("defaults to info at medium size and dismissible", () => {
		expect(useToastClass()).toBe("kk-toast kk-toast--info kk-toast--md kk-toast--dismissible");
	});

	it("composes variant and size", () => {
		expect(useToastClass({ type: "success", size: "sm" })).toBe(
			"kk-toast kk-toast--success kk-toast--sm kk-toast--dismissible",
		);
	});

	it("drops the dismissible modifier when opted out", () => {
		expect(useToastClass({ type: "error", dismissible: false })).toBe(
			"kk-toast kk-toast--error kk-toast--md",
		);
	});
});

describe("useToastContainerClass", () => {
	it("defaults to the top-right anchor", () => {
		expect(useToastContainerClass()).toBe("kk-toast-stack kk-toast-stack--top-right");
		expect(useToastContainerClass({ position: "bottom-left" })).toBe(
			"kk-toast-stack kk-toast-stack--bottom-left",
		);
	});
});

describe("useToast", () => {
	it("uses an assertive role only for errors", () => {
		expect(useToast({ type: "error" }).getAttribute("role")).toBe("alert");
		expect(useToast({ type: "success" }).getAttribute("role")).toBe("status");
		expect(useToast({ type: "info" }).getAttribute("role")).toBe("status");
	});

	it("hides the decorative icon from assistive tech", () => {
		const icon = useToast({ type: "success" }).querySelector(".kk-toast__icon");

		expect(icon?.getAttribute("aria-hidden")).toBe("true");
		expect(icon?.getAttribute("focusable")).toBe("false");
	});

	it("renders no icon for loading toasts", () => {
		expect(useToast({ type: "loading" }).querySelector(".kk-toast__icon")).toBeNull();
	});

	it("renders title and message", () => {
		const toast = useToast({ title: "Heads up", message: "Quota at 90%" });

		expect(toast.querySelector(".kk-toast__title")?.textContent).toBe("Heads up");
		expect(toast.querySelector(".kk-toast__message")?.textContent).toBe("Quota at 90%");
	});

	it("labels the close button", () => {
		const toast = useToast({ message: "Bye" });
		const close = toast.querySelector(".kk-toast__close");

		expect(close?.getAttribute("aria-label")).toBe("Dismiss notification");
		expect(
			useToast({ message: "Bye", closeLabel: "Cerrar" })
				.querySelector(".kk-toast__close")
				?.getAttribute("aria-label"),
		).toBe("Cerrar");
	});
});

describe("useToastContainer", () => {
	it("is a polite live region with an accessible name", () => {
		const stack = useToastContainer();

		expect(stack.getAttribute("role")).toBe("region");
		expect(stack.getAttribute("aria-live")).toBe("polite");
		expect(stack.getAttribute("aria-label")).toBe("Notifications");
	});
});

describe("useToastStore", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		document.body.innerHTML = "";
	});

	afterEach(() => {
		vi.useRealTimers();
		document.body.innerHTML = "";
	});

	it("mounts into a lazily created stack", () => {
		// Arrange / Act
		useToastStore().success("Saved");

		// Assert
		const stack = document.querySelector(".kk-toast-stack--top-right");
		expect(stack?.querySelectorAll(".kk-toast--success")).toHaveLength(1);
	});

	it("routes each helper to its variant", () => {
		// Arrange
		const toast = useToastStore();

		// Act
		toast.info("i");
		toast.success("s");
		toast.warning("w");
		toast.error("e");
		toast.loading("l");

		// Assert
		expect(document.querySelectorAll(".kk-toast--info")).toHaveLength(1);
		expect(document.querySelectorAll(".kk-toast--success")).toHaveLength(1);
		expect(document.querySelectorAll(".kk-toast--warning")).toHaveLength(1);
		expect(document.querySelectorAll(".kk-toast--error")).toHaveLength(1);
		expect(document.querySelectorAll(".kk-toast--loading")).toHaveLength(1);
	});

	it("auto-dismisses after the default duration", () => {
		// Arrange / Act
		useToastStore().success("Saved");
		expect(document.querySelector(".kk-toast")).not.toBeNull();

		// Assert — the timer fires at 5s, then the exit fallback clears the node
		vi.advanceTimersByTime(5000 + TOAST_EXIT_FALLBACK_MS);
		expect(document.querySelector(".kk-toast")).toBeNull();
	});

	it("keeps loading toasts pinned indefinitely", () => {
		// Arrange / Act
		useToastStore().loading("Uploading");

		// Assert
		vi.advanceTimersByTime(60_000);
		expect(document.querySelector(".kk-toast--loading")).not.toBeNull();
	});

	it("honours a zero duration", () => {
		// Arrange / Act
		useToastStore().error("Fatal", { duration: 0 });

		// Assert
		vi.advanceTimersByTime(60_000);
		expect(document.querySelector(".kk-toast--error")).not.toBeNull();
	});

	it("pauses the countdown on hover and resumes it on leave", () => {
		// Arrange
		const toast = useToastStore().success("Saved");
		const element = document.querySelector(".kk-toast") as HTMLElement;
		expect(element).not.toBeNull();

		// Act — hover at 3s, stay for 10s
		vi.advanceTimersByTime(3000);
		element.dispatchEvent(new MouseEvent("mouseenter"));
		expect(element.classList.contains("kk-toast--paused")).toBe(true);
		vi.advanceTimersByTime(10_000);

		// Assert — still alive, because the timer froze with it
		expect(document.querySelector(".kk-toast")).not.toBeNull();

		// Act — leave; only the remaining 2s are left on the clock
		element.dispatchEvent(new MouseEvent("mouseleave"));
		vi.advanceTimersByTime(1999);
		expect(document.querySelector(".kk-toast")).not.toBeNull();

		// Assert — gone once the resumed countdown runs out
		vi.advanceTimersByTime(1 + TOAST_EXIT_FALLBACK_MS);
		expect(document.querySelector(".kk-toast")).toBeNull();
		expect(toast.id).toMatch(/^kk-toast-\d+$/);
	});

	it("pauses on keyboard focus too", () => {
		// Arrange
		useToastStore().success("Saved");
		const element = document.querySelector(".kk-toast") as HTMLElement;

		// Act
		vi.advanceTimersByTime(4000);
		element.dispatchEvent(new FocusEvent("focusin"));
		vi.advanceTimersByTime(60_000);

		// Assert
		expect(document.querySelector(".kk-toast")).not.toBeNull();
	});

	it("dismisses by id and leaves siblings untouched", () => {
		// Arrange
		const toast = useToastStore();
		const first = toast.info("first");
		toast.info("second");

		// Act
		toast.dismiss(first.id);
		vi.advanceTimersByTime(TOAST_EXIT_FALLBACK_MS);

		// Assert
		expect(document.querySelectorAll(".kk-toast")).toHaveLength(1);
	});

	it("removes every toast on clear", () => {
		// Arrange
		const toast = useToastStore();
		toast.info("a");
		toast.success("b", { position: "bottom-center" });

		// Act
		toast.clear();
		vi.advanceTimersByTime(TOAST_EXIT_FALLBACK_MS);

		// Assert
		expect(document.querySelectorAll(".kk-toast")).toHaveLength(0);
		expect(document.querySelectorAll(".kk-toast-stack")).toHaveLength(0);
	});

	it("updates a toast in place, keeping its id", () => {
		// Arrange
		const handle = useToastStore().loading("Uploading");
		document.body.append(document.querySelector(".kk-toast") as HTMLElement);

		// Act
		handle.update({ type: "success", message: "Upload complete" });

		// Assert
		const updated = document.querySelector(".kk-toast") as HTMLElement;
		expect(updated.dataset.toastId).toBe(handle.id);
		expect(updated.classList.contains("kk-toast--success")).toBe(true);
		expect(updated.querySelector(".kk-toast__message")?.textContent).toBe("Upload complete");
	});

	it("invokes onClose with the toast id", () => {
		// Arrange
		const onClose = vi.fn();

		// Act
		useToastStore().show({ message: "bye", duration: 1000, onClose });
		vi.advanceTimersByTime(1000 + TOAST_EXIT_FALLBACK_MS);

		// Assert
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose.mock.calls[0][0]).toMatch(/^kk-toast-\d+$/);
	});

	it("keeps separate stacks per position", () => {
		// Arrange
		const toast = useToastStore();

		// Act
		toast.info("right", { position: "top-right" });
		toast.info("left", { position: "bottom-left" });

		// Assert
		expect(document.querySelectorAll(".kk-toast-stack")).toHaveLength(2);
		expect(document.querySelector(".kk-toast-stack--bottom-left .kk-toast")?.textContent).toContain(
			"left",
		);
	});

	it("drops the stack from the DOM once empty", () => {
		// Arrange
		const toast = useToastStore();
		toast.info("bye", { duration: 1000 });

		// Act / Assert
		expect(document.querySelectorAll(".kk-toast-stack")).toHaveLength(1);
		vi.advanceTimersByTime(1000 + TOAST_EXIT_FALLBACK_MS);
		expect(document.querySelectorAll(".kk-toast-stack")).toHaveLength(0);
	});
});
