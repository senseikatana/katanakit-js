import type { z } from "zod";

import {
	YoutubeApiConfigSchema,
	YoutubeChannelsResponseSchema,
	YoutubeListParamsSchema,
	YoutubePlaylistItemsResponseSchema,
	YoutubeVideoNormalizedSchema,
	YoutubeVideoPageSchema,
	YoutubeVideosResponseSchema,
	YoutubeVideoThumbnailsSchema,
} from "@/schemas/youtube.schema.js";

/** Config for the YouTube service. One GCP project serves all repos. */
export type YoutubeApiConfig = z.infer<typeof YoutubeApiConfigSchema>;

/** Params for {@link useGetChannelVideos}. */
export type YoutubeListParams = z.infer<typeof YoutubeListParamsSchema>;

/** Resolution-keyed thumbnails (all derivable without an API key). */
export type YoutubeVideoThumbnails = z.infer<typeof YoutubeVideoThumbnailsSchema>;

/** Normalized video, enriched with player-ready URLs. */
export type YoutubeVideoNormalized = z.infer<typeof YoutubeVideoNormalizedSchema>;

/** Paginated channel listing result. */
export type YoutubeVideoPage = z.infer<typeof YoutubeVideoPageSchema>;

/** Minimal `channels.list` shape (only what the service reads). */
export type YoutubeChannelsResponse = z.infer<typeof YoutubeChannelsResponseSchema>;

/** Minimal `playlistItems.list` shape (only what the service reads). */
export type YoutubePlaylistItemsResponse = z.infer<typeof YoutubePlaylistItemsResponseSchema>;

/** Minimal `videos.list` shape (only what the service reads). */
export type YoutubeVideosResponse = z.infer<typeof YoutubeVideosResponseSchema>;
