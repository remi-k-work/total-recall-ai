// drizzle and db access
import { db } from "@/drizzle/db";

// services, features, and other libraries
import { Data, Effect } from "effect";

// Expose the database as a service
export class DB extends Effect.Service<DB>()("DB", { succeed: db }) {}

// Define a domain error for the database
export class DatabaseError extends Data.TaggedError("DatabaseError")<{ message: string; cause?: unknown }> {}
