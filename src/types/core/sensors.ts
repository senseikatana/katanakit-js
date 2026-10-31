import type { z } from "zod";

import { GeoPositionSchema } from "@/schemas/core.schema.js";

/** Represents a geographic position with latitude, longitude and accuracy. */
export type GeoPosition = z.infer<typeof GeoPositionSchema>;

/** Type for the experimental Battery API. */
export interface BatteryManager extends EventTarget {
	charging: boolean;
	chargingTime: number;
	dischargingTime: number;
	level: number;
}
