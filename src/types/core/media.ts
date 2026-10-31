import type { z } from "zod";

import {
	MediaProviderSchema,
	MediaSourceSchema,
	SmartVideoOptionsSchema,
	YoutubeEmbedOptionsSchema,
	YoutubeThumbnailQualitySchema,
} from "@/schemas/media.schema.js";

/** Where a media source comes from. `file` = direct mp4/webm (native `<video>`). */
export type MediaProvider = z.infer<typeof MediaProviderSchema>;

/** Normalized media source: provider + stable id or direct src. */
export type MediaSource = z.infer<typeof MediaSourceSchema>;

/** Options for the YouTube nocookie embed URL. */
export type YoutubeEmbedOptions = z.infer<typeof YoutubeEmbedOptionsSchema>;

/** Thumbnail quality for `i.ytimg.com`. */
export type YoutubeThumbnailQuality = z.infer<typeof YoutubeThumbnailQualitySchema>;

/** Input for {@link useBuildVideoEmbed} (core) — one `src`, unified output. */
export type SmartVideoOptions = z.infer<typeof SmartVideoOptionsSchema>;
