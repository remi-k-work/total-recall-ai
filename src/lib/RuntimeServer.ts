// drizzle and db access
import { DB } from "@/drizzle/dbEffect";
import { NoteDB, NoteTagDB } from "@/features/notes/db";

// services, features, and other libraries
import { Layer, ManagedRuntime } from "effect";

const MainLayer = Layer.mergeAll(DB.Default, NoteDB.Default, NoteTagDB.Default);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
