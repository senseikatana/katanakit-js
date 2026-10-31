import type {
	WatchCallback as VueWatchCallback,
	WatchOptions as VueWatchOptions,
	WatchSource as VueWatchSource,
	WatchStopHandle as VueWatchStopHandle,
} from "vue";

/**
 * Watch source taken from the native Vue `watch` (`ref`, reactive object,
 * getter function or array of those).
 */
export type WatchSource<T = unknown> = VueWatchSource<T>;

/**
 * Watch callback taken from the native Vue `watch`. Any internal function
 * is accepted: sync or async, with `(newValue, oldValue)` args or with no
 * args at all (e.g. `() => checkValidations()`).
 */
export type WatchCallback<V = unknown, OV = unknown> = VueWatchCallback<V, OV>;

/**
 * Watch options taken from the native Vue `watch`. `deep` defaults to
 * `true` in `useKatanaWatch`.
 */
export type WatchOptions = VueWatchOptions;

/** Stop function taken from the native Vue `watch`. */
export type WatchStopHandle = VueWatchStopHandle;
