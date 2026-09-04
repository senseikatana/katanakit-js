import { describe, expect, it } from "vitest";
import { useCustom, useInternal, useNotFound } from "@/core/services/error.service";
import { GeometryUtils } from "@/core/services/geometry.service";
import { useCreateEffect, useCreateMemo, useCreateSignal } from "@/core/services/reactive.service";

describe("GeometryUtils", () => {
	it("computes the rectangle area", () => {
		expect(GeometryUtils.area.useRectangle(5, 10)).toBe("50.00");
	});

	it("computes the circle area", () => {
		expect(GeometryUtils.area.useCircle(3)).toBe("28.27");
	});

	it("appends a unit when provided", () => {
		expect(GeometryUtils.perimeter.useCircle(3, { unit: "cm" })).toBe("18.85 cm");
	});
});

describe("ErrorFactoryService", () => {
	it("creates typed errors with status codes", () => {
		expect(useNotFound("Missing").code).toBe(404);
		expect(useInternal().code).toBe(500);
	});

	it("serializes an error", () => {
		expect(useCustom("Teapot", 418).useToJson()).toEqual({
			name: "AppError",
			message: "Teapot",
			code: 418,
		});
	});
});

describe("ReactiveService", () => {
	it("updates a signal and notifies effects", () => {
		const [count, setCount] = useCreateSignal(0);
		let last = 0;

		useCreateEffect(() => {
			last = count();
		}, [count]);

		setCount(5);

		expect(count()).toBe(5);
		expect(last).toBe(5);
	});

	it("recomputes a memo when its dependency changes", () => {
		const [count, setCount] = useCreateSignal(1);
		const doubled = useCreateMemo(() => count() * 2, [count]);

		expect(doubled()).toBe(2);
		setCount(3);
		expect(doubled()).toBe(6);
	});
});
