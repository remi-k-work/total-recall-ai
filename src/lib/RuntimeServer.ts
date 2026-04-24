// drizzle and db access
import { DB } from "@/drizzle/dbEffect";
import { NoteChunkDB, NoteDB, NoteTagDB } from "@/features/notes/db";
import { AvatarDB } from "@/features/profile/db";

// services, features, and other libraries
import { Layer, Logger, ManagedRuntime } from "effect";
import { Auth } from "@/features/auth/lib/auth";

const MainLayer = Layer.mergeAll(Logger.pretty, DB.Default, NoteDB.Default, NoteTagDB.Default, Auth.Default, AvatarDB.Default, NoteChunkDB.Default);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
