import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "./schema.json" with { type: "json" };
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("[db] DATABASE_URL is not set. Copy .env.example to .env and configure it.");
}
export const db = postgres({
    contractJson,
    url: DATABASE_URL,
});
//# sourceMappingURL=db.js.map