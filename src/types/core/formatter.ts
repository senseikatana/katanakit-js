import type { CurrencyFormatOptions, Locale, SalePrice, SalePriceOptions } from "./currency.js";

/** Contract of the formatter facade. */
export interface IFormatterService {
	useCapitalize(text: string, locale?: Locale): string;
	useFormatCurrency(options: CurrencyFormatOptions): string;
	useFormatNumber(value: number, locale?: Locale, digits?: number): string;
	useSalePrice(options: SalePriceOptions): SalePrice;
	useJsonParse<T = unknown>(json: string): T;
	useJsonStringify(data: unknown): string;
	useLowerCase(text: string, locale?: Locale): string;
	useUpperCase(text: string, locale?: Locale): string;
}

/** Contract of the unit converter facade. */
export interface IConverterService {
	useToCelsius(fahrenheit: number, locale?: Locale, digits?: number): string;
	useToFahrenheit(celsius: number, locale?: Locale, digits?: number): string;
	useToKilometers(miles: number, locale?: Locale, digits?: number): string;
	useToMiles(km: number, locale?: Locale, digits?: number): string;
	useToInches(cm: number, locale?: Locale, digits?: number): string;
	useToCm(inches: number, locale?: Locale, digits?: number): string;
	useToKilos(pounds: number, locale?: Locale, digits?: number): string;
	useToPounds(kilos: number, locale?: Locale, digits?: number): string;
}
