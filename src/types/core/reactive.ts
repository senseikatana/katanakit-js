export type SignalListener<T> = (newValue: T, oldValue: T) => void;

export interface Subscribable<T> {
	useSubscribe: (listener: SignalListener<T>) => () => void;
}

export interface SignalGetter<T> extends Subscribable<T> {
	(): T;
}

export type SignalSetter<T> = (newValue: T | ((prev: T) => T)) => void;

export interface ToggleSignalSetter {
	useSet: (value: boolean) => void;
	useToggle: () => void;
}

/** Contract of the reactive facade. */
export interface IReactiveService {
	useCreateSignal<T>(initialValue: T): [SignalGetter<T>, SignalSetter<T>];
	useCreateEffect(
		callback: () => void | (() => void),
		signals?: Subscribable<unknown>[],
	): () => void;
	useCreateMemo<T>(computation: () => T, signals?: Subscribable<unknown>[]): SignalGetter<T>;
	useCreateToggle(initialValue?: boolean): [SignalGetter<boolean>, ToggleSignalSetter];
	useCreateDebouncedSignal<T>(
		initialValue: T,
		delayMs?: number,
	): [SignalGetter<T>, SignalSetter<T> & { useCancel: () => void }];
	useCreateBatch(): (callback: () => void) => void;
}
