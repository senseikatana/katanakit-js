import type { z } from "zod";

import { ThemeModeSchema } from "@/schemas/common.schema.js";

export type ThemeMode = z.infer<typeof ThemeModeSchema>;

export interface ThemeOptions {
	defaultMode?: ThemeMode;
	storageKey?: string;
	attribute?: string;
	target?: HTMLElement;
	onChange?: (mode: ThemeMode, resolved: "light" | "dark") => void;
}

/** Contract of the theme facade. */
export interface IThemeService {
	useInitTheme(options?: ThemeOptions): void;
	useSetThemeMode(mode: ThemeMode): void;
	useGetThemeMode(): ThemeMode;
	useGetResolved(): "light" | "dark";
	usePrefersColorScheme(): boolean;
	useToggleTheme(): void;
	useResetTheme(): void;
	useDestroyTheme(): void;
}
