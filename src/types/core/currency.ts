import type { z } from "zod";

import { LocaleSchema } from "@/schemas/common.schema.js";
import {
	CurrencyConversionSchema,
	CurrencyConvertOptionsSchema,
	CurrencyFormatOptionsSchema,
	CurrencyRateSnapshotSchema,
	CurrencySchema,
	NumberFormatOptionsSchema,
	SalePriceOptionsSchema,
} from "@/schemas/core.schema.js";

export type Locale = z.infer<typeof LocaleSchema>;

export type Currency = z.infer<typeof CurrencySchema>;

export type CurrencyFormatOptions = z.infer<typeof CurrencyFormatOptionsSchema>;

export type NumberFormatOptions = z.infer<typeof NumberFormatOptionsSchema>;

export type SalePriceOptions = z.infer<typeof SalePriceOptionsSchema>;

/** Input for a currency conversion between two ISO currencies. */
export type CurrencyConvertOptions = z.infer<typeof CurrencyConvertOptionsSchema>;

/** A dated snapshot of exchange rates quoted against one base currency. */
export type CurrencyRateSnapshot = z.infer<typeof CurrencyRateSnapshotSchema>;

/** Result of a currency conversion: the math plus the rate and date it came from. */
export type CurrencyConversion = z.infer<typeof CurrencyConversionSchema>;

/** Result of {@link useSalePrice}: the regular price, the discounted price and the rounded percentage taken off. */
export interface SalePrice {
	/** Regular price, echoed back for display. */
	price: number;
	/** Price after the discount, unrounded — let the currency formatter own the digits. */
	salePrice: number;
	/** Percentage taken off, rounded to two decimals (e.g. `40`, `12.5`). */
	percentOff: number;
}
