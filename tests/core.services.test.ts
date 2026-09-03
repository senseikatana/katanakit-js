import { describe, expect, it } from "vitest";

import { GeometryUtils } from "@/core/services/geometry.service";
import { CUSTOM, INTERNAL, NOT_FOUND } from "@/core/services/error.service";
import {
	CREATE_EFFECT,
	CREATE_MEMO,
	CREATE_SIGNAL,
} from "@/core/services/reactive.service";

describe("GeometryUtils", () => {
	it("computes the rectangle area", () => {
		expect(GeometryUtils.area.rectangle(5, 10)).toBe("50.00");
	});

	it("computes the circle area", () => {
		expect(GeometryUtils.area.circle(3)).toBe("28.27");
	});

	it("appends a unit when provided", () => {
		expect(GeometryUtils.perimeter.circle(3, { unit: "cm" })).toBe("18.85 cm");
	});
});

describe("ErrorFactoryService", () => {
	it("creates typed errors with status codes", () => {
		expect(NOT_FOUND("Missing").code).toBe(404);
		expect(INTERNAL().code).toBe(500);
	});

	it("serializes an error", () => {
		expect(CUSTOM("Teapot", 418).TO_JSON()).toEqual({
			name: "AppError",
			message: "Teapot",
			code: 418,
		});
	});
});

describe("ReactiveService", () => {
	it("updates a signal and notifies effects", () => {
		const [count, setCount] = CREATE_SIGNAL(0);
		let last = 0;

		CREATE_EFFECT(() => {
			last = count();
		}, [count]);

		setCount(5);

		expect(count()).toBe(5);
		expect(last).toBe(5);
	});

	it("recomputes a memo when its dependency changes", () => {
		const [count, setCount] = CREATE_SIGNAL(1);
		const doubled = CREATE_MEMO(() => count() * 2, [count]);

		expect(doubled()).toBe(2);
		setCount(3);
		expect(doubled()).toBe(6);
	});
});
