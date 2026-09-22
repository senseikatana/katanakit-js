import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { LoadContext } from "@docusaurus/types";
import typedocPlugin from "docusaurus-plugin-typedoc";

type TypedocOptions = Parameters<typeof typedocPlugin>[1];

const FENCE = /^\s*(```|~~~)/;

/** Escape `{` and `}` outside code fences and inline code so MDX treats them as text. */
export function escapeBraces(markdown: string): string {
	let inFence = false;
	let inlineDelimiter = 0;
	return markdown
		.split("\n")
		.map((line) => {
			if (FENCE.test(line)) {
				inFence = !inFence;
				return line;
			}
			if (inFence) return line;
			let out = "";
			for (let i = 0; i < line.length; i += 1) {
				const char = line[i];
				if (char === "`") {
					let run = 1;
					while (line[i + run] === "`") run += 1;
					if (inlineDelimiter === 0) inlineDelimiter = run;
					else if (run >= inlineDelimiter) inlineDelimiter = 0;
					out += line.slice(i, i + run);
					i += run - 1;
					continue;
				}
				if (!inlineDelimiter && (char === "{" || char === "}") && line[i - 1] !== "\\") {
					out += `\\${char}`;
					continue;
				}
				out += char;
			}
			return out;
		})
		.join("\n");
}

function markdownFiles(dir: string): string[] {
	if (!existsSync(dir)) return [];
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return markdownFiles(path);
		return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
	});
}

/**
 * Wraps `docusaurus-plugin-typedoc` to escape braces in the generated API
 * markdown. TypeDoc copies comments from external `.d.ts` files (for example
 * TanStack's `@deprecated` notes) that contain `{ ... }`, which MDX parses as
 * a JavaScript expression and fails to compile.
 */
export default async function typedocPluginWithEscapedApiDocs(
	context: LoadContext,
	options: TypedocOptions,
) {
	const plugin = await typedocPlugin(context, options);
	const out = join(context.siteDir, String(options?.out ?? "./content/api"));
	for (const file of markdownFiles(out)) {
		const source = readFileSync(file, "utf8");
		const escaped = escapeBraces(source);
		if (escaped !== source) writeFileSync(file, escaped);
	}
	return plugin;
}
