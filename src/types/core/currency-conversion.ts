import type {
	Currency,
	CurrencyConversion,
	CurrencyConvertOptions,
	CurrencyRateSnapshot,
} from "./currency.js";
import type { ApiError, SafeResult } from "./http.js";

/**
 * Port for fetching exchange rates from an external source.
 *
 * Lives at the hexagonal boundary: implementations perform the runtime I/O
 * (`src/infrastructure/`), while the core only depends on this contract.
 * Implementations **never throw** — every failure comes back as a
 * {@link SafeResult}, so the facade keeps its no-throw promise whatever
 * provider is plugged in.
 */
export interface ICurrencyRateProvider {
	/**
	 * Returns a dated rate snapshot quoted against `base`.
	 *
	 * @param base - Currency the rates are quoted against.
	 * @param quotes - Optional subset of quote currencies. Omit for every rate the source knows.
	 * @returns `{ data, error, ok }` with the snapshot or the source failure.
	 */
	useFetchRates(base: Currency, quotes?: Currency[]): Promise<SafeResult<CurrencyRateSnapshot>>;
}

/**
 * Observer callbacks fired by {@link ICurrencyConverterService}.
 *
 * Event handlers are the one surface allowed outside the `use*` convention:
 * `on*` marks a **callback invoked by the service**, never a method you call
 * imperatively. Every handler is optional.
 */
export interface CurrencyRateEvents {
	/** Fired after a rate snapshot has been stored in cache. */
	onRatesUpdate?(snapshot: CurrencyRateSnapshot): void;
	/** Fired when a rate fetch fails. */
	onRatesError?(error: ApiError): void;
}

/** Wiring options for {@link CurrencyConverterService} (dependency injection). */
export interface CurrencyConverterServiceOptions {
	/** Rate source. Defaults to the service's own provider. */
	provider?: ICurrencyRateProvider;
	/** Cache time-to-live in milliseconds. Defaults to 10 minutes. */
	ttlMs?: number;
	/**
	 * Currency every rate is quoted against before a pair is resolved by
	 * division. Defaults to `"USD"`.
	 *
	 * Sources round their quotes (Frankfurter keeps 5 decimal places), so a
	 * small quote such as `KRW → USD` is starved of significant digits. Quoting
	 * everything against one pivot and dividing keeps the precision on the side
	 * of the pair that is well conditioned.
	 */
	pivot?: Currency;
}

/** Contract of the currency conversion facade. */
export interface ICurrencyConverterService {
	useConvert(options: CurrencyConvertOptions): Promise<SafeResult<CurrencyConversion>>;
	useGetRate(from: Currency, to: Currency): Promise<SafeResult<number>>;
	useRefreshRates(): Promise<SafeResult<CurrencyRateSnapshot>>;
	useGetSnapshot(): CurrencyRateSnapshot | null;
	useSubscribe(events: CurrencyRateEvents): () => void;
}
