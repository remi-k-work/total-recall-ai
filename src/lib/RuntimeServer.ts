// drizzle and db access
import { DB } from "@/drizzle/dbEffect";
import { NoteDB, NoteTagDB } from "@/features/notes/db";

// services, features, and other libraries
import { Layer, Logger, ManagedRuntime } from "effect";

const MainLayer = Layer.mergeAll(Logger.pretty, DB.Default, NoteDB.Default, NoteTagDB.Default);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
