import type { z } from "zod";

import { FakeVehicleSchema } from "@/schemas/faker.schema.js";

/** Generic fake vehicle returned by `useFakeVehicle`. */
export type FakeVehicle = z.infer<typeof FakeVehicleSchema>;
