import type { Temporal } from "@js-temporal/polyfill";
import type { z } from "zod";

import {
	AppDateFormatOptionsSchema,
	DateOrderSchema,
	DateUnitSchema,
} from "@/schemas/core.schema.js";

import type { Locale } from "./currency.js";

export type TemporalInput =
	| string
	| number
	| Date
	| Temporal.PlainDate
	| Temporal.PlainDateTime
	| Temporal.ZonedDateTime
	| Temporal.Instant;

/** Granularity accepted by the calendar arithmetic helpers. */
export type DateUnit = z.infer<typeof DateUnitSchema>;

/** Relative ordering of two dates. */
export type DateOrder = z.infer<typeof DateOrderSchema>;

export type AppDateFormatOptions = z.infer<typeof AppDateFormatOptionsSchema>;

/** Backwards-compatible alias for {@link AppDateFormatOptions}. */
export type DateFormatOptions = AppDateFormatOptions;

/**
 * Contract of the dates facade.
 *
 * `useDateBetween`, `useDateAdd`, `useDateSubtract` and `useDateOrder` are the
 * arithmetic primitives; `useDurationBetween` is the structured breakdown.
 */
export interface DatesServiceTypes {
	useDateBetween(start: TemporalInput, end: TemporalInput, unit?: DateUnit): number;
	useDurationBetween(start: TemporalInput, end: TemporalInput): Temporal.Duration;
	useDateAdd(date: TemporalInput, amount: number, unit: DateUnit): string;
	useDateSubtract(date: TemporalInput, amount: number, unit: DateUnit): string;
	useDateOrder(date1: TemporalInput, date2: TemporalInput): DateOrder;
	useFormat(dateInput: TemporalInput, locale?: Locale, options?: Intl.DateTimeFormatOptions): string;
	useNow(): string;
	useNowDateTime(): string;
	useAddDays(date: string | Temporal.PlainDate, days: number): string;
	useSubtractDays(date: string | Temporal.PlainDate, days: number): string;
	useIsEqual(date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate): boolean;
	useIsBefore(date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate): boolean;
	useIsAfter(date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate): boolean;
	useFirstDayOfMonth(date?: string | Temporal.PlainDate): string;
	useLastDayOfMonth(date?: string | Temporal.PlainDate): string;
}
