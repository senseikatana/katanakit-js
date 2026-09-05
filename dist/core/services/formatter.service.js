/**
 * Number/currency/string formatter (Adapter + Singleton) over `Intl`.
 */
export class FormatterService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!FormatterService.instance) {
            FormatterService.instance = new FormatterService();
        }
        return FormatterService.instance;
    }
    useFormatNumber = (value, locale = "en", digits = 2) => {
        return new Intl.NumberFormat(locale, {
            maximumFractionDigits: digits,
            minimumFractionDigits: digits,
        }).format(value);
    };
    useUpperCase = (text, locale = "en") => text.toLocaleUpperCase(locale).trim();
    useLowerCase = (text, locale = "en") => text.toLocaleLowerCase(locale).trim();
    useCapitalize = (text, locale = "en") => {
        const trimmed = text.trim();
        if (!trimmed)
            return "";
        return trimmed.charAt(0).toLocaleUpperCase(locale) + trimmed.slice(1);
    };
    useFormatCurrency = (options) => {
        const { amount, currency = "USD", taxes = 0, locale = "en" } = options;
        // `taxes` may be a percentage (21) or a decimal fraction (0.21).
        const taxRate = taxes > 1 ? taxes / 100 : taxes;
        const total = amount * (1 + taxRate);
        return new Intl.NumberFormat(locale, { style: "currency", currency }).format(total);
    };
    useJsonStringify = (data) => JSON.stringify(data, null, 3);
    useJsonParse = (json) => JSON.parse(json);
}
/**
 * Unit converter facade (Facade + Adapter + Singleton) built on FormatterService.
 */
export class ConverterService {
    static instance;
    formatter;
    constructor() {
        this.formatter = FormatterService.getInstance();
    }
    static getInstance() {
        if (!ConverterService.instance) {
            ConverterService.instance = new ConverterService();
        }
        return ConverterService.instance;
    }
    useToCelsius = (fahrenheit, locale = "en", digits = 2) => this.formatter.useFormatNumber((fahrenheit - 32) / 1.8, locale, digits);
    useToFahrenheit = (celsius, locale = "en", digits = 2) => this.formatter.useFormatNumber(celsius * 1.8 + 32, locale, digits);
    useToKilometers = (miles, locale = "en", digits = 2) => this.formatter.useFormatNumber(miles / 0.62137, locale, digits);
    useToMiles = (km, locale = "en", digits = 2) => this.formatter.useFormatNumber(km * 1.60934, locale, digits);
    useToInches = (cm, locale = "en", digits = 2) => this.formatter.useFormatNumber(cm / 2.54, locale, digits);
    useToCm = (inches, locale = "en", digits = 2) => this.formatter.useFormatNumber(inches * 2.54, locale, digits);
    useToKilos = (pounds, locale = "en", digits = 2) => this.formatter.useFormatNumber(pounds * 0.453592, locale, digits);
    useToPounds = (kilos, locale = "en", digits = 2) => this.formatter.useFormatNumber(kilos / 0.453592, locale, digits);
}
// Singleton instances and destructured exports.
export const { useToCelsius, useToFahrenheit, useToKilometers, useToMiles, useToInches, useToCm, useToKilos, useToPounds, } = ConverterService.getInstance();
export const { useFormatCurrency, useFormatNumber, useJsonStringify, useJsonParse, useUpperCase, useLowerCase, useCapitalize, } = FormatterService.getInstance();
//# sourceMappingURL=formatter.service.js.map