import type { TailwindTheme, ColorScale } from "./types.js";

/** Sky/blue accent color scale for the docs site. */
const accentScale: ColorScale = {
	50: "#f0f9ff",
	100: "#e0f2fe",
	200: "#bae6fd",
	300: "#7dd3fc",
	400: "#38bdf8",
	500: "#0ea5e9",
	600: "#0284c7",
	700: "#0369a1",
	800: "#075985",
	900: "#0c4a6e",
	950: "#082f49",
};

/** Slate/gray neutral color scale. */
const grayScale: ColorScale = {
	50: "#f8fafc",
	100: "#f1f5f9",
	200: "#e2e8f0",
	300: "#cbd5e1",
	400: "#94a3b8",
	500: "#64748b",
	600: "#475569",
	700: "#334155",
	800: "#1e293b",
	900: "#0f172a",
	950: "#020617",
};

/** Tailwind theme for the docs site. */
export const tailwindTheme: TailwindTheme = {
	accent: accentScale,
	gray: grayScale,
	sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
	mono: "'JetBrains Mono', ui-monospace, monospace",
};
