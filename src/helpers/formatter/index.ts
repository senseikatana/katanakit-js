// types.ts (Simulación de interfaces seguras)
export type LocaleTypes = "en" | "es" | "fr" | "de";

export interface NumberFormatOptions {
	locale?: LocaleTypes;
	digits?: number;
}

export interface CurrencyFormatOptions {
	amount?: number;
	taxes?: number;
	currency?: "EUR" | "USD" | "MXD";
	locale?: LocaleTypes;
}

// 1. Interfaz de Contrato
export interface IFormatterService {
	formatNumber(value: number, options?: NumberFormatOptions): string;
	upperCase(text: string, locale?: LocaleTypes): string;
	lowerCase(text: string, locale?: LocaleTypes): string;
	capitalize(text: string, locale?: LocaleTypes): string;
	formatCurrency(options: CurrencyFormatOptions[]): string;
	toJson(data: unknown): string;
	fromJson<T = unknown>(json: string): T;
}

// 2. Implementación Facade + Singleton
export class FormatterService implements IFormatterService {
	private static instance: FormatterService;

	// Constructor privado obligatorio para Singleton
	private constructor() {}

	public static getInstance(): FormatterService {
		if (!FormatterService.instance) {
			FormatterService.instance = new FormatterService();
		}
		return FormatterService.instance;
	}

	// Métodos implementados como arrow functions para permitir desestructuración segura
	public FORMAT_NUMBER = (
		value: number = 0,
		locale: NumberFormatOptions["locale"] = "en",
		digits: NumberFormatOptions["digits"] = 2,
	): string => {
		//
		return new Intl.NumberFormat(locale, {
			maximumFractionDigits: digits,
			minimumFractionDigits: digits,
		}).format(value);
	};

	public upperCase = (text: string, locale: LocaleTypes = "en"): string => {
		return text.toLocaleUpperCase(locale).trim();
	};

	public lowerCase = (text: string, locale: LocaleTypes = "en"): string => {
		return text.toLocaleLowerCase(locale).trim();
	};

	public capitalize = (text: string, locale: LocaleTypes = "en"): string => {
		const trimmed = text.trim();
		if (!trimmed) return "";
		return trimmed.charAt(0).toLocaleUpperCase(locale) + trimmed.slice(1);
	};

	public formatCurrency = (options: CurrencyFormatOptions = {}): string => {
		const { amount = 0, taxes = 0, currency = "USD", locale = "en" } = options;
		// Si taxes es decimal (ej. 0.21) o porcentaje (ej. 21)
		const taxRate = taxes > 1 ? taxes / 100 : taxes;
		const total = amount * (1 + taxRate);

		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
		}).format(total);
	};

	public toJson = (data: unknown): string => {
		return JSON.stringify(data, null, 3);
	};

	public fromJson = <T = unknown>(json: string): T => {
		return JSON.parse(json) as T;
	};
}

export const { capitalize, formatCurrency }: FormatterService =
	FormatterService.getInstance();

formatCurrency({
	amount: 2000,
	currency: "EUR",
});

console.log();
