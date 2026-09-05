import { defineConfig } from "astro/config";
import lotus from "@prosefly/astro-theme-lotus";

export default defineConfig({
	site: "https://senseikatana.github.io",
	base: "/katanakit-js",
	integrations: [lotus()],
});
