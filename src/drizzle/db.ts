// drizzle and db access
import { drizzle } from "drizzle-orm/node-postgres";

// all table definitions (their schemas)
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
