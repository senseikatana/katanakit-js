import type { CurrencyFormatOptions, Locale } from "@/types";

/**
 * Contract of the formatter facade.
 */
export interface IFormatterService {
	CAPITALIZE(text: string, locale?: Locale): string;
	FORMAT_CURRENCY(options: CurrencyFormatOptions): string;
	FORMAT_NUMBER(value: number, locale?: Locale, digits?: number): string;
	JSON_PARSE<T = unknown>(json: string): T;
	JSON_STRINGIFY(data: unknown): string;
	LOWER_CASE(text: string, locale?: Locale): string;
	UPPER_CASE(text: string, locale?: Locale): string;
}

/**
 * Number/currency/string formatter (Adapter + Singleton) over `Intl`.
 */
export class FormatterService implements IFormatterService {
	private static instance: FormatterService;

	private constructor() {}

	public static getInstance(): FormatterService {
		if (!FormatterService.instance) {
			FormatterService.instance = new FormatterService();
		}
		return FormatterService.instance;
	}

	public FORMAT_NUMBER = (value: number, locale: Locale = "en", digits = 2): string => {
		return new Intl.NumberFormat(locale, {
			maximumFractionDigits: digits,
			minimumFractionDigits: digits,
		}).format(value);
	};

	public UPPER_CASE = (text: string, locale: Locale = "en"): string =>
		text.toLocaleUpperCase(locale).trim();

	public LOWER_CASE = (text: string, locale: Locale = "en"): string =>
		text.toLocaleLowerCase(locale).trim();

	public CAPITALIZE = (text: string, locale: Locale = "en"): string => {
		const trimmed = text.trim();
		if (!trimmed) return "";
		return trimmed.charAt(0).toLocaleUpperCase(locale) + trimmed.slice(1);
	};

	public FORMAT_CURRENCY = (options: CurrencyFormatOptions): string => {
		const { amount, currency = "USD", taxes = 0, locale = "en" } = options;
		// `taxes` may be a percentage (21) or a decimal fraction (0.21).
		const taxRate = taxes > 1 ? taxes / 100 : taxes;
		const total = amount * (1 + taxRate);

		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
		}).format(total);
	};

	public JSON_STRINGIFY = (data: unknown): string => JSON.stringify(data, null, 3);

	public JSON_PARSE = <T = unknown>(json: string): T => JSON.parse(json) as T;
}

/**
 * Contract of the unit converter facade.
 */
export interface IConverterService {
	TO_CELSIUS(fahrenheit: number, locale?: Locale, digits?: number): string;
	TO_FAHRENHEIT(celsius: number, locale?: Locale, digits?: number): string;
	TO_KILOMETERS(miles: number, locale?: Locale, digits?: number): string;
	TO_MILES(km: number, locale?: Locale, digits?: number): string;
	TO_INCHES(cm: number, locale?: Locale, digits?: number): string;
	TO_CM(inches: number, locale?: Locale, digits?: number): string;
	TO_KILOS(pounds: number, locale?: Locale, digits?: number): string;
	TO_POUNDS(kilos: number, locale?: Locale, digits?: number): string;
}

/**
 * Unit converter facade (Facade + Adapter + Singleton) built on FormatterService.
 */
export class ConverterService implements IConverterService {
	private static instance: ConverterService;
	private readonly formatter: FormatterService;

	private constructor() {
		this.formatter = FormatterService.getInstance();
	}

	public static getInstance(): ConverterService {
		if (!ConverterService.instance) {
			ConverterService.instance = new ConverterService();
		}
		return ConverterService.instance;
	}

	public TO_CELSIUS = (fahrenheit: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.FORMAT_NUMBER((fahrenheit - 32) / 1.8, locale, digits);

	public TO_FAHRENHEIT = (celsius: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.FORMAT_NUMBER(celsius * 1.8 + 32, locale, digits);

	public TO_KILOMETERS = (miles: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.FORMAT_NUMBER(miles / 0.62137, locale, digits);

	public TO_MILES = (km: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.FORMAT_NUMBER(km * 1.60934, locale, digits);

	public TO_INCHES = (cm: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.FORMAT_NUMBER(cm / 2.54, locale, digits);

	public TO_CM = (inches: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.FORMAT_NUMBER(inches * 2.54, locale, digits);

	public TO_KILOS = (pounds: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.FORMAT_NUMBER(pounds * 0.453592, locale, digits);

	public TO_POUNDS = (kilos: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.FORMAT_NUMBER(kilos / 0.453592, locale, digits);
}

// Singleton instances and destructured exports.
export const {
	TO_CELSIUS,
	TO_FAHRENHEIT,
	TO_KILOMETERS,
	TO_MILES,
	TO_INCHES,
	TO_CM,
	TO_KILOS,
	TO_POUNDS,
}: ConverterService = ConverterService.getInstance();

export const {
	FORMAT_CURRENCY,
	FORMAT_NUMBER,
	JSON_STRINGIFY,
	JSON_PARSE,
	UPPER_CASE,
	LOWER_CASE,
	CAPITALIZE,
}: FormatterService = FormatterService.getInstance();
