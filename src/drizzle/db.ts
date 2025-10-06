// drizzle and db access
import { drizzle } from "drizzle-orm/node-postgres";

// all table definitions (their schemas)
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema, casing: "snake_case" });

// types
type DbType = typeof db;

// Extract the `tx` parameter type from db.transaction's callback
type TransactionCallback = Parameters<DbType["transaction"]>[0];
type TxFromDb = Parameters<TransactionCallback>[0];

// This union allows either the full db instance or a transaction
export type DbOrTx = DbType | TxFromDb;
