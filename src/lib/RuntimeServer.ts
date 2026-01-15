// drizzle and db access
import { DB } from "@/drizzle/dbEffect2";
import { Note } from "@/features/notes/db";

// services, features, and other libraries
import { Layer, ManagedRuntime } from "effect";

const MainLayer = Layer.mergeAll(DB.Default, Note.Default);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
