import type { IThemeService, ThemeMode, ThemeOptions } from "../../types/index.js";
/**
 * Theme facade (Singleton) over the DOM and Storage, with a media-query listener.
 */
export declare class ThemeService implements IThemeService {
    private static instance;
    private mode;
    private storageKey;
    private attribute;
    private target;
    private onChange?;
    private mediaQuery;
    private cleanMediaQueryListener;
    private constructor();
    static getInstance(): ThemeService;
    private IS_BROWSER;
    useInitTheme: (options?: ThemeOptions) => void;
    useSetThemeMode: (mode: ThemeMode) => void;
    useGetThemeMode: () => ThemeMode;
    useGetResolved: () => "light" | "dark";
    usePrefersColorScheme: () => boolean;
    useToggleTheme: () => void;
    useResetTheme: () => void;
    useDestroyTheme: () => void;
    private APPLY_THEME;
    private SETUP_MEDIA_QUERY_LISTENER;
}
export declare const THEME_SERVICE: ThemeService;
export declare const useInitTheme: (options?: ThemeOptions) => void, useSetThemeMode: (mode: ThemeMode) => void, useGetThemeMode: () => ThemeMode, useGetResolved: () => "light" | "dark", usePrefersColorScheme: () => boolean, useToggleTheme: () => void, useResetTheme: () => void, useDestroyTheme: () => void;
//# sourceMappingURL=theme.service.d.ts.map