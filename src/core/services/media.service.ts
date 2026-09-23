import type {
	MediaSource,
	SmartVideoOptions,
	YoutubeEmbedOptions,
	YoutubeThumbnailQuality,
} from "../../types/index.js";

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID_PATTERN = /^\d{6,12}$/;
const DIRECT_FILE_PATTERN = /\.(mp4|webm|ogv|mov|m4v)(\?|#|$)/i;

/**
 * Escapes HTML special chars for safe attribute/text interpolation.
 *
 * @param value - Raw string to escape.
 * @returns Escaped string safe for HTML contexts.
 */
function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/**
 * Extracts a YouTube video id from a watch / shorts / live / embed /
 * `youtu.be` URL or a bare 11-char id. Returns `null` when not matched.
 *
 * @param input - URL or bare video id.
 * @returns The 11-char video id or `null`.
 *
 * @example
 * ```ts
 * useGetYoutubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); // "dQw4w9WgXcQ"
 * useGetYoutubeVideoId("https://youtu.be/dQw4w9WgXcQ"); // "dQw4w9WgXcQ"
 * useGetYoutubeVideoId("dQw4w9WgXcQ"); // "dQw4w9WgXcQ"
 * ```
 */
export function useGetYoutubeVideoId(input: string): string | null {
	const value = input.trim();
	if (!value) return null;
	if (YOUTUBE_ID_PATTERN.test(value)) return value;

	let url: URL;
	try {
		url = new URL(value.startsWith("http") ? value : `https://${value}`);
	} catch {
		return null;
	}

	const host = url.hostname.replace(/^www\./, "").toLowerCase();
	const path = url.pathname;

	if (host === "youtu.be") {
		const id = path.split("/").filter(Boolean)[0] ?? "";
		return YOUTUBE_ID_PATTERN.test(id) ? id : null;
	}

	if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
		const paramId = url.searchParams.get("v") ?? "";
		if (YOUTUBE_ID_PATTERN.test(paramId)) return paramId;
		const segments = path.split("/").filter(Boolean);
		const prefix = segments[0] ?? "";
		const candidate = segments[1] ?? "";
		if (["embed", "shorts", "live", "v"].includes(prefix) && YOUTUBE_ID_PATTERN.test(candidate)) {
			return candidate;
		}
	}

	return null;
}

/**
 * Extracts a Vimeo video id from a URL or bare numeric id.
 *
 * @param input - URL or bare numeric id.
 * @returns The numeric id or `null`.
 */
export function useGetVimeoVideoId(input: string): string | null {
	const value = input.trim();
	if (!value) return null;
	if (VIMEO_ID_PATTERN.test(value)) return value;
	try {
		const url = new URL(value.startsWith("http") ? value : `https://${value}`);
		if (!url.hostname.toLowerCase().includes("vimeo.com")) return null;
		const candidate = url.pathname.split("/").filter(Boolean).pop() ?? "";
		return VIMEO_ID_PATTERN.test(candidate) ? candidate : null;
	} catch {
		return null;
	}
}

/**
 * Normalizes any supported input into a {@link MediaSource}.
 * Pure and SSR-safe: no DOM, no fetch.
 *
 * @param input - YouTube/Vimeo URL or id, or direct video file URL.
 * @returns Normalized `{ provider, id, raw }`.
 *
 * @example
 * ```ts
 * useParseMediaSource("https://youtu.be/dQw4w9WgXcQ");
 * // { provider: "youtube", id: "dQw4w9WgXcQ", raw: "…" }
 * ```
 */
export function useParseMediaSource(input: string): MediaSource {
	const raw = input;
	const value = input.trim();
	const youtubeId = useGetYoutubeVideoId(value);
	if (youtubeId) return { provider: "youtube", id: youtubeId, raw };
	const vimeoId = useGetVimeoVideoId(value);
	if (vimeoId) return { provider: "vimeo", id: vimeoId, raw };
	if (DIRECT_FILE_PATTERN.test(value)) return { provider: "file", id: value, raw };
	return { provider: "unknown", id: value, raw };
}

/**
 * Builds the privacy-enhanced YouTube embed URL (`youtube-nocookie`).
 *
 * @param videoId - 11-char YouTube video id.
 * @param options - Player options (start/end/autoplay/extra params).
 * @returns Embed URL ready for `<iframe src>`.
 */
export function useBuildYoutubeEmbedUrl(
	videoId: string,
	options: YoutubeEmbedOptions = {},
): string {
	const url = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
	const params: Record<string, string> = { rel: "0" };
	if (options.autoplay) params["autoplay"] = "1";
	if (options.start !== undefined) params["start"] = String(options.start);
	if (options.end !== undefined) params["end"] = String(options.end);
	for (const [key, value] of Object.entries(options.params ?? {})) {
		params[key] = String(value);
	}
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	return url.toString();
}

/**
 * Builds the Vimeo player embed URL with privacy defaults.
 *
 * @param videoId - Numeric Vimeo video id.
 * @returns Player URL ready for `<iframe src>`.
 */
export function useBuildVimeoEmbedUrl(videoId: string): string {
	const url = new URL(`https://player.vimeo.com/video/${videoId}`);
	url.searchParams.set("dnt", "1");
	return url.toString();
}

/**
 * Builds the public YouTube thumbnail URL (no API key needed).
 *
 * @param videoId - 11-char YouTube video id.
 * @param quality - Thumbnail quality (defaults to `hqdefault`).
 * @returns Thumbnail image URL.
 */
export function useBuildYoutubeThumbnail(
	videoId: string,
	quality: YoutubeThumbnailQuality = "hqdefault",
): string {
	return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Builds the semantically correct embed HTML for any supported source.
 *
 * - Direct files (`.mp4`/`.webm`) → `<figure><video controls …>` (native).
 * - YouTube / Vimeo → `<figure><iframe …>` (embedded context), or a
 *   click-to-play facade (`<button>` + thumbnail) when `facade: true`
 *   so `.md/.mdx` posts never pay the iframe cost on load.
 *
 * Pure string builder: SSR-safe, no DOM access. Escape is applied to
 * all interpolated attributes.
 *
 * @param options - Source + a11y + presentation options.
 * @returns `{ provider, id, html }` with the ready-to-inject markup.
 *
 * @example
 * ```ts
 * const { html } = useBuildVideoEmbed({ src: "https://youtu.be/…", title: "My talk" });
 * ```
 */
export function useBuildVideoEmbed(options: SmartVideoOptions): MediaSource & { html: string } {
	const { src, title, caption, poster, className, aspect = "16/9", facade = true } = options;
	const source = useParseMediaSource(src);
	const safeTitle = escapeHtml(title);
	const safeCaption = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
	const figureClass = ["katanakit-video", className].filter(Boolean).join(" ");
	const ratio = escapeHtml(aspect);

	if (source.provider === "file") {
		const safeSrc = escapeHtml(source.id);
		const safePoster = poster ? ` poster="${escapeHtml(poster)}"` : "";
		const html =
			`<figure class="${escapeHtml(figureClass)}" style="aspect-ratio:${ratio}">` +
			`<video controls preload="metadata"${safePoster} aria-label="${safeTitle}">` +
			`<source src="${safeSrc}" />` +
			`</video>${safeCaption}</figure>`;
		return { ...source, html };
	}

	if (source.provider === "youtube" || source.provider === "vimeo") {
		const embedUrl =
			source.provider === "youtube"
				? useBuildYoutubeEmbedUrl(source.id, {
						autoplay: facade,
						...(options.youtube ?? {}),
					})
				: useBuildVimeoEmbedUrl(source.id);
		const safeEmbed = escapeHtml(embedUrl);
		const thumb =
			poster ?? (source.provider === "youtube" ? useBuildYoutubeThumbnail(source.id) : undefined);
		const safeThumb = thumb ? escapeHtml(thumb) : "";

		if (facade && safeThumb) {
			const html =
				`<figure class="${escapeHtml(figureClass)}" style="aspect-ratio:${ratio}">` +
				`<button type="button" data-video-facade="${safeEmbed}" aria-label="${safeTitle}" ` +
				`style="background-image:url('${safeThumb}')">` +
				`<span aria-hidden="true">▶</span></button>${safeCaption}</figure>`;
			return { ...source, html };
		}

		const html =
			`<figure class="${escapeHtml(figureClass)}" style="aspect-ratio:${ratio}">` +
			`<iframe src="${safeEmbed}" title="${safeTitle}" loading="lazy" ` +
			`allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ` +
			`referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>${safeCaption}</figure>`;
		return { ...source, html };
	}

	const safeSrc = escapeHtml(src);
	const html =
		`<figure class="${escapeHtml(figureClass)}" style="aspect-ratio:${ratio}">` +
		`<a href="${safeSrc}">${safeTitle}</a>${safeCaption}</figure>`;
	return { ...source, html };
}
