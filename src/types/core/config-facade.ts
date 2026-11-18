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

/**
 * Section keys `defineApiConfig` reads as Options-API-style groups instead of
 * flat entries. They are never copied onto `config` and never registered as
 * APIs.
 */
export type ApiConfigSectionKey = "apis" | "data" | "onInit" | "methods";

/** The props/booleans half of a `define*Config` literal — the config data. */
export type ConfigData<T> = Omit<T, ConfigMethodKeys<T> | ApiConfigSectionKey>;

/** The flat methods half of a `define*Config` literal. */
export type ConfigMethodEntries<T> = Pick<T, Exclude<ConfigMethodKeys<T>, ApiConfigSectionKey>>;

/**
 * Methods declared in the `methods: {}` section, merged flat onto the facade
 * alongside any top-level methods. Absent when the literal declares none.
 */
export type ApiConfigNestedMethods<T> = T extends { methods: infer M } ? M : unknown;

/**
 * State declared by the `data()` section — the return type of that factory.
 * Absent when the literal declares no `data`, matching the runtime facade.
 */
export type ApiConfigStateEntry<T> = T extends { data: () => infer S } ? { data: S } : unknown;

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
} & ConfigMethodEntries<T> &
	ApiConfigNestedMethods<T> &
	ApiConfigStateEntry<T>;

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
 * Values accepted by {@link defineApiConfig} as a flat entry: an {@link ApiEntry},
 * a boolean flag (kept on `config` only — never registered as an API) or a
 * method.
 */
export type ApiConfigValue = ApiEntry | boolean | ConfigMethod;
