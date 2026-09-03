import { Temporal } from "@js-temporal/polyfill";

import type { Locale, TemporalInput } from "@/types";

/**
 * Contract of the dates facade.
 */
export interface DatesServiceTypes {
	DIFF(start: string | Temporal.PlainDate, end: string | Temporal.PlainDate): string;
	FORMAT(dateInput: TemporalInput, locale?: Locale, options?: Intl.DateTimeFormatOptions): string;
	NOW(): string;
	NOW_DATE_TIME(): string;
	ADD_DAYS(date: string | Temporal.PlainDate, days: number): string;
	SUBTRACT_DAYS(date: string | Temporal.PlainDate, days: number): string;
	IS_EQUAL(date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate): boolean;
	IS_BEFORE(date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate): boolean;
	IS_AFTER(date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate): boolean;
	FIRST_DAY_OF_MONTH(date?: string | Temporal.PlainDate): string;
	LAST_DAY_OF_MONTH(date?: string | Temporal.PlainDate): string;
}

/**
 * Facade + Adapter + Singleton over the Temporal polyfill.
 */
export class DatesService implements DatesServiceTypes {
	private static instance: DatesService;

	private constructor() {}

	public static getInstance(): DatesService {
		if (!DatesService.instance) {
			DatesService.instance = new DatesService();
		}
		return DatesService.instance;
	}

	// Private helper that adapts flexible inputs into a PlainDate.
	private TO_PLAIN_DATE = (date: string | Temporal.PlainDate): Temporal.PlainDate =>
		typeof date === "string" ? Temporal.PlainDate.from(date) : date;

	public DIFF = (start: string | Temporal.PlainDate, end: string | Temporal.PlainDate): string => {
		const startDate = this.TO_PLAIN_DATE(start);
		const endDate = this.TO_PLAIN_DATE(end);
		const duration = startDate.until(endDate, { largestUnit: "year" });

		return `${duration.years} years, ${duration.months} months and ${duration.days} days`;
	};

	public FORMAT = (
		dateInput: TemporalInput,
		locale: Locale = "en",
		options: Intl.DateTimeFormatOptions = {},
	): string => {
		let date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime;

		try {
			if (typeof dateInput === "number") {
				date = Temporal.Instant.fromEpochMilliseconds(dateInput).toZonedDateTimeISO(
					Temporal.Now.timeZoneId(),
				);
			} else if (typeof dateInput === "string") {
				try {
					date = Temporal.PlainDate.from(dateInput);
				} catch {
					date = Temporal.PlainDateTime.from(dateInput);
				}
			} else if (dateInput instanceof Date) {
				date = Temporal.Instant.fromEpochMilliseconds(dateInput.getTime()).toZonedDateTimeISO(
					Temporal.Now.timeZoneId(),
				);
			} else if (dateInput instanceof Temporal.Instant) {
				date = dateInput.toZonedDateTimeISO(Temporal.Now.timeZoneId());
			} else {
				date = dateInput;
			}

			return date.toLocaleString(locale, options);
		} catch (error) {
			console.error("Invalid date input:", error);
			throw new Error(`Invalid date input: ${dateInput}`);
		}
	};

	public NOW = (): string => Temporal.Now.plainDateISO().toString();

	public NOW_DATE_TIME = (): string => Temporal.Now.plainDateTimeISO().toString();

	public ADD_DAYS = (date: string | Temporal.PlainDate, days: number): string =>
		this.TO_PLAIN_DATE(date).add({ days }).toString();

	public SUBTRACT_DAYS = (date: string | Temporal.PlainDate, days: number): string =>
		this.TO_PLAIN_DATE(date).subtract({ days }).toString();

	public IS_EQUAL = (
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean =>
		Temporal.PlainDate.compare(this.TO_PLAIN_DATE(date1), this.TO_PLAIN_DATE(date2)) === 0;

	public IS_BEFORE = (
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean => Temporal.PlainDate.compare(this.TO_PLAIN_DATE(date1), this.TO_PLAIN_DATE(date2)) < 0;

	public IS_AFTER = (
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean => Temporal.PlainDate.compare(this.TO_PLAIN_DATE(date1), this.TO_PLAIN_DATE(date2)) > 0;

	public FIRST_DAY_OF_MONTH = (
		date: string | Temporal.PlainDate = Temporal.Now.plainDateISO(),
	): string => this.TO_PLAIN_DATE(date).with({ day: 1 }).toString();

	public LAST_DAY_OF_MONTH = (
		date: string | Temporal.PlainDate = Temporal.Now.plainDateISO(),
	): string =>
		this.TO_PLAIN_DATE(date).add({ months: 1 }).with({ day: 1 }).subtract({ days: 1 }).toString();
}

// Singleton instance and destructured exports.
export const { FORMAT, NOW }: DatesService = DatesService.getInstance();
