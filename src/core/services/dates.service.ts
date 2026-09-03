// services/dates.service.ts
// @ts-expect-error La dependencia puede estar disponible únicamente en tiempo de ejecución.
import { Temporal } from "@js-temporal/polyfill";

// ============================================================
// 1. TIPOS PROPIOS DEL ARCHIVO (DECLARACIÓN DIRECTA)
// ============================================================

export type Locale = "en-US" | "es-ES" | "fr-FR" | "de-DE";

export type TemporalInput =
	| string
	| number
	| Date
	| Temporal.PlainDate
	| Temporal.PlainDateTime
	| Temporal.ZonedDateTime
	| Temporal.Instant;

// ============================================================
// 2. CONTRATO DE LA FACHADA (INTERFAZ)
// ============================================================

export interface DatesServiceTypes {
	DIFF(
		start: string | Temporal.PlainDate,
		end: string | Temporal.PlainDate,
	): string | Date["toString"] | null;

	FORMAT(
		dateInput: TemporalInput | Date["toISOString"],
		locale?: Locale,
		options?: Intl.DateTimeFormatOptions,
	): string | Date;
	NOW(): string | DateConstructor["now"];
	NOW_DATE_TIME(): string | Date["toTimeString"] | DateConstructor["toString"];
	ADD_DAYS(date: string | Temporal.PlainDate, days: number): string;
	SUBTRACT_DAYS(date: string | Temporal.PlainDate, days: number): string;
	IS_EQUAL(
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean;
	IS_BEFORE(
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean;
	IS_AFTER(
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean;
	FIRST_DAY_OF_MONTH(
		date?: string | Temporal.PlainDate,
	): string | Date["getDay"];
	LAST_DAY_OF_MONTH(
		date?: string | Temporal.PlainDate,
	): string | Date["getDay"];
}

// ============================================================
// 3. IMPLEMENTACIÓN FACHADA + ADAPTER + SINGLETON
// ============================================================

export class DatesService implements DatesServiceTypes {
	// Regla Singleton: Instancia estática privada[cite: 1, 3]
	private static instance: DatesService;

	// Regla Singleton: Constructor privado[cite: 1, 3]
	private constructor() {}

	// Regla Singleton: Punto de acceso global único[cite: 1, 3]
	public static getInstance(): DatesService {
		if (!DatesService.instance) {
			DatesService.instance = new DatesService();
		}
		return DatesService.instance;
	}

	// Helper privado para adaptar inputs flexibles a PlainDate
	private TO_PLAIN_DATE = (
		date: string | Temporal.PlainDate,
	): Temporal.PlainDate => {
		return typeof date === "string" ? Temporal.PlainDate.from(date) : date;
	};

	public DIFF = (
		start: string | Temporal.PlainDate,
		end: string | Temporal.PlainDate,
	): string => {
		const startDate = this.TO_PLAIN_DATE(start);
		const endDate = this.TO_PLAIN_DATE(end);
		const duration = startDate.until(endDate, { largestUnit: "year" });

		return `${duration.years} años, ${duration.months} meses y ${duration.days} días`;
	};

	public FORMAT = (
		dateInput: TemporalInput | Date["toISOString" | "toDateString"],
		locale: Locale = "en-US",
		options: Intl.DateTimeFormatOptions = {},
	): string => {
		let date:
			| Temporal.PlainDate
			| Temporal.PlainDateTime
			| Temporal.ZonedDateTime;

		try {
			if (typeof dateInput === "number") {
				date = Temporal.Instant.fromEpochMilliseconds(
					dateInput,
				).toZonedDateTimeISO(Temporal.Now.timeZoneId());
			} else if (typeof dateInput === "string") {
				try {
					date = Temporal.PlainDate.from(dateInput);
				} catch {
					date = Temporal.PlainDateTime.from(dateInput);
				}
			} else if (dateInput instanceof Date) {
				date = Temporal.Instant.fromEpochMilliseconds(
					dateInput.getTime(),
				).toZonedDateTimeISO(Temporal.Now.timeZoneId());
			} else if (dateInput instanceof Temporal.Instant) {
				date = dateInput.toZonedDateTimeISO(Temporal.Now.timeZoneId());
			} else {
				date = dateInput;
			}

			return date.toLocaleString(locale, options);
		} catch (error) {
			console.log("error", "Error formateando fecha:", error);
			throw new Error(`Invalid date input: ${dateInput}`);
		}
	};

	public NOW = (): string => {
		return Temporal.Now.plainDateISO().toString();
	};

	public NOW_DATE_TIME = (): string => {
		return Temporal.Now.plainDateTimeISO().toString();
	};

	public ADD_DAYS = (
		date: string | Temporal.PlainDate,
		days: number,
	): string => {
		return this.TO_PLAIN_DATE(date).add(+days).toString();
	};

	public SUBTRACT_DAYS = (
		date: string | Temporal.PlainDate,
		days: number,
	): string => {
		return this.TO_PLAIN_DATE(date).subtract({ days }).toString();
	};

	public IS_EQUAL = (
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean => {
		return (
			Temporal.PlainDate.compare(
				this.TO_PLAIN_DATE(date1),
				this.TO_PLAIN_DATE(date2),
			) === 0
		);
	};

	public IS_BEFORE = (
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean => {
		return (
			Temporal.PlainDate.compare(
				this.TO_PLAIN_DATE(date1),
				this.TO_PLAIN_DATE(date2),
			) < 0
		);
	};

	public IS_AFTER = (
		date1: string | Temporal.PlainDate | Date["toISOString"],
		date2: string | Temporal.PlainDate | Date["toISOString"],
	): boolean => {
		return (
			Temporal.PlainDate.compare(
				this.TO_PLAIN_DATE(date1),
				this.TO_PLAIN_DATE(date2),
			) > 0
		);
	};

	public FIRST_DAY_OF_MONTH = (
		date: string | Temporal.PlainDate = Temporal.Now.plainDateISO(),
	): string => {
		return this.TO_PLAIN_DATE(date).with({ day: 1 }).toString();
	};

	public LAST_DAY_OF_MONTH = (
		date: string | Temporal.PlainDate = Temporal.Now.plainDateISO(),
	): string => {
		return this.TO_PLAIN_DATE(date)
			.add({ months: 1 })
			.with({ day: 1 })
			.subtract({ days: 1 })
			.toString();
	};
}

// ============================================================
// 4. INSTANCIA SINGLETON Y EXPORTACIÓN DESESTRUCTURADA
// ============================================================

export const { FORMAT, NOW }: DatesService = DatesService.getInstance();

export const today: Date | string = FORMAT(NOW());
FORMAT(NOW(), "en-US", { day: "2-digit" });
