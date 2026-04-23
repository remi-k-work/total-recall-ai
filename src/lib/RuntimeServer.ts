// drizzle and db access
import { DB } from "@/drizzle/dbEffect";
import { NoteDB, NoteTagDB } from "@/features/notes/db";

// services, features, and other libraries
import { Layer, Logger, ManagedRuntime } from "effect";
import { Auth } from "@/features/auth/lib/auth";

const MainLayer = Layer.mergeAll(Logger.pretty, DB.Default, NoteDB.Default, NoteTagDB.Default, Auth.Default);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
