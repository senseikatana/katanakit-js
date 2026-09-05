import type { CurrencyFormatOptions, IConverterService, IFormatterService, Locale } from "../../types/index.js";
/**
 * Number/currency/string formatter (Adapter + Singleton) over `Intl`.
 */
export declare class FormatterService implements IFormatterService {
    private static instance;
    private constructor();
    static getInstance(): FormatterService;
    useFormatNumber: (value: number, locale?: Locale, digits?: number) => string;
    useUpperCase: (text: string, locale?: Locale) => string;
    useLowerCase: (text: string, locale?: Locale) => string;
    useCapitalize: (text: string, locale?: Locale) => string;
    useFormatCurrency: (options: CurrencyFormatOptions) => string;
    useJsonStringify: (data: unknown) => string;
    useJsonParse: <T = unknown>(json: string) => T;
}
/**
 * Unit converter facade (Facade + Adapter + Singleton) built on FormatterService.
 */
export declare class ConverterService implements IConverterService {
    private static instance;
    private readonly formatter;
    private constructor();
    static getInstance(): ConverterService;
    useToCelsius: (fahrenheit: number, locale?: Locale, digits?: number) => string;
    useToFahrenheit: (celsius: number, locale?: Locale, digits?: number) => string;
    useToKilometers: (miles: number, locale?: Locale, digits?: number) => string;
    useToMiles: (km: number, locale?: Locale, digits?: number) => string;
    useToInches: (cm: number, locale?: Locale, digits?: number) => string;
    useToCm: (inches: number, locale?: Locale, digits?: number) => string;
    useToKilos: (pounds: number, locale?: Locale, digits?: number) => string;
    useToPounds: (kilos: number, locale?: Locale, digits?: number) => string;
}
export declare const useToCelsius: (fahrenheit: number, locale?: Locale, digits?: number) => string, useToFahrenheit: (celsius: number, locale?: Locale, digits?: number) => string, useToKilometers: (miles: number, locale?: Locale, digits?: number) => string, useToMiles: (km: number, locale?: Locale, digits?: number) => string, useToInches: (cm: number, locale?: Locale, digits?: number) => string, useToCm: (inches: number, locale?: Locale, digits?: number) => string, useToKilos: (pounds: number, locale?: Locale, digits?: number) => string, useToPounds: (kilos: number, locale?: Locale, digits?: number) => string;
export declare const useFormatCurrency: (options: CurrencyFormatOptions) => string, useFormatNumber: (value: number, locale?: Locale, digits?: number) => string, useJsonStringify: (data: unknown) => string, useJsonParse: <T = unknown>(json: string) => T, useUpperCase: (text: string, locale?: Locale) => string, useLowerCase: (text: string, locale?: Locale) => string, useCapitalize: (text: string, locale?: Locale) => string;
//# sourceMappingURL=formatter.service.d.ts.map