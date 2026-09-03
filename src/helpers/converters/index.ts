// services/ConverterService.ts

// ============================================================
// 1. TIPOS DECLARADOS LOCALMENTE (AMPLIADOS Y CORREGIDOS)
// ============================================================

export type LocaleTypes = "en" | "es" | "fr" | "de" | "it" | "pt" | "ja" | "zh";
export type Digits = number;

// Divisas estándar ISO 4217 admitidas por Intl.NumberFormat
export type CurrencyCode =
	| "EUR" // Euro
	| "USD" // Dólar estadounidense
	| "GBP" // Libra esterlina
	| "JPY" // Yen japonés
	| "CAD" // Dólar canadiense
	| "MXN" // Peso mexicano
	| "CHF" // Franco suizo
	| "AUD" // Dólar australiano
	| "BRL" // Real brasileño
	| "CNY" // Yuan chino
	| "ARS" // Peso argentino
	| "COP" // Peso colombiano
	| "CLP"; // Peso chileno

export interface CurrencyFormatOptions {
	currency: CurrencyCode;
	amount: number;
	taxes?: number;
	locale?: LocaleTypes;
}

export interface NumberFormatOptions {
	locale?: LocaleTypes;
	digits?: Digits;
}

// ============================================================
// 2. FORMATEADOR INTERNO (ADAPTER + SINGLETON)
// ============================================================

export interface IFormatterService {
	CAPITALIZE(text: string, locale?: LocaleTypes): string;
	FORMAT_CURRENCY(options: CurrencyFormatOptions): string;
	FORMAT_NUMBER(value: number, locale?: LocaleTypes, digits?: Digits): string;
	JSON_PARSE<T = unknown>(json: string): T;
	JSON_STRINGIFY(data: unknown): string;
	LOWER_CASE(text: string, locale?: LocaleTypes): string;
	UPPER_CASE(text: string, locale?: LocaleTypes): string;
}

export class FormatterService implements IFormatterService {
	private static instance: FormatterService;

	private constructor() {}

	public static getInstance(): FormatterService {
		if (!FormatterService.instance) {
			FormatterService.instance = new FormatterService();
		}
		return FormatterService.instance;
	}

	public FORMAT_NUMBER = (
		value: number,
		locale: LocaleTypes = "en",
		digits: Digits = 2,
	): string => {
		return new Intl.NumberFormat(locale, {
			maximumFractionDigits: digits,
			minimumFractionDigits: digits,
		}).format(value);
	};

	public UPPER_CASE = (text: string, locale: LocaleTypes = "en"): string => {
		return text.toLocaleUpperCase(locale).trim();
	};

	public LOWER_CASE = (text: string, locale: LocaleTypes = "en"): string => {
		return text.toLocaleLowerCase(locale).trim();
	};

	public CAPITALIZE = (text: string, locale: LocaleTypes = "en"): string => {
		const trimmed = text.trim();
		if (!trimmed) return "";
		return trimmed.charAt(0).toLocaleUpperCase(locale) + trimmed.slice(1);
	};

	public FORMAT_CURRENCY = (options: CurrencyFormatOptions): string => {
		const { currency, amount, taxes = 0, locale = "en" } = options;
		const taxRate = taxes > 1 ? taxes / 100 : taxes;
		const total = amount * (1 + taxRate);

		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
		}).format(total);
	};

	public JSON_STRINGIFY = (data: unknown): string => {
		return JSON.stringify(data, null, 3);
	};

	public JSON_PARSE = <T = unknown>(json: string): T => {
		return JSON.parse(json) as T;
	};
}

// ============================================================
// 3. CONTRATO DE CONVERTER (INTERFAZ)
// ============================================================

export interface IConverterService {
	TO_CELSIUS(fahrenheit: number, locale?: LocaleTypes, digits?: Digits): string;
	TO_FAHRENHEIT(celsius: number, locale?: LocaleTypes, digits?: Digits): string;
	TO_KILOMETERS(miles: number, locale?: LocaleTypes, digits?: Digits): string;
	TO_MILES(km: number, locale?: LocaleTypes, digits?: Digits): string;
	TO_INCHES(cm: number, locale?: LocaleTypes, digits?: Digits): string;
	TO_CM(inches: number, locale?: LocaleTypes, digits?: Digits): string;
	TO_KILOS(pounds: number, locale?: LocaleTypes, digits?: Digits): string;
	TO_POUNDS(kilos: number, locale?: LocaleTypes, digits?: Digits): string;
}

// ============================================================
// 4. FACHADA PRINCIPAL (FACADE + ADAPTER + SINGLETON)
// ============================================================

export class ConverterService implements IConverterService {
	private static instance: ConverterService;
	private readonly formatter: FormatterService;

	private constructor() {
		this.formatter = FormatterService.getInstance();
	}

	// Corrección Singleton: creación condicional perezosa y retorno de la instancia única
	public static getInstance(): ConverterService {
		if (!ConverterService.instance) {
			ConverterService.instance = new ConverterService();
		}
		return ConverterService.instance;
	}

	// ─── Temperatura ────────────────────────────────────────────

	public TO_CELSIUS = (
		fahrenheit: number,
		locale: LocaleTypes = "en",
		digits: Digits = 2,
	): string => {
		return this.formatter.FORMAT_NUMBER(
			(fahrenheit - 32) / 1.8,
			locale,
			digits,
		);
	};

	public TO_FAHRENHEIT = (
		celsius: number,
		locale: LocaleTypes = "en",
		digits: Digits = 2,
	): string => {
		return this.formatter.FORMAT_NUMBER(celsius * 1.8 + 32, locale, digits);
	};

	// ─── Distancia ──────────────────────────────────────────────

	public TO_KILOMETERS = (
		miles: number,
		locale: LocaleTypes = "en",
		digits: Digits = 2,
	): string => {
		return this.formatter.FORMAT_NUMBER(miles / 0.62137, locale, digits);
	};

	public TO_MILES = (
		km: number,
		locale: LocaleTypes = "en",
		digits: Digits = 2,
	): string => {
		return this.formatter.FORMAT_NUMBER(km * 1.60934, locale, digits);
	};

	public TO_INCHES = (
		cm: number,
		locale: LocaleTypes = "en",
		digits: Digits = 2,
	): string => {
		return this.formatter.FORMAT_NUMBER(cm / 2.54, locale, digits);
	};

	public TO_CM = (
		inches: number,
		locale: LocaleTypes = "en",
		digits: Digits = 2,
	): string => {
		return this.formatter.FORMAT_NUMBER(inches * 2.54, locale, digits);
	};

	// ─── Peso ───────────────────────────────────────────────────

	public TO_KILOS = (
		pounds: number,
		locale: LocaleTypes = "en",
		digits: Digits = 2,
	): string => {
		return this.formatter.FORMAT_NUMBER(pounds * 0.453592, locale, digits);
	};

	public TO_POUNDS = (
		kilos: number,
		locale: LocaleTypes = "en",
		digits: Digits = 2,
	): string => {
		return this.formatter.FORMAT_NUMBER(kilos / 0.453592, locale, digits);
	};
}

export const { TO_CELSIUS, TO_FAHRENHEIT }: ConverterService =
	ConverterService.getInstance();

export const { FORMAT_CURRENCY, JSON_STRINGIFY, JSON_PARSE }: FormatterService =
	FormatterService.getInstance();

export const user = [
	{
		id: 1,
		name: "John Doe",
	},
];

const name: string = "Jane Done";

FORMAT_CURRENCY({
	amount: 2000,
	currency: "EUR",
	taxes: 21,
	locale: "en",
});

JSON_STRINGIFY(user);
JSON_PARSE(name);

console.log(TO_FAHRENHEIT(30, "en", 2));
