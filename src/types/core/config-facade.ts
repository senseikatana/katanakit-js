import type { ApiEntry } from "./http.js";

/**
 * Any method a consumer declares inline in a `define*Config` literal.
 * Written with `function` (never an arrow) so `this` resolves to the facade.
 */
export type ConfigMethod = (...args: never[]) => unknown;

/**
 * Keys of `T` whose value is a {@link ConfigMethod}. Methods declared as
 * optional are still detected (`NonNullable`), so they are split out of the
 * config half rather than leaking into it.
 */
export type ConfigMethodKeys<T> = {
	[K in keyof T]-?: NonNullable<T[K]> extends ConfigMethod ? K : never;
}[keyof T];

/** The props/booleans half of a `define*Config` literal — the config data. */
export type ConfigData<T> = Omit<T, ConfigMethodKeys<T>>;

/** The methods half of a `define*Config` literal. */
export type ConfigMethodEntries<T> = Pick<T, ConfigMethodKeys<T>>;

/**
 * What every `define*Config` returns: the registered config under `config`,
 * plus the methods declared alongside it so `this.config` resolves inside them.
 *
 * @typeParam T - The literal passed to the `define*Config` call.
 *
 * @example
 * ```ts
 * const api = defineApiConfig({
 *   pokeapi: { baseUri: "…", endpoints: { users: "/users" } },
 *   debug: true,
 *   getUsers: async function () {
 *     return this.config.debug;
 *   },
 * });
 *
 * api.config.pokeapi; // ApiEntry
 * await api.getUsers();
 * ```
 */
export type ConfigFacade<T> = {
	/** Props and booleans declared in the literal (methods stripped out). */
	config: ConfigData<T>;
} & ConfigMethodEntries<T>;

/**
 * Constrains every non-method entry of a `define*Config` literal to `V`, while
 * leaving method entries untouched. Pair with `NoInfer<T>` in the signature so
 * it validates without stealing inference from the literal.
 *
 * @typeParam T - The literal being validated.
 * @typeParam V - The type every non-method value must satisfy.
 */
export type ConfigValues<T, V> = {
	[K in keyof T]: K extends ConfigMethodKeys<T> ? T[K] : V;
};

/**
 * Values accepted by {@link defineApiConfig}: an {@link ApiEntry}, a boolean
 * flag (kept on `config` only — never registered as an API) or a method.
 */
export type ApiConfigValue = ApiEntry | boolean | ConfigMethod;

/* -------------------------------------------------------------------------- */
