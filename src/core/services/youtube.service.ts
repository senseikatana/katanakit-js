import type {
	FetchResult,
	YoutubeApiConfig,
	YoutubeChannelsResponse,
	YoutubeListParams,
	YoutubePlaylistItemsResponse,
	YoutubeVideoNormalized,
	YoutubeVideoPage,
	YoutubeVideosResponse,
} from "../../types/index.js";
import { useGet, useInitApis } from "./http.service.js";
import { useBuildYoutubeEmbedUrl, useBuildYoutubeThumbnail } from "./media.service.js";

/** Registry key for the YouTube Data API v3. */
const YOUTUBE_API_NAME = "youtube";
/** Registry key for the public channel RSS feed (no key needed). */
const YOUTUBE_FEED_API_NAME = "youtubeFeed";
const YOUTUBE_BASE_URI = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_FEED_BASE_URI = "https://www.youtube.com";

/** Module-level config. One GCP project serves every repo. */
let youtubeConfig: YoutubeApiConfig = { apiKey: "", channelId: "" };

/**
 * Registers the YouTube APIs (`youtube` + keyless `youtubeFeed`) and
 * stores the default channel. Call once per app, server/build-time —
 * the API key must never ship to the browser.
 *
 * @param config - API key + default channel id.
 *
 * @example
 * ```ts
 * useInitYoutube({ apiKey: process.env.YOUTUBE_API_KEY!, channelId: "UC…" });
 * const page = await useGetChannelVideos({ maxResults: 6 });
 * ```
 */
export function useInitYoutube(config: YoutubeApiConfig): void {
	youtubeConfig = { ...config };
	useInitApis({
		[YOUTUBE_API_NAME]: {
			baseUri: YOUTUBE_BASE_URI,
			endpoints: {
				channels: "/channels",
				playlistItems: "/playlistItems",
				videos: "/videos",
			},
			defaultQueryParams: {
				channels: { key: config.apiKey },
				playlistItems: { key: config.apiKey },
				videos: { key: config.apiKey },
			},
		},
		[YOUTUBE_FEED_API_NAME]: {
			baseUri: YOUTUBE_FEED_BASE_URI,
			endpoints: { channelFeed: "/feeds/videos.xml" },
		},
	});
}

/**
 * Returns a shallow copy of the YouTube config (safe to mutate locally).
 *
 * @returns The current `{ apiKey, channelId }`.
 */
export function useGetYoutubeConfig(): YoutubeApiConfig {
	return { ...youtubeConfig };
}

/**
 * Builds the public channel RSS feed URL. Needs no API key and
 * costs zero quota — ideal for "latest videos" widgets.
 *
 * @param channelId - Channel id (`UC…`).
 * @returns Feed URL.
 */
export function useBuildYoutubeRssUrl(channelId: string): string {
	const url = new URL("https://www.youtube.com/feeds/videos.xml");
	url.searchParams.set("channel_id", channelId);
	return url.toString();
}

/**
 * Parses an ISO 8601 duration (`PT1H2M3S`) into seconds.
 * Pure and SSR-safe.
 *
 * @param input - Duration string from `contentDetails.duration`.
 * @returns Total seconds (`0` for invalid input).
 */
export function useParseIso8601Duration(input: string): number {
	const match =
		/^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(
			input.trim(),
		);
	if (!match) return 0;
	const [
		,
		years = "0",
		months = "0",
		weeks = "0",
		days = "0",
		hours = "0",
		minutes = "0",
		seconds = "0",
	] = match;
	return (
		Number(years) * 31_556_952 +
		Number(months) * 2_629_746 +
		Number(weeks) * 604_800 +
		Number(days) * 86_400 +
		Number(hours) * 3600 +
		Number(minutes) * 60 +
		Math.floor(Number(seconds))
	);
}

/**
 * Decodes the five XML entities found in YouTube RSS feeds.
 *
 * @param value - Raw XML text.
 * @returns Decoded text.
 */
function decodeXmlEntities(value: string): string {
	return value
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&");
}

/**
 * Returns a config-error Safe Result when the API key is missing.
 *
 * @param message - Human-readable hint.
 * @returns Error result with `status: 0`.
 */
function youtubeConfigError(message: string): FetchResult<never> {
	return { data: null, error: { message, status: 0 }, url: "", status: 0, ok: false };
}

/**
 * Hydrates a normalized video with player-ready URLs.
 *
 * @param video - Core fields.
 * @returns Full {@link YoutubeVideoNormalized}.
 */
function hydrateVideo(video: {
	id: string;
	title: string;
	description: string;
	publishedAt: string;
	channelTitle?: string;
	thumbnails?: { default?: string; medium?: string; high?: string };
	durationSeconds?: number;
	viewCount?: number;
}): YoutubeVideoNormalized {
	const thumbnails = {
		default: video.thumbnails?.default ?? useBuildYoutubeThumbnail(video.id, "default"),
		medium: video.thumbnails?.medium ?? useBuildYoutubeThumbnail(video.id, "mqdefault"),
		high: video.thumbnails?.high ?? useBuildYoutubeThumbnail(video.id, "hqdefault"),
	};
	return {
		id: video.id,
		title: video.title,
		description: video.description,
		publishedAt: video.publishedAt,
		channelTitle: video.channelTitle,
		thumbnails,
		thumbnail: thumbnails.high,
		url: `https://www.youtube.com/watch?v=${video.id}`,
		embedUrl: useBuildYoutubeEmbedUrl(video.id),
		durationSeconds: video.durationSeconds,
		viewCount: video.viewCount,
	};
}

/**
 * Resolves a channel id to its `uploads` playlist id (quota cost: 1 unit).
 * Prefer passing `playlistId` to `useGetChannelVideos` to skip this call.
 *
 * @param channelId - Channel id (defaults to the configured one).
 * @returns Safe Result with the uploads playlist id.
 */
export async function useGetUploadsPlaylistId(
	channelId = youtubeConfig.channelId,
): Promise<FetchResult<string>> {
	if (!youtubeConfig.apiKey) {
		return youtubeConfigError(
			"Config Error: YouTube API key is missing. Call useInitYoutube({ apiKey, channelId }) first.",
		);
	}
	if (!channelId) {
		return youtubeConfigError(
			"Config Error: channelId is missing. Pass it explicitly or via useInitYoutube.",
		);
	}
	const result = await useGet<YoutubeChannelsResponse>(YOUTUBE_API_NAME, "channels", {
		query: { part: "contentDetails", id: channelId },
	});
	if (!result.ok) {
		return { data: null, error: result.error, url: result.url, status: result.status, ok: false };
	}
	const playlistId = result.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? "";
	if (!playlistId) {
		return {
			data: null,
			error: { message: "YouTube Error: uploads playlist not found for this channel.", status: 404 },
			url: result.url,
			status: 404,
			ok: false,
		};
	}
	return { data: playlistId, error: null, url: result.url, status: result.status, ok: true };
}

/**
 * Lists channel videos via the quota-cheap path
 * (`channels` → `playlistItems`, never `search.list` which costs 100 units).
 * Call server/build-time and cache the response (1h) to share quota
 * across every repo using the same GCP project.
 *
 * @param params - Channel/playlist, page size (1–50) and page token.
 * @returns Safe Result with normalized videos + pagination.
 */
export async function useGetChannelVideos(
	params: YoutubeListParams = {},
): Promise<FetchResult<YoutubeVideoPage>> {
	if (!youtubeConfig.apiKey) {
		return youtubeConfigError(
			"Config Error: YouTube API key is missing. Call useInitYoutube({ apiKey, channelId }) first.",
		);
	}
	let playlistId = params.playlistId ?? "";
	if (!playlistId) {
		const resolved = await useGetUploadsPlaylistId(params.channelId);
		if (!resolved.ok) {
			return {
				data: null,
				error: resolved.error,
				url: resolved.url,
				status: resolved.status,
				ok: false,
			};
		}
		playlistId = resolved.data;
	}
	const maxResults = Math.min(50, Math.max(1, params.maxResults ?? 12));
	const query: Record<string, string | number | undefined> = {
		part: "snippet,contentDetails",
		playlistId,
		maxResults,
		pageToken: params.pageToken,
	};
	const result = await useGet<YoutubePlaylistItemsResponse>(YOUTUBE_API_NAME, "playlistItems", {
		query,
	});
	if (!result.ok) {
		return { data: null, error: result.error, url: result.url, status: result.status, ok: false };
	}
	const videos: YoutubeVideoNormalized[] = [];
	for (const item of result.data.items ?? []) {
		const id = item.snippet?.resourceId?.videoId ?? item.contentDetails?.videoId ?? "";
		if (!id) continue;
		videos.push(
			hydrateVideo({
				id,
				title: item.snippet?.title ?? "",
				description: item.snippet?.description ?? "",
				publishedAt: item.snippet?.publishedAt ?? "",
				channelTitle: item.snippet?.channelTitle,
				thumbnails: {
					default: item.snippet?.thumbnails?.default?.url,
					medium: item.snippet?.thumbnails?.medium?.url,
					high: item.snippet?.thumbnails?.high?.url,
				},
			}),
		);
	}
	return {
		data: {
			videos,
			nextPageToken: result.data.nextPageToken,
			prevPageToken: result.data.prevPageToken,
			totalResults: result.data.pageInfo?.totalResults,
		},
		error: null,
		url: result.url,
		status: result.status,
		ok: true,
	};
}

/**
 * Enriches videos with duration and view count (`videos.list`, 1 unit).
 *
 * @param ids - Up to 50 video ids.
 * @returns Safe Result with enriched videos.
 */
export async function useGetVideoDetails(
	ids: string[],
): Promise<FetchResult<YoutubeVideoNormalized[]>> {
	if (!youtubeConfig.apiKey) {
		return youtubeConfigError(
			"Config Error: YouTube API key is missing. Call useInitYoutube({ apiKey, channelId }) first.",
		);
	}
	if (ids.length === 0 || ids.length > 50) {
		return {
			data: null,
			error: { message: "Validation Error: pass between 1 and 50 video ids.", status: 400 },
			url: "",
			status: 400,
			ok: false,
		};
	}
	const result = await useGet<YoutubeVideosResponse>(YOUTUBE_API_NAME, "videos", {
		query: { part: "snippet,contentDetails,statistics", id: ids.join(",") },
	});
	if (!result.ok) {
		return { data: null, error: result.error, url: result.url, status: result.status, ok: false };
	}
	const videos = (result.data.items ?? [])
		.filter((item) => Boolean(item.id))
		.map((item) =>
			hydrateVideo({
				id: String(item.id),
				title: item.snippet?.title ?? "",
				description: item.snippet?.description ?? "",
				publishedAt: item.snippet?.publishedAt ?? "",
				channelTitle: item.snippet?.channelTitle,
				durationSeconds: item.contentDetails?.duration
					? useParseIso8601Duration(item.contentDetails.duration)
					: undefined,
				viewCount: item.statistics?.viewCount ? Number(item.statistics.viewCount) : undefined,
			}),
		);
	return { data: videos, error: null, url: result.url, status: result.status, ok: true };
}

/**
 * Parses a YouTube channel RSS feed (`feeds/videos.xml`) into normalized
 * videos. Pure and SSR-safe — no network, no DOM parser.
 *
 * @param xml - Raw feed XML.
 * @returns Normalized videos (newest first, as served by the feed).
 */
export function useParseYoutubeRss(xml: string): YoutubeVideoNormalized[] {
	const videos: YoutubeVideoNormalized[] = [];
	const entryPattern = /<entry>([\s\S]*?)<\/entry>/g;
	let entry: RegExpExecArray | null;
	while ((entry = entryPattern.exec(xml)) !== null) {
		const body = entry[1] ?? "";
		const pick = (pattern: RegExp): string => {
			const match = pattern.exec(body);
			return match?.[1] ? decodeXmlEntities(match[1].trim()) : "";
		};
		const id = pick(/<yt:videoId>([^<]+)<\/yt:videoId>/);
		if (!id) continue;
		videos.push(
			hydrateVideo({
				id,
				title: pick(/<title>([\s\S]*?)<\/title>/),
				description: pick(/<media:description>([\s\S]*?)<\/media:description>/),
				publishedAt: pick(/<published>([^<]+)<\/published>/),
				channelTitle: pick(/<author>\s*<name>([\s\S]*?)<\/name>/) || undefined,
			}),
		);
	}
	return videos;
}

/**
 * Fetches the keyless channel RSS feed and parses it. Zero quota,
 * limited to the latest ~15 videos with basic metadata.
 *
 * @param channelId - Channel id (defaults to the configured one).
 * @returns Safe Result with normalized videos.
 */
export async function useGetChannelVideosRss(
	channelId = youtubeConfig.channelId,
): Promise<FetchResult<YoutubeVideoNormalized[]>> {
	if (!channelId) {
		return youtubeConfigError(
			"Config Error: channelId is missing. Pass it explicitly or via useInitYoutube.",
		);
	}
	const result = await useGet<string>(YOUTUBE_FEED_API_NAME, "channelFeed", {
		query: { channel_id: channelId },
	});
	if (!result.ok) {
		return { data: null, error: result.error, url: result.url, status: result.status, ok: false };
	}
	const xml = typeof result.data === "string" ? result.data : "";
	if (!xml) {
		return {
			data: null,
			error: { message: "YouTube Error: empty channel feed.", status: 502 },
			url: result.url,
			status: 502,
			ok: false,
		};
	}
	return {
		data: useParseYoutubeRss(xml),
		error: null,
		url: result.url,
		status: result.status,
		ok: true,
	};
}
