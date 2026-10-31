import { describe, expect, it } from "vitest";

import { isForbiddenVersion, nextAllowedVersion } from "../scripts/version-policy.mjs";

describe("isForbiddenVersion", () => {
	it("allows versions with at most one 3", () => {
		expect(isForbiddenVersion("7.2.1")).toBe(false);
		expect(isForbiddenVersion("7.3.4")).toBe(false);
		expect(isForbiddenVersion("7.2.13")).toBe(false);
		expect(isForbiddenVersion("7.4.0")).toBe(false);
	});

	it("forbids a version that repeats the digit 3, close together or apart", () => {
		expect(isForbiddenVersion("7.3.3")).toBe(true);
		expect(isForbiddenVersion("7.3.13")).toBe(true);
		expect(isForbiddenVersion("7.3.23")).toBe(true);
		expect(isForbiddenVersion("7.3.30")).toBe(true);
		expect(isForbiddenVersion("7.33.3")).toBe(true);
		expect(isForbiddenVersion("3.3.3")).toBe(true);
	});
});

describe("nextAllowedVersion", () => {
	it("bumps the patch past the forbidden number", () => {
		expect(nextAllowedVersion("7.3.3")).toBe("7.3.4");
		expect(nextAllowedVersion("7.3.13")).toBe("7.3.14");
		expect(nextAllowedVersion("7.3.30")).toBe("7.3.40");
	});

	it("escalates the minor when every patch repeats a 3", () => {
		expect(nextAllowedVersion("3.3.3")).toBe("3.4.0");
		expect(nextAllowedVersion("7.33.3")).toBe("7.34.0");
	});
});

describe("any major version", () => {
	it("applies the rule outside the current 7.x line", () => {
		expect(isForbiddenVersion("8.3.3")).toBe(true);
		expect(isForbiddenVersion("13.3.3")).toBe(true);
		expect(isForbiddenVersion("8.3.4")).toBe(false);
		expect(nextAllowedVersion("8.3.3")).toBe("8.3.4");
	});
});
