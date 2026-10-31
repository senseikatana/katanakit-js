import type { z } from "zod";

import {
	FileEncodingSchema,
	FileHashAlgorithmSchema,
	FileStatsSchema,
	FilesystemErrorSchema,
	ReadDirEntrySchema,
	ReadDirOptionsSchema,
	WriteFileOptionsSchema,
} from "@/schemas/filesystem.schema.js";

import type { SafeResult } from "./http.js";

/** Text encodings accepted by the filesystem helpers. */
export type FileEncoding = z.infer<typeof FileEncodingSchema>;

/** Hash algorithms supported by `useHashFile` / `useVerifyFileHash`. */
export type FileHashAlgorithm = z.infer<typeof FileHashAlgorithmSchema>;

/** Safe error from a filesystem operation (`NodeJS.ErrnoException`-shaped). */
export type FilesystemError = z.infer<typeof FilesystemErrorSchema>;

/** Safe Result for filesystem operations: `{ data, error, ok }`, never throws. */
export type FilesystemResult<T> = SafeResult<T, FilesystemError>;

/** Portable stats subset returned by `useGetFileStats`. */
export type FileStats = z.infer<typeof FileStatsSchema>;

/** A single directory entry returned by `useReadDir`. */
export type ReadDirEntry = z.infer<typeof ReadDirEntrySchema>;

/** Options for `useReadDir`. */
export type ReadDirOptions = z.infer<typeof ReadDirOptionsSchema>;

/** Options for `useWriteFile` / `useAppendFile`. */
export type WriteFileOptions = z.infer<typeof WriteFileOptionsSchema>;
