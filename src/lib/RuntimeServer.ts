// services, features, and other libraries
import { Layer, ManagedRuntime } from "effect";
import { Note } from "@/features/notes/db";

const MainLayer = Layer.mergeAll(Note.Default);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
