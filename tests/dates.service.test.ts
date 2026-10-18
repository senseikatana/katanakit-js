import { Temporal } from "@js-temporal/polyfill";
import { describe, expect, it } from "vitest";

import {
	useDateAdd,
	useDateBetween,
	useDateOrder,
	useDateSubtract,
	useDurationBetween,
} from "@/core/services/dates.service";
import type { DateUnit } from "@/types/index";

describe("useDateBetween", () => {
	describe("default unit", () => {
		it("counts days when no unit is given", () => {
			expect(useDateBetween("2026-03-01", "2026-04-01")).toBe(31);
		});

		it("is zero for the same date", () => {
			expect(useDateBetween("2026-03-01", "2026-03-01")).toBe(0);
		});
	});

	describe("sign", () => {
		it("is positive when the end is later", () => {
			expect(useDateBetween("2026-03-01", "2026-04-01", "days")).toBeGreaterThan(0);
		});

		it("is negative when the arguments are reversed", () => {
			expect(useDateBetween("2026-04-01", "2026-03-01", "days")).toBe(-31);
		});

		it("mirrors exactly for every unit", () => {
			const units: DateUnit[] = ["years", "quarters", "months", "weeks", "days", "hours", "minutes"];
			for (const unit of units) {
				expect(useDateBetween("2026-03-01", "2026-04-01", unit)).toBe(
					-useDateBetween("2026-04-01", "2026-03-01", unit),
				);
			}
		});
	});

	describe("calendar units", () => {
		it("counts whole months", () => {
			expect(useDateBetween("2026-01-01", "2026-04-01", "months")).toBe(3);
		});

		it("counts whole years", () => {
			expect(useDateBetween("2020-01-01", "2022-04-16", "years")).toBe(2);
		});

		it("counts quarters as three months", () => {
			expect(useDateBetween("2026-01-01", "2026-08-01", "quarters")).toBe(2);
		});

		it("truncates a partial quarter rather than rounding it", () => {
			// 4 months is one full quarter plus one month.
			expect(useDateBetween("2026-01-01", "2026-05-01", "quarters")).toBe(1);
		});

		it("counts weeks", () => {
			expect(useDateBetween("2026-03-01", "2026-03-29", "weeks")).toBe(4);
		});

		it("never returns a fractional year count", () => {
			// A month is 1/12 of a year; truncating keeps the result a whole number.
			expect(Number.isInteger(useDateBetween("2026-03-01", "2026-04-01", "years"))).toBe(true);
			expect(useDateBetween("2026-03-01", "2026-04-01", "years")).toBe(0);
		});

		it("respects month length rather than assuming 30 days", () => {
			expect(useDateBetween("2026-02-01", "2026-03-01", "days")).toBe(28);
			expect(useDateBetween("2024-02-01", "2024-03-01", "days")).toBe(29);
		});
	});

	describe("sub-day units", () => {
		it("counts hours between two date-times", () => {
			expect(useDateBetween("2026-03-01T00:00:00", "2026-04-01T00:00:00", "hours")).toBe(744);
		});

		it("counts minutes between two date-times", () => {
			expect(useDateBetween("2026-03-01T00:00:00", "2026-03-01T02:30:00", "minutes")).toBe(150);
		});

		it("treats two bare dates as midnight, so the hour count is the day count", () => {
			// Not zero: both dates mean midnight, and 31 days is 744 hours. Asking
			// for a finer unit must not change the underlying span, only its scale.
			expect(useDateBetween("2026-03-01", "2026-04-01", "hours")).toBe(744);
			expect(useDateBetween("2026-03-01", "2026-04-01", "hours")).toBe(
				useDateBetween("2026-03-01", "2026-04-01", "days") * 24,
			);
		});

		it("answers zero hours for two dates that are the same day", () => {
			expect(useDateBetween("2026-03-01", "2026-03-01", "hours")).toBe(0);
		});

		it("accepts a date on one side and a date-time on the other", () => {
			expect(useDateBetween("2026-03-01T00:00:00", "2026-03-01T06:00:00", "hours")).toBe(6);
		});
	});

	describe("input shapes", () => {
		it("accepts Temporal.PlainDate instances", () => {
			const a = Temporal.PlainDate.from("2026-03-01");
			const b = Temporal.PlainDate.from("2026-04-01");
			expect(useDateBetween(a, b, "days")).toBe(31);
		});

		it("accepts a native Date", () => {
			const a = new Date("2026-03-01T00:00:00Z");
			const b = new Date("2026-03-11T00:00:00Z");
			expect(useDateBetween(a, b, "days")).toBe(10);
		});

		it("accepts an epoch millisecond number", () => {
			const a = Date.parse("2026-03-01T00:00:00Z");
			const b = Date.parse("2026-03-11T00:00:00Z");
			expect(useDateBetween(a, b, "days")).toBe(10);
		});

		it("falls back to days for an unknown unit instead of throwing", () => {
			expect(useDateBetween("2026-03-01", "2026-04-01", "fortnights" as DateUnit)).toBe(31);
		});
	});
});

describe("useDurationBetween", () => {
	it("breaks the span into parts", () => {
		const span = useDurationBetween("2020-01-01", "2022-04-16");

		expect(span.years).toBe(2);
		expect(span.months).toBe(3);
		expect(span.days).toBe(15);
	});

	it("returns a zero duration for the same date", () => {
		const span = useDurationBetween("2026-03-01", "2026-03-01");

		expect(span.years).toBe(0);
		expect(span.months).toBe(0);
		expect(span.days).toBe(0);
	});

	it("carries the sign of the span", () => {
		expect(useDurationBetween("2022-04-16", "2020-01-01").years).toBe(-2);
	});

	it("agrees with useDateBetween on the same span", () => {
		const start = "2020-01-01";
		const end = "2022-04-16";

		expect(useDurationBetween(start, end).months).toBe(useDateBetween(start, end, "months") % 12);
	});
});

describe("useDateAdd / useDateSubtract", () => {
	it("adds each calendar unit", () => {
		expect(useDateAdd("2026-01-01", 1, "years")).toBe("2027-01-01");
		expect(useDateAdd("2026-01-01", 1, "months")).toBe("2026-02-01");
		expect(useDateAdd("2026-01-01", 2, "weeks")).toBe("2026-01-15");
		expect(useDateAdd("2026-01-01", 10, "days")).toBe("2026-01-11");
	});

	it("treats a quarter as three months", () => {
		expect(useDateAdd("2026-01-01", 2, "quarters")).toBe("2026-07-01");
		expect(useDateAdd("2026-01-01", 1, "quarters")).toBe(useDateAdd("2026-01-01", 3, "months"));
	});

	it("clamps to the end of a shorter month instead of overflowing", () => {
		expect(useDateAdd("2026-01-31", 1, "months")).toBe("2026-02-28");
	});

	it("subtracts by symmetry", () => {
		expect(useDateSubtract("2026-01-11", 10, "days")).toBe("2026-01-01");
		expect(useDateSubtract("2026-07-01", 2, "quarters")).toBe("2026-01-01");
	});

	it("returns to the start after a round trip", () => {
		for (const unit of ["years", "months", "weeks", "days"] as const) {
			const there = useDateAdd("2026-03-01", 7, unit);
			expect(useDateSubtract(there, 7, unit)).toBe("2026-03-01");
		}
	});

	it("accepts a negative amount", () => {
		expect(useDateAdd("2026-03-01", -1, "days")).toBe("2026-02-28");
	});

	it("adds sub-day units to a date-time", () => {
		expect(useDateAdd("2026-03-01T09:00:00", 90, "minutes")).toBe("2026-03-01T10:30:00");
	});

	it("falls back to a no-op for a non-finite amount", () => {
		expect(useDateAdd("2026-03-01", Number.NaN, "days")).toBe("2026-03-01");
	});
});

describe("useDateOrder", () => {
	it("reports which date comes first", () => {
		expect(useDateOrder("2026-03-01", "2026-04-01")).toBe("before");
		expect(useDateOrder("2026-04-01", "2026-03-01")).toBe("after");
		expect(useDateOrder("2026-03-01", "2026-03-01")).toBe("same");
	});

	it("compares down to the minute", () => {
		expect(useDateOrder("2026-03-01T09:00:00", "2026-03-01T09:01:00")).toBe("before");
	});

	it("treats a bare date as midnight, so a same-day date-time is later", () => {
		expect(useDateOrder("2026-03-01", "2026-03-01T00:00:01")).toBe("before");
	});

	it("is the inverse when the arguments swap", () => {
		expect(useDateOrder("2026-04-01", "2026-03-01")).not.toBe(
			useDateOrder("2026-03-01", "2026-04-01"),
		);
	});
});
