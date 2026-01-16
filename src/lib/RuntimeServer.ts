// drizzle and db access
import { DB } from "@/drizzle/dbEffect";
import { Note, NoteTag } from "@/features/notes/db";

// services, features, and other libraries
import { Layer, ManagedRuntime } from "effect";

const MainLayer = Layer.mergeAll(DB.Default, Note.Default, NoteTag.Default);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
