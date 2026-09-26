import DefaultTheme from "vitepress/theme";

import "@katanakit/ui/styles.css";
import "./style.css";

/**
 * Mirrors VitePress' dark mode into the `data-theme` contract that
 * katanakit-css and the KatanaKit `ThemeService` use, so every component demo
 * follows the site theme toggle.
 */
export default {
	extends: DefaultTheme,
	enhanceApp() {
		if (typeof document === "undefined") return;
		const root = document.documentElement;
		const sync = () => {
			root.dataset.theme = root.classList.contains("dark") ? "dark" : "light";
		};
		sync();
		new MutationObserver(sync).observe(root, {
			attributes: true,
			attributeFilter: ["class"],
		});
	},
};
