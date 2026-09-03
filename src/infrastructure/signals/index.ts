import { LOGGER } from "@/helpers";
import { GET_ROOT, SET_ATTRIBUTE } from "../dom-api/dom";
import { CREATE_EFFECT } from "./reactive.service";

// Signal de preferencia persistente

// Signal derivado (Computed): Transforma "system" a "light" o "dark"
const resolvedTheme = CREATE_MEMO<"light" | "dark">(() => {
	const current = themePreference();
	if (current !== "system") return current;
	return PREFERS_COLOR_SCHEME() ? "dark" : "light";
}, [themePreference]);

// Efecto que reacciona a los cambios en el DOM
CREATE_EFFECT(() => {
	LOGGER("Preferencia guardada:", themePreference()); // 'system', 'light' o 'dark'
	LOGGER("Color visual aplicado:", resolvedTheme()); // 'light' o 'dark'

	SET_ATTRIBUTE(GET_ROOT, "data-theme", resolvedTheme);
}, [resolvedTheme]);
